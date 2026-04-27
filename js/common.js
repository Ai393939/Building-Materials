function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cartCount').forEach(el => {
        if (el) {
            if (count > 0) {
                el.textContent = count;
                el.style.display = '';
            } else {
                el.textContent = '0';
                el.style.display = 'none';
            }
        }
    });
}

class ToastManager {
    constructor() {
        this.toasts = [];
        this.container = null;
        this.isHovering = false;
        this.init();
    }

    init() {
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
            
            this.container.addEventListener('mouseenter', () => {
                this.isHovering = true;
                this.container.classList.add('expanded');
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.isHovering = false;
                this.container.classList.remove('expanded');
            });
        } else {
            this.container = document.getElementById('toast-container');
        }
    }

    show(message) {
        const id = Date.now();
        const toast = {
            id,
            message,
            timeout: null
        };

        this.toasts.push(toast);
        this.render();

        toast.timeout = setTimeout(() => {
            this.remove(id);
        }, 5000);
    }

    remove(id) {
        const index = this.toasts.findIndex(t => t.id === id);
        if (index !== -1) {
            const toast = this.toasts[index];
            if (toast.timeout) {
                clearTimeout(toast.timeout);
            }
            this.toasts.splice(index, 1);
            this.render();
        }
    }

    render() {
        if (!this.container) return;

        if (this.toasts.length === 0) {
            this.container.innerHTML = '';
            return;
        }

        const reversedToasts = [...this.toasts].reverse();
        
        this.container.innerHTML = reversedToasts.map((toast, idx) => {
            const originalIndex = this.toasts.length - 1 - idx;
            return `
                <div class="toast-item ${idx === 0 ? 'front' : ''}" 
                     data-id="${toast.id}"
                     data-index="${originalIndex}"
                     style="--index: ${originalIndex}; --total: ${this.toasts.length};">
                    <div class="toast-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" width="18" height="18">
                            <circle cx="10" cy="10" r="5" fill="black"/>
                            <path d="M6.5 10L9 12.5L14 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                        </svg>
                    </div>
                    <div class="toast-content">
                        <div class="toast-title">${this.escapeHtml(toast.message)}</div>
                    </div>
                </div>
            `;
        }).join('');

        const toastItems = this.container.querySelectorAll('.toast-item');
        toastItems.forEach(item => {
            const id = parseInt(item.dataset.id);
            const toast = this.toasts.find(t => t.id === id);
            
            item.addEventListener('mouseenter', () => {
                if (toast && toast.timeout) {
                    clearTimeout(toast.timeout);
                    toast.timeout = null;
                }
            });

            item.addEventListener('mouseleave', () => {
                if (toast && !toast.timeout) {
                    toast.timeout = setTimeout(() => {
                        this.remove(id);
                    }, 5000);
                }
            });
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const toastManager = new ToastManager();

function showToast(message) {
    toastManager.show(message);
}

async function addToCart(productId, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === productId);
    
    let productName = '';
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        const product = data.products.find(p => p.id === productId);
        if (product) {
            productName = product.name;
        }
    } catch (error) {
        console.error('Error loading product info:', error);
    }
    
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ id: productId, quantity: quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    showToast(`Added ${quantity} ${productName} to cart`);
    
    updateCartCount();
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#FDC700" stroke="#FDC700" stroke-width="2" style="display: inline-block;">
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
        </svg>`;
    }
    
    if (hasHalf) {
        starsHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" style="display: inline-block;">
            <defs><clipPath id="half-star-clip"><rect x="0" y="0" width="12" height="24" /></clipPath></defs>
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" fill="#FDC700" clip-path="url(#half-star-clip)"/>
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" fill="none" stroke="#FDC700" stroke-width="2" clip-path="url(#half-star-clip)"/>
        </svg>`;
    }
    
    const emptyStarsCount = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStarsCount; i++) {
        starsHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E0E0E0" stroke-width="2" style="display: inline-block;">
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
        </svg>`;
    }
    
    return starsHTML;
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!menuToggle || !mobileMenu) return;
    
    const closeMenu = () => {
        mobileMenu.classList.remove('show');
        document.body.classList.remove('mobile-menu-open');
    };
    
    const openMenu = () => {
        mobileMenu.classList.add('show');
        document.body.classList.add('mobile-menu-open');
    };
    
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mobileMenu.classList.contains('show')) closeMenu();
        else openMenu();
    });
    
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('show') &&
            !mobileMenu.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('show')) {
            closeMenu();
        }
    });
}

async function loadJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Ошибка загрузки ${url}:`, error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initMobileMenu();
});