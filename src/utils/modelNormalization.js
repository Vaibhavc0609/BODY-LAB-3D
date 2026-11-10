import * as THREE from "three";

export const TARGET_MODEL_SIZE = 4.0;

/**
 * Validates orientation and dimensions of a model.
 * Detects unusual aspect ratios, potential up-axis differences, or thin geometries.
 */
export function validateOrientation(dimensions, center) {
  const { x, y, z } = dimensions;
  const maxDim = Math.max(x, y, z);
  const minDim = Math.min(x, y, z);

  const diagnostics = {
    upAxis: "Y",
    isSideways: false,
    isUnusuallyThin: false,
    ratioYZ: y > 0 ? +(z / y).toFixed(2) : 0,
    ratioXZ: z > 0 ? +(x / z).toFixed(2) : 0,
    centerOffset: center ? +(center.length()).toFixed(2) : 0,
    notes: []
  };

  if (maxDim > 0 && minDim / maxDim < 0.005) {
    diagnostics.isUnusuallyThin = true;
    diagnostics.notes.push("Model has extremely thin dimension (possible 2D plane or billboard).");
  }

  // Anatomical and upright models frequently have their longest dimension along Y (cranial-caudal),
  // while horizontal models align along Z or X.
  // with Y being height (typically shorter than length).
  // If Y is significantly greater than both X and Z, it might be standing upright or Z-up in a Y-up system.
  if (y > x * 1.5 && y > z * 1.5) {
    diagnostics.isSideways = true;
    diagnostics.upAxis = "Z-up candidate or vertical";
    diagnostics.notes.push("Model height (Y) exceeds length and width. Possible non-standard up-axis.");
  } else {
    diagnostics.notes.push("Standard orientation detected.");
  }

  return diagnostics;
}

/**
 * Traverses an object and counts meshes, groups, vertices, triangles, and materials.
 */
export function analyzeModelGeometry(root) {
  let meshCount = 0;
  let groupCount = 0;
  let triangleCount = 0;
  let vertexCount = 0;
  const materials = new Set();
  const meshNames = [];

  root.traverse((child) => {
    if (child.isMesh) {
      meshCount++;
      if (child.name) meshNames.push(child.name);
      const geo = child.geometry;
      if (geo) {
        if (geo.attributes.position) {
          vertexCount += geo.attributes.position.count;
        }
        if (geo.index) {
          triangleCount += geo.index.count / 3;
        } else if (geo.attributes.position) {
          triangleCount += geo.attributes.position.count / 3;
        }
      }
      if (child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          if (m) materials.add(m.name || m.type);
        });
      }
    } else if (child.isGroup) {
      groupCount++;
    }
  });

  return {
    meshCount,
    groupCount,
    triangleCount: Math.round(triangleCount),
    vertexCount,
    materialCount: materials.size,
    materials: [...materials],
    meshNames: [...new Set(meshNames)]
  };
}

/**
 * Authoritative Model Normalization Pipeline.
 * 
 * Takes a loaded GLTF scene and wraps it in a standardized container structure:
 * NormalizedModelRoot
 * └── ModelTransform
 *     └── OriginalGLTFScene
 *         └── OriginalMeshes
 *
 * Normalizes the model so:
 * - Its longest bounding-box dimension is exactly TARGET_MODEL_SIZE (4.0 world units).
 * - Its world-space bounding-box center is translated exactly to (0, 0, 0).
 * - Source geometry vertices are preserved unmodified.
 * - Accurate telemetry and bounds metadata are returned.
 */
