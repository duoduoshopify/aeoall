/**
 * Lumina Theme - Product Form Logic
 * Handles asynchronous "Add to Cart" functionality using Web Components.
 * Reference: Shopify Skeleton / Dawn Standards
 */

if (!customElements.get('product-form')) {
    customElements.define('product-form', class ProductForm extends HTMLElement {
      constructor() {
        super();
  
        this.form = this.querySelector('form');
        // 启用在 Liquid 中为防止无 JS 提交而禁用的变体 ID 输入框
        this.form.querySelector('[name=id]').disabled = false;
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        
        this.submitButton = this.querySelector('[type="submit"]');
        this.cart = document.querySelector('cart-drawer');
      }
  
      /**
       * 拦截表单提交事件，改为 AJAX 提交
       */
      onSubmitHandler(evt) {
        evt.preventDefault();
        
        if (this.submitButton.classList.contains('loading')) return;
  
        this.handleErrorMessage(); // 清除之前的错误提示
  
        // UI 反馈：进入加载状态
        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        
        // 创建请求配置
        const formData = new FormData(this.form);
        
        /**
         * 告诉 Shopify 我们需要获取哪些 Section 的更新 HTML
         * 这样我们可以在一个请求中完成：加购 + 获取最新购物车 HTML
         */
        if (this.cart) {
          formData.append('sections', 'cart-drawer');
          formData.append('sections_url', window.location.pathname);
        }
  
        const config = {
          method: 'POST',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json'
          },
          body: formData
        };
  
        fetch(`${window.routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              // 处理后端返回的错误（如：库存不足）
              this.handleErrorMessage(response.description);
              this.error = true;
              return;
            }
  
            this.error = false;
  
            // 如果页面上有购物车抽屉，则通知它渲染新内容
            if (this.cart) {
              this.cart.renderContents(response);
            } else {
              // 如果没有抽屉，则跳转到购物车页面
              window.location = window.routes.cart_url;
            }

            // 显示成功状态
            if (!this.error) {
              this.submitButton.classList.remove('loading');
              this.submitButton.classList.add('success');
              setTimeout(() => {
                this.submitButton.classList.remove('success');
                this.submitButton.removeAttribute('aria-disabled');
              }, 1500);
            }
          })
          .catch((e) => {
            console.error('Add to cart error:', e);
          })
          .finally(() => {
            if (this.submitButton.classList.contains('success')) return;
            this.submitButton.classList.remove('loading');
            if (!this.error) this.submitButton.removeAttribute('aria-disabled');
          });
      }
  
      /**
       * 显示或隐藏错误信息提示
       * @param {string|boolean} errorMessage - 错误文本内容，若为 false 则隐藏
       */
      handleErrorMessage(errorMessage = false) {
        this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;
        
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');
        
        const variantSelect = this.form.querySelector('[name="id"]');

        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
          this.errorMessage.setAttribute('role', 'alert');
          
          if (variantSelect) {
            variantSelect.setAttribute('aria-describedby', 'product-form-error');
            variantSelect.setAttribute('aria-invalid', 'true');
          }
        } else {
          this.errorMessage.removeAttribute('role');
          
          if (variantSelect) {
            variantSelect.removeAttribute('aria-describedby');
            variantSelect.removeAttribute('aria-invalid');
          }
        }
      }
    });
  }