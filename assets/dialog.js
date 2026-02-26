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
      
      this.init();
    }
  
    init() {
      if (!this.dialog) return;
  
      // 打开对话框
      this.openButtons.forEach(button => {
        button.addEventListener('click', () => this.open());
      });
  
      // 关闭对话框
      this.closeButtons.forEach(button => {
        button.addEventListener('click', () => this.close());
      });
  
      // 点击背景关闭
      this.dialog.addEventListener('click', (e) => {
        if (e.target === this.dialog) {
          this.close();
        }
      });
  
      // ESC 键关闭
      this.dialog.addEventListener('cancel', (e) => {
        e.preventDefault();
        this.close();
      });
    }
  
    open() {
      this.dialog.showModal();
      document.body.style.overflow = 'hidden';
      
      // 触发事件
      this.dispatchEvent(new CustomEvent('dialog:opened'));
    }
  
    close() {
      this.dialog.close();
      document.body.style.overflow = '';
      
      // 触发事件
      this.dispatchEvent(new CustomEvent('dialog:closed'));
    }
  }
  
  customElements.define('dialog-component', DialogComponent);
  