export function normalizeGLTF(scene, options = {}) {
  const targetSize = options.targetSize ?? TARGET_MODEL_SIZE;

  // 1. Ensure all transforms in the source scene are up to date
  scene.updateMatrixWorld(true);

  // 2. Compute original world-space bounding box
  const originalBox = new THREE.Box3().setFromObject(scene);

  // Fallback for empty or degenerate scenes
  if (originalBox.isEmpty()) {
    const fallbackBox = new THREE.Box3(
      new THREE.Vector3(-1, -1, -1),
      new THREE.Vector3(1, 1, 1)
    );
    const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1.5);
    const normalizedRoot = new THREE.Group();
    normalizedRoot.name = "NormalizedModelRoot";
    normalizedRoot.add(scene);
    return {
      normalizedRoot,
      modelTransform: normalizedRoot,
      originalDimensions: { x: 2, y: 2, z: 2 },
      originalCenter: { x: 0, y: 0, z: 0 },
      normalizedDimensions: { x: targetSize, y: targetSize, z: targetSize },
      normalizationScale: 1,
      normalizedBoundingBox: fallbackBox,
      normalizedBoundingSphere: sphere,
      diagnostics: { notes: ["Empty scene, fallback applied"] },
      meshCount: 0,
      groupCount: 0,
      triangleCount: 0,
      vertexCount: 0,
      materials: [],
      materialCount: 0,
      meshNames: []
    };
  }

  const originalDimensions = originalBox.getSize(new THREE.Vector3());
  const originalCenter = originalBox.getCenter(new THREE.Vector3());

  // 3. Orientation validation
  const diagnostics = validateOrientation(originalDimensions, originalCenter);

  // 4. Calculate scale factor to normalize longest dimension to targetSize
  const maxDim = Math.max(originalDimensions.x, originalDimensions.y, originalDimensions.z);
  const scaleFactor = maxDim > 0 ? targetSize / maxDim : 1.0;

  // 5. Construct container hierarchy to avoid destructive mesh edits
  const normalizedRoot = new THREE.Group();
  normalizedRoot.name = "NormalizedModelRoot";

  const modelTransform = new THREE.Group();
  modelTransform.name = "ModelTransform";

  normalizedRoot.add(modelTransform);
  modelTransform.add(scene);

  // Apply scale and center translation to ModelTransform group:
  // We want the original center * scaleFactor to end up at (0, 0, 0).
  modelTransform.scale.setScalar(scaleFactor);
  modelTransform.position.set(
    -originalCenter.x * scaleFactor,
    -originalCenter.y * scaleFactor,
    -originalCenter.z * scaleFactor
  );

  // Update world matrix for the entire newly structured hierarchy
  normalizedRoot.updateMatrixWorld(true);

  // 6. Compute normalized bounding box and sphere
  const normalizedBoundingBox = new THREE.Box3().setFromObject(normalizedRoot);
  const normalizedDimensions = normalizedBoundingBox.getSize(new THREE.Vector3());
  const normalizedBoundingSphere = new THREE.Sphere();
  normalizedBoundingBox.getBoundingSphere(normalizedBoundingSphere);

  // 7. Extract scene geometric stats
  const stats = analyzeModelGeometry(scene);

  return {
    normalizedRoot,
    modelTransform,
    originalDimensions: {
      x: +originalDimensions.x.toFixed(3),
      y: +originalDimensions.y.toFixed(3),
      z: +originalDimensions.z.toFixed(3)
    },
    originalCenter: {
      x: +originalCenter.x.toFixed(3),
      y: +originalCenter.y.toFixed(3),
      z: +originalCenter.z.toFixed(3)
    },
    normalizedDimensions: {
      x: +normalizedDimensions.x.toFixed(3),
      y: +normalizedDimensions.y.toFixed(3),
      z: +normalizedDimensions.z.toFixed(3)
    },
    normalizationScale: +scaleFactor.toFixed(6),
    normalizedBoundingBox,
    normalizedBoundingSphere,
    diagnostics,
    ...stats
  };
}

/**
 * Recursively disposes geometries, materials, and textures within a Three.js hierarchy.
 */
export function disposeThreeHierarchy(root) {
  if (!root) return;

  root.traverse((child) => {
    if (child.isMesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          if (!mat) return;
          for (const key of Object.keys(mat)) {
            const prop = mat[key];
            if (prop && prop.isTexture) {
              prop.dispose();
            }
          }
          mat.dispose();
        });
      }
    }
  });
}
