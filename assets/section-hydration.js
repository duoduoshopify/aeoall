/**
 * Section Hydration - 区段按需加载
 * 使用 Intersection Observer 实现懒加载
 */

class SectionHydration {
    constructor() {
      this.sections = document.querySelectorAll('[data-section-hydrate]');
      this.observer = null;
      this.init();
    }
  
    init() {
      if (!this.sections.length) return;
  
      // 检查浏览器支持
      if ('IntersectionObserver' in window) {
        this.setupObserver();
      } else {
        // 降级方案:直接加载所有区段
        this.hydrateAll();
      }
    }
  
    setupObserver() {
      const options = {
        root: null,
        rootMargin: '50px', // 提前 50px 开始加载
        threshold: 0.01
      };
  
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.hydrateSection(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      }, options);
  
      this.sections.forEach(section => {
        this.observer.observe(section);
      });
    }
  
    hydrateSection(section) {
      const sectionId = section.dataset.sectionId;
      const sectionType = section.dataset.sectionType;
  
      // 添加加载状态
      section.classList.add('section-hydrating');
  
      // 加载区段特定的 JS
      if (section.dataset.sectionScript) {
        this.loadScript(section.dataset.sectionScript)
          .then(() => {
            section.classList.remove('section-hydrating');
            section.classList.add('section-hydrated');
            
            // 触发自定义事件
            section.dispatchEvent(new CustomEvent('section:hydrated', {
              detail: { sectionId, sectionType }
            }));
          });
      } else {
        section.classList.remove('section-hydrating');
        section.classList.add('section-hydrated');
      }
    }
  
    loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
  
    hydrateAll() {
      this.sections.forEach(section => this.hydrateSection(section));
    }
  }
  
  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new SectionHydration();
    });
  } else {
    new SectionHydration();
  }
  