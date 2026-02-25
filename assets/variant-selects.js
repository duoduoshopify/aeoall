/**
 * AEOall Pro - Advanced Variant Selection Engine
 * Handles real-time updates for Price, SKU, Inventory, and Media.
 */
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
  
      // 1. 采集当前选中的所有变体值
      updateOptions() {
        this.options = Array.from(this.querySelectorAll('fieldset'), (fieldset) => {
          return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
        });
      }
  
      // 2. 根据选项组合匹配 Variant ID
      updateMasterId() {
        this.currentVariant = this.getVariantData().find((variant) => {
          return !variant.options.map((option, index) => {
            return this.options[index] === option;
          }).includes(false);
        });
      }
  
      // 3. 更新图片/媒体库
      updateMedia() {
        if (!this.currentVariant || !this.currentVariant.featured_media) return;
        const newMediaId = `${this.dataset.section}-${this.currentVariant.featured_media.id}`;
        const targetMedia = document.getElementById(newMediaId);
        if (targetMedia) {
          targetMedia.parentElement.prepend(targetMedia); // 置顶关联图片
        }
      }
  
      // 4. 更新浏览器 URL (不刷新页面)
      updateURL() {
        if (!this.currentVariant || this.getAttribute('data-update-url') === 'false') return;
        window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
      }
  
      // 5. 更新隐藏表单 ID，确保加购正确
      updateVariantInput() {
        const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-main`);
        productForms.forEach((form) => {
          const input = form.querySelector('input[name="id"]');
          input.value = this.currentVariant.id;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
  
      // 6. 核心：通过 API 局部刷新 HTML 组件
      renderProductInfo() {
        fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
          .then((response) => response.text())
          .then((responseText) => {
            const html = new DOMParser().parseFromString(responseText, 'text/html');
            
            // 更新：价格
            this.updateLiveRegion(html, `price-${this.dataset.section}`);
            
            // 更新：SKU (如果存在)
            this.updateLiveRegion(html, `sku-${this.dataset.section}`);
            
            // 更新：库存状态 (如果存在)
            this.updateLiveRegion(html, `inventory-${this.dataset.section}`);
  
            // 更新：购买按钮状态
            const addButtonSource = html.getElementById(`ProductSubmitButton-${this.dataset.section}`);
            const addButtonDest = document.getElementById(`ProductSubmitButton-${this.dataset.section}`);
            if (addButtonSource && addButtonDest) {
              addButtonDest.innerHTML = addButtonSource.innerHTML;
              if (addButtonSource.hasAttribute('disabled')) {
                addButtonDest.setAttribute('disabled', 'disabled');
              } else {
                addButtonDest.removeAttribute('disabled');
              }
            }
          });
      }
  
      updateLiveRegion(html, id) {
        const source = html.getElementById(id);
        const destination = document.getElementById(id);
        if (source && destination) destination.innerHTML = source.innerHTML;
      }
  
      getVariantData() {
        this.variantData = this.variantData || JSON.parse(this.querySelector('script[type="application/json"]').textContent);
        return this.variantData;
      }
  
      toggleAddButton(disable = true, text = '', modifyClass = true) {
        const addButton = document.getElementById(`ProductSubmitButton-${this.dataset.section}`);
        if (!addButton) return;
        if (disable) addButton.setAttribute('disabled', 'disabled');
        else addButton.removeAttribute('disabled');
      }
  
      setUnavailable() {
        const addButton = document.getElementById(`ProductSubmitButton-${this.dataset.section}`);
        if (!addButton) return;
        const addButtonText = addButton.querySelector('.atc-text');
        if (addButtonText) addButtonText.textContent = window.variantStrings.unavailable;
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