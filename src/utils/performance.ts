// Performance monitoring and optimization utilities

/**
 * Measure component render time
 */
export const measureRenderTime = (componentName: string, callback: () => void) => {
  const start = performance.now();
  callback();
  const end = performance.now();
  const duration = end - start;
  
  if (duration > 16.67) { // > 60fps threshold
    console.warn(`Slow render: ${componentName} took ${duration.toFixed(2)}ms`);
  }
  
  return duration;
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Lazy load images with Intersection Observer
 */
export const lazyLoadImage = (img: HTMLImageElement) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target as HTMLImageElement;
          const src = lazyImage.dataset.src;
          if (src) {
            lazyImage.src = src;
            lazyImage.classList.remove("lazy");
            observer.unobserve(lazyImage);
          }
        }
      });
    },
    {
      rootMargin: "50px",
    }
  );
  
  observer.observe(img);
  return () => observer.unobserve(img);
};

/**
 * Monitor Core Web Vitals
 */
export const monitorWebVitals = () => {
  if (typeof window === "undefined") return;
  
  // Largest Contentful Paint (LCP)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const lcp = entry as PerformanceEntry;
      console.log("LCP:", lcp.startTime);
    }
  });
  
  try {
    observer.observe({ entryTypes: ["largest-contentful-paint"] });
  } catch (e) {
    // Browser doesn't support
  }
  
  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const fid = entry as PerformanceEventTiming;
      console.log("FID:", fid.processingStart - fid.startTime);
    }
  });
  
  try {
    fidObserver.observe({ entryTypes: ["first-input"] });
  } catch (e) {
    // Browser doesn't support
  }
};

/**
 * Optimize bundle size by checking for large imports
 */
export const checkBundleSize = () => {
  if (process.env.NODE_ENV === "development") {
    const loadTime = performance.now();
    console.log(`Initial bundle load time: ${loadTime.toFixed(2)}ms`);
  }
};

/**
 * Memory usage monitor (for development)
 */
export const monitorMemory = () => {
  if (process.env.NODE_ENV === "development" && "memory" in performance) {
    const memory = (performance as any).memory;
    console.log("Memory usage:", {
      usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
    });
  }
};

/**
 * Request idle callback wrapper
 */
export const runWhenIdle = (callback: () => void, options?: IdleRequestOptions) => {
  if ("requestIdleCallback" in window) {
    return window.requestIdleCallback(callback, options);
  }
  // Fallback for browsers that don't support requestIdleCallback
  return setTimeout(callback, 1);
};

/**
 * Optimize image loading
 */
export const getOptimizedImageUrl = (url: string, width?: number, quality: number = 75): string => {
  // If using a CDN that supports image optimization, add query parameters
  if (width) {
    return `${url}?w=${width}&q=${quality}`;
  }
  return url;
};

/**
 * Preload critical resources
 */
export const preloadResource = (href: string, as: string) => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

/**
 * Check if device is low-end
 */
export const isLowEndDevice = (): boolean => {
  if ("hardwareConcurrency" in navigator) {
    return navigator.hardwareConcurrency <= 2;
  }
  if ("deviceMemory" in navigator) {
    return (navigator as any).deviceMemory <= 2;
  }
  return false;
};
