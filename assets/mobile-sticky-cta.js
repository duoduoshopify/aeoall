(() => {
  const initMobileStickyCta = () => {
    const sticky = document.getElementById('MobileStickyCTA');
    if (!sticky || sticky.dataset.initialized === 'true') return;

    const mainBtn = document.querySelector('#ProductSubmitButton-main, [id^="ProductSubmitButton-"]');
    const stickyBtn = sticky.querySelector('.sticky-atc-btn');
    const stickyPrice = sticky.querySelector('[data-sticky-price]');
    const variantInput = document.querySelector('#product-form-main [name="id"]');

    if (!mainBtn || !stickyBtn) return;

    sticky.dataset.initialized = 'true';

    let variants = [];
    const rawVariants = document.getElementById('MobileStickyVariantsData')?.textContent || '[]';
    try {
      variants = JSON.parse(rawVariants);
    } catch (error) {
      variants = [];
    }

    const updateStickyPrice = () => {
      if (!stickyPrice || !variantInput) return;
      const currentId = Number(variantInput.value);
      const currentVariant = variants.find((v) => Number(v.id) === currentId);
      if (!currentVariant) return;

      if (window.Shopify && typeof window.Shopify.formatMoney === 'function') {
        stickyPrice.textContent = window.Shopify.formatMoney(currentVariant.price, window.routes?.money_format || '${{amount}}');
      } else {
        stickyPrice.textContent = (currentVariant.price / 100).toFixed(2);
      }
    };

    const onScroll = () => {
      const rect = mainBtn.getBoundingClientRect();
      sticky.classList.toggle('visible', rect.bottom < 0);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    stickyBtn.addEventListener('click', () => mainBtn.click());

    if (variantInput) {
      variantInput.addEventListener('change', updateStickyPrice);
    }

    updateStickyPrice();
    onScroll();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileStickyCta);
  } else {
    initMobileStickyCta();
  }

  document.addEventListener('section:hydrated', initMobileStickyCta);
})();