/**
 * Mega Menu interactions (on-demand)
 * 仅在 Header 检测到启用多图 slider 时加载。
 */

document.addEventListener('DOMContentLoaded', () => {
  const megaPromoSliders = document.querySelectorAll('[data-mega-slider][data-slider-enabled="true"]');

  megaPromoSliders.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.mega-promo-slide'));
    const prevBtn = slider.querySelector('[data-slide-prev]');
    const nextBtn = slider.querySelector('[data-slide-next]');
    const dots = Array.from(slider.querySelectorAll('[data-slide-dot]'));
    if (!slides.length) return;

    let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
    if (!slides[activeIndex]) activeIndex = 0;

    const setActive = (nextIndex) => {
      const safeIndex = ((nextIndex % slides.length) + slides.length) % slides.length;
      slides.forEach((slide, index) => {
        slide.classList.toggle('is-active', index === safeIndex);
        slide.setAttribute('aria-hidden', index === safeIndex ? 'false' : 'true');
      });
      dots.forEach((dot, index) => {
        dot.classList.toggle('is-active', index === safeIndex);
        dot.setAttribute('aria-selected', index === safeIndex ? 'true' : 'false');
      });
      activeIndex = safeIndex;
    };

    setActive(activeIndex);

    if (prevBtn) {
      prevBtn.addEventListener('click', (event) => {
        event.preventDefault();
        setActive(activeIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (event) => {
        event.preventDefault();
        setActive(activeIndex + 1);
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', (event) => {
        event.preventDefault();
        setActive(index);
      });
    });
  });
});
