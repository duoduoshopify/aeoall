/**
 * AEOall Pro - Predictive Search
 * Vanilla JS Web Component
 */
class PredictiveSearch extends HTMLElement {
    constructor() {
      super();
      this.input = this.querySelector('input[type="search"]');
      this.predictiveSearchResults = this.querySelector('.predictive-search-dropdown');

      if (!this.input || !this.predictiveSearchResults) return;
  
      this.input.addEventListener('input', this.debounce((event) => {
        this.onChange(event);
      }, 300).bind(this));
      
      // 点击外部关闭
      document.addEventListener('click', (event) => {
        if (!this.contains(event.target)) this.close();
      });

      this.input.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') this.close();
      });
    }
  
    debounce(fn, wait) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    }
  
    onChange() {
      const searchTerm = this.input.value.trim();
      if (!searchTerm.length) {
        this.close();
        return;
      }
      this.getSearchResults(searchTerm);
    }
  
    getSearchResults(searchTerm) {
      // 调用 Shopify Predictive Search API 渲染指定的 section
      fetch(`${window.routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&section_id=predictive-search`)
        .then((response) => {
          if (!response.ok) throw new Error(response.status);
          return response.text();
        })
        .then((text) => {
          const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#predictive-search-results').innerHTML;
          this.predictiveSearchResults.innerHTML = resultsMarkup;
          this.open();
        })
        .catch((error) => {
          this.close();
          console.error(error);
        });
    }
  
    open() {
      this.predictiveSearchResults.style.display = 'block';
      this.input.setAttribute('aria-expanded', 'true');
    }
  
    close() {
      this.predictiveSearchResults.style.display = 'none';
      this.input.setAttribute('aria-expanded', 'false');
    }
  }
  
  customElements.define('predictive-search', PredictiveSearch);