/**
 * View Transitions API - 页面过渡动画
 * 需要浏览器支持 (Chrome 111+)
 */

class ViewTransitions {
    constructor() {
      this.supported = 'startViewTransition' in document;
      if (this.supported) {
        this.init();
      }
    }
  
    init() {
      // 拦截链接点击
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        
        if (link && this.shouldTransition(link)) {
          e.preventDefault();
          this.navigate(link.href);
        }
      });
    }
  
    shouldTransition(link) {
      // 只对内部链接使用过渡
      return link.hostname === window.location.hostname &&
             !link.hasAttribute('data-no-transition') &&
             !link.target;
    }
  
    async navigate(url) {
      // 开始视图过渡
      const transition = document.startViewTransition(async () => {
        // 获取新页面内容
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');
        
        // 更新内容
        document.body.innerHTML = newDoc.body.innerHTML;
        
        // 更新 URL
        window.history.pushState({}, '', url);
      });
  
      await transition.finished;
    }
  }
  
  // 初始化
  new ViewTransitions();
  