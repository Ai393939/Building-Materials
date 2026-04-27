let catalogProducts = [];
let currentProducts = [];
let maxPriceInProducts = 0;

const catalogGrid = document.getElementById('catalogGrid');
const sortSelect = document.getElementById('sortSelect');
const productCountSpan = document.getElementById('productCount');
const filterToggleBtn = document.getElementById('filterToggleBtn');
const filtersPanel = document.getElementById('filtersPanel');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const ratingCheckboxes = document.querySelectorAll('#ratingCheckboxes input');
const minPriceSlider = document.getElementById('minPriceSlider');
const maxPriceSlider = document.getElementById('maxPriceSlider');
const minPriceValue = document.getElementById('minPriceValue');
const maxPriceValue = document.getElementById('maxPriceValue');
const sliderTrack = document.querySelector('.slider-track');

async function loadCatalogProducts() {
    const data = await loadJSON('data/products.json');
    if (!data) return;
    
    catalogProducts = data.products;
    maxPriceInProducts = Math.max(...catalogProducts.map(p => p.price));
    
    setupPriceSlider();
    applyFilters();
    initSearch();
}

function renderProducts(products) {
    if (!catalogGrid) return;
    
    if (products.length === 0) {
        catalogGrid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:48px 20px;">
                <p style="color:#9CA3AF;font-size:18px;margin-bottom:16px;">No products match your filters.</p>
                <button id="noResultsClearBtn" style="background:none;border:none;color:#F54900;font-weight:500;cursor:pointer;">Clear filters</button>
            </div>
        `;
        document.getElementById('noResultsClearBtn')?.addEventListener('click', clearFilters);
        if (productCountSpan) productCountSpan.textContent = 'Showing 0 products';
        return;
    }
    
    if (productCountSpan) productCountSpan.textContent = `Showing ${products.length} products`;
    
    catalogGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <a href="product.html?id=${product.id}" class="product-link">
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://placehold.co/300x280?text=No+Image'">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="rating">
                        <span class="stars">${renderStars(product.rating)}</span>
                        <span class="rating-value">(${product.rating})</span>
                    </div>
                    <div class="price">$${product.price.toFixed(2)}</div>
                    <div class="category">${product.category}</div>
                </div>
            </a>
            <button class="add-to-cart" data-id="${product.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right: 6px;">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Add to Cart
            </button>
        </div>
    `).join('');
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(parseInt(btn.dataset.id), 1);
        });
    });
}

loadCatalogProducts();
initEventListeners();