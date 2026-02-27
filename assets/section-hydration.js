/**
 * Section Hydration - 高级区段懒加载系统
 *
 * 支持能力：
 * - 按需懒加载区段 JS/CSS（支持单资源和多资源）
 * - 脚本/样式去重加载
 * - Shopify 主题编辑器事件支持
 * - 加载状态与错误状态事件
 * - 基础性能上报
 */

class SectionHydration {
  constructor() {
    this.sections = document.querySelectorAll('[data-section-hydrate]');
    this.observer = null;
    this.loadedScripts = new Set();
    this.loadedStyles = new Set();
    this.scriptPromises = new Map();
    this.stylePromises = new Map();
    this.hydrationQueue = [];
    this.hydrationQueueSet = new Set();
    this.isProcessing = false;
    this.isDesignMode = Boolean(window.Shopify?.designMode);
    this.performanceObserver = null;

    this.init();
  }

  init() {
    if (!this.sections.length) {
      if (this.isDesignMode) {
        console.log('[Section Hydration] No sections to hydrate');
      }
      return;
    }

    if (this.isDesignMode) {
      console.log(`[Section Hydration] Design mode: hydrating ${this.sections.length} sections immediately`);
      this.hydrateAll();
      this.setupEditorListeners();
      this.setupPerformanceObserver();
      return;
    }

    if ('IntersectionObserver' in window) {
      this.setupObserver();
    } else {
      console.warn('[Section Hydration] IntersectionObserver not supported, hydrating all sections');
      this.hydrateAll();
    }

    this.setupVisibilityListener();
  }

