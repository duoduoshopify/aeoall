/**
 * Lumina Theme - Global JS Engine
 * -----------------------------------------------------------------------------
 * 包含：基础工具、移动端抽屉导航、变体选择(Web Component)、AJAX 加购逻辑
 */

// ==========================================
// 1. 基础工具函数
// ==========================================

// 防抖函数，用于优化高频触发事件（如滚动、窗口缩放）
function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
  
  // 货币格式化 (Shopify 标准货币转换工具)
  function formatMoney(cents, format) {
    if (typeof cents === 'string') cents = cents.replace('.', '');
    let value = '';
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = format || window.routes?.money_format || "$ {{amount}}";
  
    function formatWithDelimiters(number, precision = 2, thousands = ',', decimal = '.') {
      if (isNaN(number) || number == null) return 0;
      number = (number / 100.0).toFixed(precision);
      const parts = number.split('.');
      const dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      const centsAmount = parts[1] ? decimal + parts[1] : '';
      return dollarsAmount + centsAmount;
    }
  
    const match = formatString.match(placeholderRegex);
    if (!match) return formatWithDelimiters(cents);
  
    switch (match[1]) {
      case 'amount': value = formatWithDelimiters(cents, 2); break;
      case 'amount_no_decimals': value = formatWithDelimiters(cents, 0); break;
      case 'amount_with_comma_separator': value = formatWithDelimiters(cents, 2, '.', ','); break;
      case 'amount_no_decimals_with_comma_separator': value = formatWithDelimiters(cents, 0, '.', ','); break;
    }
    return formatString.replace(placeholderRegex, value);
  }
  
  // ==========================================
  // 2. 导航系统 (专为拆分后的手机端优化)
  // ==========================================
  
  document.addEventListener('DOMContentLoaded', () => {
    const burgerBtn = document.querySelector('.burger-menu');
    const mobileDrawer = document.getElementById('MobileNavDrawer');
    const body = document.body;
  
    // A. 移动端抽屉菜单开启/关闭逻辑
    if (burgerBtn && mobileDrawer) {
      burgerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isActive = burgerBtn.classList.contains('active');
        
        // 切换按钮状态 (汉堡变X)
        burgerBtn.classList.toggle('active');
        burgerBtn.setAttribute('aria-expanded', !isActive);
        
        // 切换侧边抽屉滑入/滑出
        mobileDrawer.classList.toggle('active');
        
        // 防止背景页面滚动
        if (!isActive) {
          body.style.overflow = 'hidden';
        } else {
          body.style.overflow = '';
        }
      });
    }
  
    // B. 移动端抽屉内部的多级折叠 (Accordion) - 支持三级导航
    const mobileToggles = document.querySelectorAll('.mobile-toggle');
    mobileToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parentItem = toggle.closest('.mobile-item');
        
        // 切换展开状态
        parentItem.classList.toggle('is-open');
        
        // 更新无障碍属性
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        
        // 关闭同级其他展开的菜单
        const siblings = parentItem.parentElement.querySelectorAll('.mobile-item.is-open');
        siblings.forEach(sibling => {
          if (sibling !== parentItem) {
            sibling.classList.remove('is-open');
            const siblingToggle = sibling.querySelector('.mobile-toggle');
            if (siblingToggle) {
              siblingToggle.setAttribute('aria-expanded', 'false');
            }
          }
        });
      });
    });
  });
  
  // ==========================================
  // 3. 变体选择组件 (Variant Selects)
  // ==========================================
  
  if (!customElements.get('variant-selects')) {
    customElements.define('variant-selects', class VariantSelects extends HTMLElement {
      constructor() {
        super();
        this.addEventListener('change', this.onVariantChange.bind(this));
      }
  
      onVariantChange() {
        this.updateOptions();
        this.updateMasterId();
        this.toggleAddButton(true, '', false);
        this.removeErrorMessage();
  
        if (!this.currentVariant) {
          this.toggleAddButton(true, '', true);
          this.setUnavailable();
        } else {
          this.updateMedia();
          this.updateURL();
          this.updateVariantInput();
          this.renderProductInfo();
        }
      }
  
      // 获取当前页面上选中的所有 Radio 的值
      updateOptions() {
        this.options = Array.from(this.querySelectorAll('fieldset'), (fieldset) => {
          const checkedRadio = Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked);
          return checkedRadio ? checkedRadio.value : '';
        });
      }
  
      // 在 JSON 中匹配选中的组合 ID
      updateMasterId() {
        this.currentVariant = this.getVariantData().find((variant) => {
          return !variant.options.map((option, index) => {
            return this.options[index] === option;
          }).includes(false);
        });
      }
  
      // 联动产品主图切换
      updateMedia() {
        if (!this.currentVariant || !this.currentVariant.featured_media) return;
        const newMediaId = `${this.dataset.section}-${this.currentVariant.featured_media.id}`;
        const targetMedia = document.getElementById(newMediaId);
        if (targetMedia) {
          targetMedia.parentElement.prepend(targetMedia); // 将图片置顶
        }
      }
  
      // 动态更新浏览器地址栏 (无需刷新页面)
      updateURL() {
        if (!this.currentVariant || this.getAttribute('data-update-url') === 'false') return;
        window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
      }
  
      // 将选中的 Variant ID 注入隐藏的提交表单
      updateVariantInput() {
        const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}`);
        productForms.forEach((form) => {
          const input = form.querySelector('input[name="id"]');
          if (input) {
            input.value = this.currentVariant.id;
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      }
  
      // 核心：调用 Shopify API 局部刷新价格和按钮
      renderProductInfo() {
        fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
          .then((response) => response.text())
          .then((responseText) => {
            const html = new DOMParser().parseFromString(responseText, 'text/html');
            
            // 更新价格 HTML
            const id = `price-${this.dataset.section}`;
            const destination = document.getElementById(id);
            const source = html.getElementById(id);
            if (source && destination) destination.innerHTML = source.innerHTML;
  
            // 更新购买按钮的状态和文案
            const addButton = document.getElementById(`ProductSubmitButton-${this.dataset.section}`);
            const addButtonSource = html.getElementById(`ProductSubmitButton-${this.dataset.section}`);
            
            if (addButton && addButtonSource) {
              if (addButtonSource.hasAttribute('disabled')) {
                addButton.setAttribute('disabled', 'disabled');
                addButton.querySelector('span').textContent = window.variantStrings?.soldOut || 'Sold Out';
              } else {
                addButton.removeAttribute('disabled');
                addButton.querySelector('span').textContent = window.variantStrings?.addToCart || 'Add to Cart — SHIPS FREE';
              }
            }
          });
      }
  
      getVariantData() {
        this.variantData = this.variantData || JSON.parse(this.querySelector('script[type="application/json"]').textContent);
        return this.variantData;
      }
  
      toggleAddButton(disable = true, text = '') {
        const addButton = document.getElementById(`ProductSubmitButton-${this.dataset.section}`);
        if (!addButton) return;
        if (disable) {
          addButton.setAttribute('disabled', 'disabled');
          if (text) addButton.querySelector('span').textContent = text;
        } else {
          addButton.removeAttribute('disabled');
          if (text) addButton.querySelector('span').textContent = text;
        }
      }
  
      setUnavailable() {
        const addButton = document.getElementById(`ProductSubmitButton-${this.dataset.section}`);
        if (!addButton) return;
        addButton.querySelector('span').textContent = window.variantStrings?.unavailable || 'Unavailable';
        addButton.setAttribute('disabled', 'disabled');
      }
  
      removeErrorMessage() {
        const section = this.closest('section');
        if (!section) return;
        const productForm = section.querySelector('product-form');
        if (productForm) productForm.handleErrorMessage();
      }
    });
  }
  
  // ==========================================
  // 4. AJAX 加购组件 (Product Form)
  // ==========================================
  
  if (!customElements.get('product-form')) {
    customElements.define('product-form', class ProductForm extends HTMLElement {
      constructor() {
        super();
        this.form = this.querySelector('form');
        
        const variantInput = this.form.querySelector('[name=id]');
        if (variantInput) variantInput.disabled = false;
        
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cart = document.querySelector('cart-drawer');
      }
  
      onSubmitHandler(evt) {
        evt.preventDefault();
        const submitButton = this.querySelector('[type="submit"]');
        if (submitButton.classList.contains('loading')) return;
  
        this.handleErrorMessage(); // 提交前清空错误
  
        // 进入 loading 状态
        submitButton.setAttribute('aria-disabled', true);
        submitButton.classList.add('loading');
  
        const formData = new FormData(this.form);
        
        // 如果存在购物车抽屉，通知 API 顺便返回最新的抽屉 HTML
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
              this.handleErrorMessage(response.description);
              return;
            }
            
            if (this.cart) {
              // 将 API 返回的 HTML 交给抽屉去渲染并自动打开
              this.cart.renderContents(response);
            } else {
              // 后备方案：如果没有抽屉，跳往购物车页面
              window.location = window.routes.cart_url;
            }
          })
          .catch((e) => {
            console.error('Add to cart error:', e);
          })
          .finally(() => {
            submitButton.classList.remove('loading');
            // 如果没有报错，恢复按钮可用性
            if (!this.querySelector('.product-form__error-message-wrapper:not([hidden])')) {
              submitButton.removeAttribute('aria-disabled');
            }
          });
      }
  
      handleErrorMessage(errorMessage = false) {
        this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;
        
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');
        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);
        
        if (errorMessage && this.errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }
    });
  }