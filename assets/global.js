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

  function pushAnalyticsEvent(eventName, payload = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...payload });
  }

  function runOnFirstInteraction(callback) {
    if (typeof callback !== 'function') return;

    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
    let done = false;

    const cleanup = () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, onFirstInteraction, { passive: true });
      });
    };

    const onFirstInteraction = () => {
      if (done) return;
      done = true;
      cleanup();
      callback();
    };

    events.forEach((eventName) => {
      window.addEventListener(eventName, onFirstInteraction, { passive: true, once: true });
    });
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
    const globalCartBehavior = window.themeSettings?.cartBehaviorMode || 'drawer';
    const headerMain = document.querySelector('.header-main');
    const cartIcon = document.getElementById('cart-icon-bubble');
    const cartPopover = document.getElementById('HeaderCartPopover');
    const burgerBtn = document.querySelector('.burger-menu');
    const mobileDrawer = document.getElementById('MobileNavDrawer');
    const mobileOverlay = document.getElementById('MobileDrawerOverlay');
    const body = document.body;

    // Header sticky behavior
    if (headerMain) {
      const stickyModeRaw = headerMain.dataset.stickyMode || 'on_scroll';
      // 已移除 always 模式：为兼容历史配置，自动降级为 on_scroll
      const stickyMode = stickyModeRaw === 'always' ? 'on_scroll' : stickyModeRaw;
      const cartBehavior = globalCartBehavior || headerMain.dataset.cartBehavior || cartIcon?.dataset.cartBehavior || 'drawer';
      const headerSectionId = headerMain.dataset.headerSection || '';
      const stickySentinel = headerSectionId
        ? document.querySelector(`[data-header-sentinel="${headerSectionId}"]`)
        : null;
      const headerSpacer = headerSectionId
        ? document.querySelector(`[data-header-spacer="${headerSectionId}"]`)
        : null;
      window.themeCartBehavior = cartBehavior;
      let lastScrollY = window.scrollY;
      let isHeaderPinned = false;
      let stickyObserver = null;

      const syncHeaderSpacer = (pinned = false) => {
        if (!headerSpacer) return;

        const measuredHeight = Math.round(headerMain.getBoundingClientRect().height || headerMain.offsetHeight || 0);
        // 防止异常情况下 spacer 被撑得过高，导致中间出现大空白
        const safeHeight = Math.max(0, Math.min(measuredHeight, 160));

        headerSpacer.style.height = pinned ? `${safeHeight}px` : '0px';
      };

      const setupStickyObserver = () => {
        if (stickyObserver) {
          stickyObserver.disconnect();
          stickyObserver = null;
        }

        if (stickyMode === 'hide_on_scroll') {
          isHeaderPinned = true;
          headerMain.classList.add('is-pinned');
          headerMain.classList.add('is-stuck');
          syncHeaderSpacer(true);
          return;
        }

        if (stickyMode !== 'on_scroll' || !stickySentinel) {
          isHeaderPinned = false;
          headerMain.classList.remove('is-pinned');
          headerMain.classList.remove('is-stuck');
          headerMain.classList.remove('is-hidden');
          syncHeaderSpacer(false);
          return;
        }

        stickyObserver = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (!entry) return;

            const nextPinned = !entry.isIntersecting;
            isHeaderPinned = nextPinned;

            headerMain.classList.toggle('is-pinned', nextPinned);
            headerMain.classList.toggle('is-stuck', nextPinned);

            syncHeaderSpacer(nextPinned);

            if (!nextPinned) {
              headerMain.classList.remove('is-hidden');
            }
          },
          {
            threshold: [0, 1],
            rootMargin: '0px 0px 0px 0px'
          }
        );

        stickyObserver.observe(stickySentinel);
      };

      const applyHeaderOffset = () => {
        if (stickyMode === 'hide_on_scroll' || stickyMode === 'on_scroll') {
          document.body.classList.add('has-sticky-header');
          setupStickyObserver();
          syncHeaderSpacer(headerMain.classList.contains('is-pinned'));
        } else {
          document.body.classList.remove('has-sticky-header');
          setupStickyObserver();
          syncHeaderSpacer(false);
        }
      };

      const onScroll = () => {
        const currentY = window.scrollY;
        headerMain.classList.toggle('header-scrolled', currentY > 8);

        if (stickyMode === 'hide_on_scroll' && isHeaderPinned) {
          if (currentY > lastScrollY && currentY > 120) {
            headerMain.classList.add('is-hidden');
          } else {
            headerMain.classList.remove('is-hidden');
          }
        } else {
          headerMain.classList.remove('is-hidden');
        }

        lastScrollY = currentY;
      };

      applyHeaderOffset();
      onScroll();
      window.addEventListener('scroll', debounce(onScroll, 16), { passive: true });
      window.addEventListener('resize', debounce(applyHeaderOffset, 100));
    }

    const closeMobileDrawer = () => {
      if (!burgerBtn || !mobileDrawer) return;
      burgerBtn.classList.remove('active');
      burgerBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('active');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      body.style.overflow = '';
    };

    const openMobileDrawer = () => {
      if (!burgerBtn || !mobileDrawer) return;
      burgerBtn.classList.add('active');
      burgerBtn.setAttribute('aria-expanded', 'true');
      mobileDrawer.classList.add('active');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      body.style.overflow = 'hidden';
    };
  
    runOnFirstInteraction(() => {
      // Cart icon behavior: drawer / redirect / popover
      if (cartIcon) {
        const cartBehavior = window.themeCartBehavior || globalCartBehavior || headerMain?.dataset.cartBehavior || cartIcon.dataset.cartBehavior || 'drawer';
        cartIcon.dataset.cartBehavior = cartBehavior;

        if (cartBehavior === 'popover' && cartPopover) {
          cartIcon.addEventListener('click', (event) => {
            event.preventDefault();
            const isHidden = cartPopover.hasAttribute('hidden');
            if (isHidden) {
              cartPopover.removeAttribute('hidden');
            } else {
              cartPopover.setAttribute('hidden', 'hidden');
            }
          });

          document.addEventListener('click', (event) => {
            if (!cartPopover.hasAttribute('hidden') && !cartPopover.contains(event.target) && !cartIcon.contains(event.target)) {
              cartPopover.setAttribute('hidden', 'hidden');
            }
          });
        }
        // redirect 模式无需 JS；drawer 模式由 cart-drawer.js 接管
      }

      // A. 移动端抽屉菜单开启/关闭逻辑
      if (burgerBtn && mobileDrawer) {
        burgerBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const isActive = burgerBtn.classList.contains('active');

          if (isActive) {
            closeMobileDrawer();
          } else {
            openMobileDrawer();
          }
        });

        // 点击遮罩关闭
        if (mobileOverlay) {
          mobileOverlay.addEventListener('click', closeMobileDrawer);
        }

        // ESC 关闭
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && mobileDrawer.classList.contains('active')) {
            closeMobileDrawer();
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
          if (!parentItem) return;

          // 切换展开状态
          parentItem.classList.toggle('is-open');

          // 更新无障碍属性
          const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', !isExpanded);

          // 关闭同级其他展开的菜单
          const siblings = parentItem.parentElement
            ? Array.from(parentItem.parentElement.children).filter((el) => el.classList && el.classList.contains('mobile-item') && el.classList.contains('is-open'))
            : [];
          siblings.forEach(sibling => {
            if (sibling !== parentItem) {
              sibling.classList.remove('is-open');
              const siblingToggle = sibling.querySelector(':scope > .mobile-link-row .mobile-toggle');
              if (siblingToggle) {
                siblingToggle.setAttribute('aria-expanded', 'false');
              }
            }
          });
        });
      });

      const sortSelect = document.getElementById('SortBy');
      if (sortSelect) {
        sortSelect.addEventListener('change', function(e) {
          const url = new URL(window.location.href);
          url.searchParams.set('sort_by', e.target.value);
          window.location.href = url.toString();
        });
      }
    });

    const productAnalyticsNode = document.querySelector('[data-product-analytics]');
    if (productAnalyticsNode) {
      pushAnalyticsEvent('view_item', {
        ecommerce: {
          items: [
            {
              item_id: productAnalyticsNode.dataset.productId,
              item_name: productAnalyticsNode.dataset.productTitle,
              item_brand: productAnalyticsNode.dataset.productVendor,
              price: Number(productAnalyticsNode.dataset.productPrice || 0) / 100,
              currency: productAnalyticsNode.dataset.currency || ''
            }
          ]
        }
      });
    }

    runOnFirstInteraction(() => {
      const checkoutButton = document.querySelector('button[name="checkout"]');
      if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
          pushAnalyticsEvent('begin_checkout', {
            source: 'cart'
          });
        });
      }

      document.addEventListener('click', (event) => {
        const removeButton = event.target.closest('[data-remove-cart-item]');
        if (!removeButton) return;

        pushAnalyticsEvent('remove_from_cart', {
          ecommerce: {
            items: [
              {
                item_id: removeButton.dataset.variantId || removeButton.dataset.productId || '',
                item_name: removeButton.dataset.productTitle || '',
                item_brand: removeButton.dataset.productVendor || '',
                quantity: Number(removeButton.dataset.quantity || 1),
                price: Number(removeButton.dataset.price || 0) / 100
              }
            ]
          }
        });
      });
    });

    const cartAnalyticsNode = document.querySelector('[data-cart-analytics]');
    if (cartAnalyticsNode) {
      const cartItems = Array.from(document.querySelectorAll('[data-cart-item]')).map((item) => ({
        item_id: item.dataset.variantId || item.dataset.productId || '',
        item_name: item.dataset.productTitle || '',
        item_brand: item.dataset.productVendor || '',
        quantity: Number(item.dataset.quantity || 0),
        price: Number(item.dataset.price || 0) / 100
      }));

      pushAnalyticsEvent('view_cart', {
        ecommerce: {
          currency: cartAnalyticsNode.dataset.cartCurrency || '',
          value: Number(cartAnalyticsNode.dataset.cartTotal || 0) / 100,
          items: cartItems
        }
      });
    }

    if (window.Shopify && window.Shopify.checkout && window.Shopify.checkout.order_id) {
      const checkout = window.Shopify.checkout;
      pushAnalyticsEvent('purchase', {
        ecommerce: {
          transaction_id: checkout.order_id,
          currency: checkout.currency || '',
          value: Number(checkout.total_price || 0),
          items: (checkout.line_items || []).map((item) => ({
            item_id: item.variant_id || item.product_id || '',
            item_name: item.title || '',
            item_brand: item.vendor || '',
            quantity: Number(item.quantity || 0),
            price: Number(item.price || 0)
          }))
        }
      });
    }
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

            const variantInput = this.form.querySelector('[name="id"]');
            const productAnalyticsNode = document.querySelector('[data-product-analytics]');
            pushAnalyticsEvent('add_to_cart', {
              ecommerce: {
                items: [
                  {
                    item_id: variantInput ? variantInput.value : '',
                    item_name: productAnalyticsNode?.dataset.productTitle || '',
                    item_brand: productAnalyticsNode?.dataset.productVendor || ''
                  }
                ]
              }
            });
            
            const cartBehavior = window.themeCartBehavior || 'drawer';
            const cartPopover = document.getElementById('HeaderCartPopover');
            const cartBadge = document.querySelector('.cart-count-badge');

            if (cartBehavior === 'drawer') {
              if (this.cart) {
                // 将 API 返回的 HTML 交给抽屉去渲染并自动打开
                this.cart.renderContents(response);
              } else {
                window.location = window.routes.cart_url;
              }
            } else if (cartBehavior === 'popover') {
              fetch(`${window.routes.cart_url}.js`)
                .then((res) => res.json())
                .then((cart) => {
                  if (cartBadge) cartBadge.textContent = cart.item_count;
                })
                .catch(() => {});

              if (cartPopover) {
                cartPopover.removeAttribute('hidden');
                window.setTimeout(() => cartPopover.setAttribute('hidden', 'hidden'), 2600);
              }
            } else {
              // redirect
              window.location = window.routes.cart_url;
            }

            // 显示成功状态
            submitButton.classList.remove('loading');
            submitButton.classList.add('success');
            setTimeout(() => {
              submitButton.classList.remove('success');
              submitButton.removeAttribute('aria-disabled');
            }, 1500);
          })
          .catch((e) => {
            console.error('Add to cart error:', e);
          })
          .finally(() => {
            if (submitButton.classList.contains('success')) return;
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