  setupObserver() {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.01
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.queueHydration(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    this.sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

      if (isInViewport) {
        this.queueHydration(section);
      } else {
        this.observer.observe(section);
      }
    });
  }

  queueHydration(section) {
    if (!section || section.classList.contains('section-hydrated') || section.classList.contains('section-hydrating')) {
      return;
    }

    if (this.hydrationQueueSet.has(section)) {
      return;
    }

    this.hydrationQueue.push(section);
    this.hydrationQueueSet.add(section);

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (!this.hydrationQueue.length) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const section = this.hydrationQueue.shift();
    this.hydrationQueueSet.delete(section);

    try {
      await this.hydrateSection(section);
    } catch (error) {
      console.error('[Section Hydration] Error hydrating section:', error);
    }

    requestAnimationFrame(() => this.processQueue());
  }

  async hydrateSection(section) {
    if (!section || section.classList.contains('section-hydrated')) {
      return;
    }

    const sectionId = section.dataset.sectionId || '';
    const sectionType = section.dataset.sectionType || 'unknown';
    const scriptList = this.getSectionAssets(section, 'script');
    const styleList = this.getSectionAssets(section, 'style');

    section.classList.add('section-hydrating');
    section.setAttribute('aria-busy', 'true');

    const startTime = performance.now();

    try {
      const promises = [];

      styleList.forEach((href) => {
        if (!this.loadedStyles.has(href)) {
          promises.push(this.loadStyle(href));
        }
      });

      scriptList.forEach((src) => {
        if (!this.loadedScripts.has(src)) {
          promises.push(this.loadScript(src));
        }
      });

      await Promise.all(promises);

      section.classList.remove('section-hydrating');
      section.classList.add('section-hydrated');
      section.removeAttribute('aria-busy');

      const loadTime = performance.now() - startTime;

      if (this.isDesignMode) {
        console.log(`[Section Hydration] Hydrated ${sectionType} (${sectionId}) in ${loadTime.toFixed(2)}ms`);
      }

      section.dispatchEvent(new CustomEvent('section:hydrated', {
        detail: {
          sectionId,
          sectionType,
          loadTime
        },
        bubbles: true
      }));

      this.trackPerformance(sectionType, loadTime);
    } catch (error) {
      section.classList.remove('section-hydrating');
      section.classList.add('section-hydration-error');
      section.removeAttribute('aria-busy');

      section.dispatchEvent(new CustomEvent('section:hydration-error', {
        detail: {
          sectionId,
          sectionType,
          error: error?.message || 'Unknown error'
        },
        bubbles: true
      }));

      console.error(`[Section Hydration] Failed to hydrate section: ${sectionType}`, error);
    }
  }

  getSectionAssets(section, type) {
    const keySingle = type === 'script' ? 'sectionScript' : 'sectionStyle';
    const keyMulti = type === 'script' ? 'sectionScripts' : 'sectionStyles';
    const items = [];

    if (section.dataset[keySingle]) {
      items.push(section.dataset[keySingle]);
    }

    if (section.dataset[keyMulti]) {
      section.dataset[keyMulti]
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => items.push(item));
    }

    return [...new Set(items)];
  }

  loadScript(src) {
    if (!src) return Promise.resolve();

    if (this.loadedScripts.has(src)) {
      return Promise.resolve();
    }

    if (this.scriptPromises.has(src)) {
      return this.scriptPromises.get(src);
    }

    const promise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        this.loadedScripts.add(src);
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        this.loadedScripts.add(src);
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

      document.head.appendChild(script);
    }).finally(() => {
      this.scriptPromises.delete(src);
    });

    this.scriptPromises.set(src, promise);
    return promise;
  }

  loadStyle(href) {
    if (!href) return Promise.resolve();

    if (this.loadedStyles.has(href)) {
      return Promise.resolve();
    }

    if (this.stylePromises.has(href)) {
      return this.stylePromises.get(href);
    }

    const promise = new Promise((resolve, reject) => {
      const existingLink = document.querySelector(`link[href="${href}"]`);
      if (existingLink) {
        this.loadedStyles.add(href);
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => {
        this.loadedStyles.add(href);
        resolve();
      };
      link.onerror = () => reject(new Error(`Failed to load style: ${href}`));

      document.head.appendChild(link);
    }).finally(() => {
      this.stylePromises.delete(href);
    });

    this.stylePromises.set(href, promise);
    return promise;
  }

  hydrateAll() {
    this.sections.forEach((section) => this.queueHydration(section));
  }

  setupEditorListeners() {
    document.addEventListener('shopify:section:load', (event) => {
      const sectionId = event?.detail?.sectionId;
      if (!sectionId) return;

      const selector = `[data-section-hydrate][data-section-id="${sectionId}"]`;
      const newSection = document.querySelector(selector);
      if (newSection) {
        this.queueHydration(newSection);
      }
    });

    document.addEventListener('shopify:section:reorder', () => {
      this.sections = document.querySelectorAll('[data-section-hydrate]');
      if (this.observer) {
        this.observer.disconnect();
      }
      this.setupObserver();
    });
  }

  setupVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) return;

      const unhydrated = document.querySelectorAll('[data-section-hydrate]:not(.section-hydrated):not(.section-hydrating)');
      unhydrated.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInViewport) {
          this.queueHydration(section);
        }
      });
    });
  }

  setupPerformanceObserver() {
    if (!this.isDesignMode || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.initiatorType === 'script' || entry.initiatorType === 'link') {
            if (entry.name && entry.name.includes('section')) {
              console.log(`[Section Hydration] Resource: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
            }
          }
        });
      });

      this.performanceObserver.observe({ entryTypes: ['resource'] });
    } catch (error) {
      // 忽略不支持的浏览器异常
    }
  }

  trackPerformance(sectionType, loadTime) {
    if (window.gtag) {
      window.gtag('event', 'section_hydration', {
        event_category: 'Performance',
        event_label: sectionType,
        value: Math.round(loadTime)
      });
    }

    if (window.ShopifyAnalytics?.lib?.track) {
      window.ShopifyAnalytics.lib.track('Section Hydration', {
        sectionType,
        loadTime: Math.round(loadTime)
      });
    }
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
  }

  refresh() {
    this.sections = document.querySelectorAll('[data-section-hydrate]');
    if (this.observer) {
      this.observer.disconnect();
    }
    this.hydrationQueue = [];
    this.hydrationQueueSet.clear();
    this.isProcessing = false;
    this.init();
  }

  static hydrate(sectionElement) {
    if (!sectionElement || !sectionElement.hasAttribute('data-section-hydrate')) {
      return;
    }

    if (window.sectionHydration instanceof SectionHydration) {
      window.sectionHydration.queueHydration(sectionElement);
      return;
    }

    const instance = new SectionHydration();
    instance.queueHydration(sectionElement);
  }

  static preload(sectionElement) {
    if (!sectionElement || !sectionElement.hasAttribute('data-section-hydrate')) {
      return;
    }

    const appendPreload = (href, asType) => {
      if (!href || document.querySelector(`link[rel="preload"][href="${href}"]`)) return;

      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = asType;
      preloadLink.href = href;
      document.head.appendChild(preloadLink);
    };

    const scripts = [];
    if (sectionElement.dataset.sectionScript) scripts.push(sectionElement.dataset.sectionScript);
    if (sectionElement.dataset.sectionScripts) {
      sectionElement.dataset.sectionScripts
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => scripts.push(item));
    }

    const styles = [];
    if (sectionElement.dataset.sectionStyle) styles.push(sectionElement.dataset.sectionStyle);
    if (sectionElement.dataset.sectionStyles) {
      sectionElement.dataset.sectionStyles
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => styles.push(item));
    }

    [...new Set(scripts)].forEach((src) => appendPreload(src, 'script'));
    [...new Set(styles)].forEach((href) => appendPreload(href, 'style'));
  }
}

let sectionHydrationInstance;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    sectionHydrationInstance = new SectionHydration();
    window.sectionHydration = sectionHydrationInstance;
  });
} else {
  sectionHydrationInstance = new SectionHydration();
  window.sectionHydration = sectionHydrationInstance;
}

window.SectionHydration = SectionHydration;

if (window.Shopify?.designMode) {
  console.log('[Section Hydration] Debug mode enabled. Use window.sectionHydration to inspect.');
}
  