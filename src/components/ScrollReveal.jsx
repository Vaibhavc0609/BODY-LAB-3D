import { useEffect, useRef, useState } from "react";

/**
 * Smooth IntersectionObserver reveal wrapper for scroll story blocks & catalog cards.
 * Reveals immediately if already within initial viewport fold to avoid flash-of-invisible content.
 */
export default function RevealBlock({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  threshold = 0.14,
  ...rest
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(
    () => typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || isVisible || typeof IntersectionObserver === "undefined") return;

    const rafId = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
        setIsVisible(true);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -36px 0px" }
    );

    observer.observe(el);
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [threshold, isVisible]);

  return (
    <Tag
      ref={ref}
      className={`reveal-block ${isVisible ? "is-visible" : ""} ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms`, ...rest.style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

