export const domUtils = {
  /**
   * Escape HTML to prevent XSS attacks when rendering user input.
   * @param {string} str - The string to escape.
   * @returns {string} - Escaped string.
   */
  escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  },

  /**
   * Helper to quickly create an element with classes and attributes.
   * @param {string} tag 
   * @param {Object} attributes 
   * @param {Array|string} children 
   * @returns {HTMLElement}
   */
  createElement(tag, attributes = {}, children = []) {
    const el = document.createElement(tag);
    
    for (const [key, value] of Object.entries(attributes)) {
      if (key === 'className') {
        el.className = value;
      } else if (key === 'dataset') {
        for (const [dataKey, dataValue] of Object.entries(value)) {
          el.dataset[dataKey] = dataValue;
        }
      } else if (key === 'onClick') {
        el.addEventListener('click', value);
      } else if (key === 'onChange') {
        el.addEventListener('change', value);
      } else if (key === 'onSubmit') {
        el.addEventListener('submit', value);
      } else if (key === 'hidden') {
        el.hidden = value;
      } else if (key === 'html') {
        el.innerHTML = value;
      } else if (key === 'text') {
        el.textContent = value;
      } else {
        el.setAttribute(key, value);
      }
    }

    if (Array.isArray(children)) {
      children.forEach(child => {
        if (typeof child === 'string') {
          el.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
          el.appendChild(child);
        }
      });
    } else if (typeof children === 'string') {
      el.appendChild(document.createTextNode(children));
    }

    return el;
  },
  
  /**
   * Show a toast message
   * @param {string} message 
   * @param {string} type ('success', 'error', 'info')
   */
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${this.escapeHTML(message)}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};
