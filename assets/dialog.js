/**
 * Dialog Component - 对话框组件
 * 使用原生 <dialog> 元素
 */

class DialogComponent extends HTMLElement {
    constructor() {
      super();
      this.dialog = this.querySelector('dialog');
      this.openButtons = document.querySelectorAll(`[data-dialog-open="${this.id}"]`);
      this.closeButtons = this.querySelectorAll('[data-dialog-close]');
      this.supportsNativeDialog = Boolean(this.dialog && typeof this.dialog.showModal === 'function');
      this.backdrop = null;
      
      this.init();
    }
  
    init() {
      if (!this.dialog) return;

      if (!this.supportsNativeDialog) {
        this.enableFallbackMode();
      }
  
      // 打开对话框
      this.openButtons.forEach(button => {
        button.addEventListener('click', () => this.open());
      });
  
      // 关闭对话框
      this.closeButtons.forEach(button => {
        button.addEventListener('click', () => this.close());
      });
  
      // 点击背景关闭
      if (this.supportsNativeDialog) {
        this.dialog.addEventListener('click', (e) => {
          if (e.target === this.dialog) {
            this.close();
          }
        });
      }
  
      // ESC 键关闭
      if (this.supportsNativeDialog) {
        this.dialog.addEventListener('cancel', (e) => {
          e.preventDefault();
          this.close();
        });
      } else {
        this.onFallbackKeydown = (event) => {
          if (event.key === 'Escape' && this.dialog.hasAttribute('open')) {
            this.close();
          }
        };

        document.addEventListener('keydown', this.onFallbackKeydown);
      }
    }

    enableFallbackMode() {
      this.dialog.classList.add('dialog--fallback');
      this.dialog.setAttribute('role', 'dialog');
      this.dialog.setAttribute('aria-modal', 'true');
      this.dialog.setAttribute('hidden', 'hidden');

      this.backdrop = document.createElement('div');
      this.backdrop.className = 'dialog-fallback-backdrop';
      this.backdrop.setAttribute('hidden', 'hidden');
      this.backdrop.addEventListener('click', () => this.close());
      document.body.appendChild(this.backdrop);
    }
  
    open() {
      if (this.supportsNativeDialog) {
        this.dialog.showModal();
      } else {
        this.dialog.removeAttribute('hidden');
        this.dialog.setAttribute('open', 'open');
        this.classList.add('is-open');
        if (this.backdrop) this.backdrop.removeAttribute('hidden');
      }

      document.body.style.overflow = 'hidden';
      
      // 触发事件
      this.dispatchEvent(new CustomEvent('dialog:opened'));
    }
  
    close() {
      if (this.supportsNativeDialog) {
        this.dialog.close();
      } else {
        this.dialog.removeAttribute('open');
        this.dialog.setAttribute('hidden', 'hidden');
        this.classList.remove('is-open');
        if (this.backdrop) this.backdrop.setAttribute('hidden', 'hidden');
      }

      document.body.style.overflow = '';
      
      // 触发事件
      this.dispatchEvent(new CustomEvent('dialog:closed'));
    }
  }
  
  customElements.define('dialog-component', DialogComponent);
  