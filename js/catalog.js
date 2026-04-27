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

function setupPriceSlider() {
    if (!minPriceSlider || !maxPriceSlider) return;
    
    let maxSliderPrice = Math.ceil(maxPriceInProducts / 10) * 10;
    
    if (maxSliderPrice < maxPriceInProducts) {
        maxSliderPrice = maxPriceInProducts;
    }
    
    minPriceSlider.max = maxSliderPrice;
    maxPriceSlider.max = maxSliderPrice;
    minPriceSlider.step = 10;
    maxPriceSlider.step = 10;
    
    minPriceSlider.value = 0;
    maxPriceSlider.value = maxSliderPrice;
    
    if (minPriceValue) minPriceValue.textContent = '0';
    if (maxPriceValue) maxPriceValue.textContent = maxSliderPrice;
    
    updateSliderTrack();
    
    minPriceSlider.addEventListener('input', function() {
        let minVal = parseFloat(minPriceSlider.value);
        let maxVal = parseFloat(maxPriceSlider.value);
        
        if (minVal > maxVal) {
            minPriceSlider.value = maxVal;
            minVal = maxVal;
        }
        
        if (minPriceValue) minPriceValue.textContent = minVal;
        updateSliderTrack();
        applyFilters();
    });
    
    maxPriceSlider.addEventListener('input', function() {
        let minVal = parseFloat(minPriceSlider.value);
        let maxVal = parseFloat(maxPriceSlider.value);
        
        if (maxVal < minVal) {
            maxPriceSlider.value = minVal;
            maxVal = minVal;
        }
        
        if (maxPriceValue) maxPriceValue.textContent = maxVal;
        updateSliderTrack();
        applyFilters();
    });
}

function updateSliderTrack() {
    if (!sliderTrack || !minPriceSlider || !maxPriceSlider) return;
    
    const minVal = parseFloat(minPriceSlider.value);
    const maxVal = parseFloat(maxPriceSlider.value);
    const maxSliderPrice = parseFloat(minPriceSlider.max);
    
    const percentMin = (minVal / maxSliderPrice) * 100;
    const percentMax = (maxVal / maxSliderPrice) * 100;
    
    sliderTrack.style.background = `linear-gradient(to right, #E0E0E0 0%, #E0E0E0 ${percentMin}%, #1A1A1A ${percentMin}%, #1A1A1A ${percentMax}%, #E0E0E0 ${percentMax}%, #E0E0E0 100%)`;
}

function applyFilters() {
    let filtered = [...catalogProducts];
    
    const minPrice = minPriceSlider?.value !== undefined ? parseFloat(minPriceSlider.value) : 0;
    const maxPrice = maxPriceSlider?.value !== undefined ? parseFloat(maxPriceSlider.value) : maxPriceInProducts;
    
    if (minPrice === 0 && maxPrice === 0) {
        filtered = [];
    } else if (minPrice > maxPrice) {
        filtered = [];
    } else {
        filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
    }
    
    let selectedRating = null;
    if (ratingCheckboxes) {
        for (const checkbox of ratingCheckboxes) {
            if (checkbox.checked) {
                selectedRating = parseInt(checkbox.value);
                break;
            }
        }
    }
    if (selectedRating) {
        filtered = filtered.filter(p => p.rating >= selectedRating);
    }
    
    const sortValue = sortSelect?.value;
    if (sortValue === 'name-asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    }
    
    currentProducts = filtered;
    renderProducts(currentProducts);
}

function clearFilters() {
    if (ratingCheckboxes) {
        ratingCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
    
    if (minPriceSlider && maxPriceSlider) {
        const maxSliderPrice = parseFloat(minPriceSlider.max);
        minPriceSlider.value = 0;
        maxPriceSlider.value = maxSliderPrice;
        if (minPriceValue) minPriceValue.textContent = '0';
        if (maxPriceValue) maxPriceValue.textContent = maxSliderPrice;
        updateSliderTrack();
    }
    
    applyFilters();
}

function toggleFiltersPanel() {
    if (!filtersPanel || !filterToggleBtn) return;
    
    filtersPanel.classList.toggle('show');
    const span = filterToggleBtn.querySelector('span');
    if (filtersPanel.classList.contains('show')) {
        if (span) span.textContent = 'Hide Filters';
    } else {
        if (span) span.textContent = 'Show Filters';
    }
}

function initEventListeners() {
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
    
    if (ratingCheckboxes) {
        ratingCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    ratingCheckboxes.forEach(cb => {
                        if (cb !== this) cb.checked = false;
                    });
                }
                applyFilters();
            });
        });
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
    
    if (filterToggleBtn && filtersPanel) {
        filterToggleBtn.addEventListener('click', toggleFiltersPanel);
    }
}

loadCatalogProducts();
initEventListeners();