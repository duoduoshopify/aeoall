/**
 * Performance Monitoring - 性能监控
 * 使用 Performance API 收集真实用户数据
 */

class PerformanceMonitor {
    constructor() {
      this.metrics = {};
      this.init();
    }
  
    init() {
      // 等待页面完全加载
      if (document.readyState === 'complete') {
        this.collectMetrics();
      } else {
        window.addEventListener('load', () => this.collectMetrics());
      }
    }
  
    collectMetrics() {
      // Core Web Vitals
      this.measureCoreWebVitals();
      
      // Navigation Timing
      this.measureNavigationTiming();
      
      // Resource Timing
      this.measureResourceTiming();
      
      // 发送数据
      this.sendMetrics();
    }
  
    measureCoreWebVitals() {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP measurement failed:', e);
        }
  
        // First Input Delay (FID)
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
              this.metrics.fid = entry.processingStart - entry.startTime;
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID measurement failed:', e);
        }
  
        // Cumulative Layout Shift (CLS)
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            this.metrics.cls = clsValue;
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS measurement failed:', e);
        }
      }
    }
  
    measureNavigationTiming() {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
        this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        this.metrics.loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
        this.metrics.domInteractive = navigation.domInteractive - navigation.fetchStart;
      }
    }
  
    measureResourceTiming() {
      const resources = performance.getEntriesByType('resource');
      
      // 统计资源类型
      const resourceStats = {
        scripts: [],
        stylesheets: [],
        images: [],
        fonts: []
      };
  
      resources.forEach(resource => {
        const duration = resource.responseEnd - resource.startTime;
        
        if (resource.name.includes('.js')) {
          resourceStats.scripts.push(duration);
        } else if (resource.name.includes('.css')) {
          resourceStats.stylesheets.push(duration);
        } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)/)) {
          resourceStats.images.push(duration);
        } else if (resource.name.match(/\.(woff|woff2|ttf|otf)/)) {
          resourceStats.fonts.push(duration);
        }
      });
  
      // 计算平均加载时间
      this.metrics.avgScriptLoad = this.average(resourceStats.scripts);
      this.metrics.avgStyleLoad = this.average(resourceStats.stylesheets);
      this.metrics.avgImageLoad = this.average(resourceStats.images);
      this.metrics.avgFontLoad = this.average(resourceStats.fonts);
    }
  
    average(arr) {
      return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    }
  
    sendMetrics() {
      // 延迟发送,避免影响性能
      setTimeout(() => {
        // 可以发送到 Google Analytics, Shopify Analytics 或自己的服务器
        if (window.gtag) {
          // Google Analytics 4
          gtag('event', 'performance_metrics', {
            lcp: Math.round(this.metrics.lcp),
            fid: Math.round(this.metrics.fid),
            cls: this.metrics.cls?.toFixed(3),
            ttfb: Math.round(this.metrics.ttfb)
          });
        }
  
        // 也可以发送到 Shopify Analytics
        if (window.ShopifyAnalytics) {
          window.ShopifyAnalytics.lib.track('Performance Metrics', this.metrics);
        }
  
        // 开发环境下在控制台显示
        if (window.Shopify?.designMode) {
          console.table(this.metrics);
        }
      }, 3000);
    }
  }
  
  // 初始化
  new PerformanceMonitor();
  