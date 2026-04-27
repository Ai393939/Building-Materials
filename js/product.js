let currentProduct = null;
let currentImageIndex = 0;
let currentQuantity = 1;

async function loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        currentProduct = data.products.find(p => p.id === productId);
        
        if (!currentProduct) {
            document.getElementById('productContent').innerHTML = '<p style="text-align:center;padding:40px;">Товар не найден</p>';
            return;
        }
        
        renderProduct();
    } catch (error) {
        console.error('Ошибка загрузки товара:', error);
        document.getElementById('productContent').innerHTML = '<p style="text-align:center;padding:40px;">Ошибка загрузки товара</p>';
    }
}

function renderProduct() {
    const container = document.getElementById('productContent');
    document.getElementById('breadcrumbProductName').textContent = currentProduct.name;
    
    let images = currentProduct.images || [currentProduct.image];
    if (images.length < 3) {
        const original = images[0];
        while (images.length < 3) {
            images.push(original);
        }
    }
    
    const starsHTML = renderStars(currentProduct.rating);
    
    container.innerHTML = `
        <div class="product-page">
            <div class="product-two-columns">
                <div class="product-gallery-col">
                    <div class="main-image-wrapper">
                        <button class="nav-arrow prev-arrow" id="prevImageBtn">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="19" stroke="#E0E0E0" stroke-width="1" fill="white"/>
                                <polyline points="22 14 16 20 22 26" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                            </svg>
                        </button>
                        <img id="mainImage" src="${images[0]}" alt="${currentProduct.name}" class="main-product-image">
                        <button class="nav-arrow next-arrow" id="nextImageBtn">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="19" stroke="#E0E0E0" stroke-width="1" fill="white"/>
                                <polyline points="18 14 24 20 18 26" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                            </svg>
                        </button>
                    </div>
                    <div class="thumbnail-list" id="thumbnailList">
                        ${images.map((img, idx) => `
                            <img src="${img}" alt="Thumbnail ${idx + 1}" class="thumbnail ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                        `).join('')}
                    </div>
                </div>
                
                <div class="product-info-col">
                    <h1 class="product-name">${currentProduct.name}</h1>
                    <div class="product-rating">
                        <span class="stars">${starsHTML}</span>
                        <span class="rating-value">(${currentProduct.rating})</span>
                    </div>
                    <div class="product-price">$${currentProduct.price.toFixed(2)} <span class="price-unit">/unit</span></div>
                    
                    <div class="features-row">
                        <div class="feature-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F54900" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
                                <path d="M12 22V12"/>
                                <polyline points="3.29 7 12 12 20.71 7"/>
                                <path d="m7.5 4.27 9 5.15"/>
                            </svg>
                            <div class="feature-text">
                                <strong>Quality Assured</strong>
                                <span>Premium grade material</span>
                            </div>
                        </div>
                        <div class="feature-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F54900" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                                <path d="M15 18H9"/>
                                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                                <circle cx="17" cy="18" r="2"/>
                                <circle cx="7" cy="18" r="2"/>
                            </svg>
                            <div class="feature-text">
                                <strong>Fast Delivery</strong>
                                <span>2-5 business days</span>
                            </div>
                        </div>
                        <div class="feature-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F54900" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
                            </svg>
                            <div class="feature-text">
                                <strong>Warranty</strong>
                                <span>30-day guarantee</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="quantity-section">
                        <label>Quantity</label>
                        <div class="quantity-control">
                            <button class="quantity-btn" id="decrementQty">-</button>
                            <input type="number" id="quantityInput" value="1" min="1" max="99">
                            <button class="quantity-btn" id="incrementQty">+</button>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="add-to-cart-btn" id="productAddToCart">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                <circle cx="9" cy="21" r="1"/>
                                <circle cx="20" cy="21" r="1"/>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                            </svg>
                            Add to Cart
                        </button>
                        <button class="buy-now-btn" id="buyNowBtn">Buy Now</button>
                    </div>
                    
                    <div class="product-description">
                        <h3>Description</h3>
                        <p>${currentProduct.description}</p>
                    </div>
                    
                    <div class="accordion">
                        <div class="accordion-header" id="specsHeader">
                            <h3>Technical Specifications</h3>
                            <svg class="accordion-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m6 9 6 6 6-6"></path>
                            </svg>
                        </div>
                        <div class="accordion-content" id="specsContent">
                            <div class="specs-grid">
                                ${Object.entries(currentProduct.specifications).map(([key, value]) => `
                                    <div class="spec-item">
                                        <span class="spec-key">${key}</span>
                                        <span class="spec-value">${value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="relatedProductsSection"></div>
        </div>
    `;
    
    setupGalleryWithArrows(images);
    
    setupQuantityControls();
    
    setupAccordionWithSvg();
    
    document.getElementById('productAddToCart').addEventListener('click', () => {
        addToCart(currentProduct.id, currentQuantity);
    });
    
    document.getElementById('buyNowBtn').addEventListener('click', () => {
        addToCart(currentProduct.id, currentQuantity);
        window.location.href = 'cart.html';
    });
    
    loadRelatedProducts();
}

function setupGalleryWithArrows(images) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.getElementById('prevImageBtn');
    const nextBtn = document.getElementById('nextImageBtn');
    let currentIndex = 0;
    
    function updateImage(index) {
        currentIndex = index;
        mainImage.src = images[currentIndex];
        
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentIndex);
        });
    }
    
    prevBtn.addEventListener('click', () => {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = images.length - 1;
        updateImage(newIndex);
    });
    
    nextBtn.addEventListener('click', () => {
        let newIndex = currentIndex + 1;
        if (newIndex >= images.length) newIndex = 0;
        updateImage(newIndex);
    });
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            updateImage(parseInt(thumb.dataset.index));
        });
    });
}

function setupQuantityControls() {
    const decrementBtn = document.getElementById('decrementQty');
    const incrementBtn = document.getElementById('incrementQty');
    const quantityInput = document.getElementById('quantityInput');
    
    decrementBtn.addEventListener('click', () => {
        let val = parseInt(quantityInput.value);
        if (val > 1) {
            quantityInput.value = val - 1;
            currentQuantity = val - 1;
        }
    });
    
    incrementBtn.addEventListener('click', () => {
        let val = parseInt(quantityInput.value);
        if (val < 99) {
            quantityInput.value = val + 1;
            currentQuantity = val + 1;
        }
    });
    
    quantityInput.addEventListener('change', () => {
        let val = parseInt(quantityInput.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 99) val = 99;
        quantityInput.value = val;
        currentQuantity = val;
    });
}

loadProduct();
updateCartCount();