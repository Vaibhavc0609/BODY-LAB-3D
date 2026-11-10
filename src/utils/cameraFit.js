import * as THREE from "three";

export const DEFAULT_SAFETY_MARGIN = 1.15;
// Front-facing standing body direction (+Z with slight eye-level elevation)
export const DEFAULT_VIEW_DIR = new THREE.Vector3(0, 0.02, 1).normalize();

/**
 * Calculates mathematically correct camera distance, positioning, target,
 * and clipping planes to frame a bounding box or bounding sphere.
 *
 * Supports both PerspectiveCamera and OrthographicCamera.
 * Accounts for viewport aspect ratio and limiting field of view (vertical vs horizontal).
 */
export function calculateCameraFit(camera, boundingBoxOrSphere, options = {}) {
  const safetyMargin = options.safetyMargin ?? DEFAULT_SAFETY_MARGIN;
  const viewDirection = (options.direction || DEFAULT_VIEW_DIR).clone().normalize();
  const aspect = options.aspect || camera.aspect || 1;

  // Extract sphere
  let sphere = new THREE.Sphere();
  if (boundingBoxOrSphere.isSphere) {
    sphere.copy(boundingBoxOrSphere);
  } else if (boundingBoxOrSphere.isBox3) {
    boundingBoxOrSphere.getBoundingSphere(sphere);
  } else {
    sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 2.5);
  }

  const R = Math.max(0.001, sphere.radius);
  const target = options.target ? options.target.clone() : sphere.center.clone();

  let fitDistance = 0;
  let finalDistance = 0;
  let near = 0.1;
  let far = 1000;
  let vFov = 0;
  let hFov = 0;
  let limitingFov = 0;

  if (camera.isPerspectiveCamera || camera.fov !== undefined) {
    const fovDeg = camera.fov || 40;
    vFov = THREE.MathUtils.degToRad(fovDeg);
    hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    limitingFov = Math.min(vFov, hFov);

    fitDistance = R / Math.sin(limitingFov / 2);
    finalDistance = fitDistance * safetyMargin;

    near = Math.min(0.15, Math.max(0.05, finalDistance - R * 2.5));
    far = Math.max(100, finalDistance + R * 6.0);
  } else if (camera.isOrthographicCamera) {
    // Orthographic fitting
    const zoomX = (camera.right - camera.left) / (2 * R * safetyMargin);
    const zoomY = (camera.top - camera.bottom) / (2 * R * safetyMargin);
    const fitZoom = Math.min(zoomX, zoomY);
    finalDistance = R * 4;
    fitDistance = finalDistance;
    near = 0.1;
    far = Math.max(200, R * 10);
    return {
      isOrthographic: true,
      zoom: fitZoom,
      target,
      position: target.clone().addScaledVector(viewDirection, finalDistance),
      near,
      far,
      R,
      fitDistance,
      finalDistance
    };
  }

  const cameraPosition = target.clone().addScaledVector(viewDirection, finalDistance);

  return {
    isOrthographic: false,
    target,
    position: cameraPosition,
    distance: finalDistance,
    fitDistance,
    safetyMargin,
    R,
    vFovDeg: +(THREE.MathUtils.radToDeg(vFov)).toFixed(1),
    hFovDeg: +(THREE.MathUtils.radToDeg(hFov)).toFixed(1),
    limitingFovDeg: +(THREE.MathUtils.radToDeg(limitingFov)).toFixed(1),
    near: +near.toFixed(3),
    far: +far.toFixed(1)
  };
}

/**
 * Applies calculated fit values to camera and OrbitControls.
 */
export function applyCameraFit(camera, controls, fitResult) {
  if (!camera || !fitResult) return;

  if (fitResult.isOrthographic) {
    camera.zoom = fitResult.zoom;
  }

  camera.position.copy(fitResult.position);
  camera.near = fitResult.near;
  camera.far = fitResult.far;
  camera.lookAt(fitResult.target);
  camera.updateProjectionMatrix();

  if (controls) {
    controls.target.copy(fitResult.target);
    controls.minDistance = Math.max(0.1, fitResult.distance * 0.15);
    controls.maxDistance = Math.max(15, fitResult.distance * 4.0);
    controls.update();
  }
}
