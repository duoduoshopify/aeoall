if (!customElements.get('cart-drawer')) {
    customElements.define('cart-drawer', class CartDrawer extends HTMLElement {
      constructor() {
        super();
        this.init();
      }
  
      init() {
        this.addEventListener('click', this.onButtonClick.bind(this));
        this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
        this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
        
        const cartIcon = document.querySelector('#cart-icon-bubble');
        const headerMain = document.querySelector('.header-main');
        if (cartIcon) {
          cartIcon.addEventListener('click', (e) => {
            const behavior = window.themeCartBehavior || window.themeSettings?.cartBehaviorMode || cartIcon.dataset.cartBehavior || headerMain?.dataset.cartBehavior || 'drawer';

            // 仅在 drawer 模式下拦截并打开抽屉
            if (behavior === 'drawer') {
              e.preventDefault();
              this.open();
            }
          });
        }
      }
  
      open() {
        this.classList.add('active');
        document.body.classList.add('overflow-hidden');
      }
  
      close() {
        this.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
      }
  
      onButtonClick(event) {
        const target = event.target;
        
        // 1. 数量增加/减少
        if (target.hasAttribute('data-qty-btn')) {
          const input = target.closest('.quantity-selector').querySelector('input');
          const value = parseInt(input.value);
          const newValue = target.getAttribute('name') === 'plus' ? value + 1 : value - 1;
          this.updateQuantity(target.closest('.quantity-selector').dataset.index, newValue);
        }
  
        // 2. 删除商品
        if (target.hasAttribute('data-remove-item')) {
          this.updateQuantity(target.dataset.index, 0);
        }
      }
  
      updateQuantity(line, quantity) {
        this.classList.add('is-loading');
        
        const body = JSON.stringify({
          line: line,
          quantity: quantity,
          sections: 'cart-drawer' // 告诉 API 我们需要返回更新后的抽屉 HTML
        });
  
        fetch(`${window.routes.cart_change_url}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body
        })
        .then((response) => response.json())
        .then((state) => {
          const html = new DOMParser().parseFromString(state.sections['cart-drawer'], 'text/html');
          this.innerHTML = html.querySelector('cart-drawer').innerHTML;
          this.updateCartCount();
        })
        .catch((e) => console.error(e))
        .finally(() => this.classList.remove('is-loading'));
      }
  
      renderContents(parsedState) {
        // 优先使用 product-form 已经获取的 HTML，避免重复请求
        if (parsedState && parsedState.sections && parsedState.sections['cart-drawer']) {
          const html = new DOMParser().parseFromString(parsedState.sections['cart-drawer'], 'text/html');
          this.innerHTML = html.querySelector('cart-drawer').innerHTML;
          this.updateCartCount();
          this.open();
        } else {
          // 后备：如果没有预获取，发起请求
          fetch(`${window.routes.cart_url}?section_id=cart-drawer`)
            .then((res) => res.text())
            .then((text) => {
              const html = new DOMParser().parseFromString(text, 'text/html');
              this.innerHTML = html.querySelector('cart-drawer').innerHTML;
              this.updateCartCount();
              this.open();
            });
        }
      }
  
      updateCartCount() {
        const countBadge = document.querySelector('.cart-count-badge');
        if (countBadge) {
          fetch(`${window.routes.cart_url}.js`)
            .then(res => res.json())
            .then(cart => countBadge.textContent = cart.item_count);
        }
      }
    });
  }