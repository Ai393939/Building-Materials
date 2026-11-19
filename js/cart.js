let cart = [];
let cartProducts = [];
let promoApplied = false;
let discountPercent = 0;
let serverDiscount = 0;

window.updateQuantity = async function(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;
    const nextQuantity = cartItem.quantity + change;
    try {
        if (nextQuantity <= 0) {
            await apiSend(`/api/cart/items/${cartItem.cartItemId}`, 'DELETE');
        } else {
            await apiSend(`/api/cart/items/${cartItem.cartItemId}`, 'PATCH', { quantity: nextQuantity });
        }
        await loadCartProducts();
    } catch (error) {
        showToast(messageFromError(error));
    }
};

window.removeFromCart = async function(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;
    try {
        await apiSend(`/api/cart/items/${cartItem.cartItemId}`, 'DELETE');
        await loadCartProducts();
    } catch (error) {
        showToast(messageFromError(error));
    }
};

async function loadCartProducts() {
    if (!getToken()) {
        window.location.href = 'login.html?next=' + encodeURIComponent('cart.html');
        return;
    }
    try {
        const data = await apiGet('/api/cart');
        cart = data.items.map(item => ({
            id: item.productId,
            cartItemId: item.id,
            quantity: item.quantity,
        }));
        cartProducts = data.items.map(item => ({
            id: item.productId,
            name: item.title,
            image: item.image || '',
            category: item.category || '',
            price: item.price,
        }));
        promoApplied = Boolean(data.promoCode);
        serverDiscount = data.discount;
        discountPercent = data.subtotal ? Math.round((data.discount / data.subtotal) * 100) : 0;
        renderCartPage();
    } catch (error) {
        const container = document.getElementById('cartContent');
        if (container && error.status !== 401) {
            container.innerHTML = '<p style="text-align:center;padding:40px;">Ошибка загрузки</p>';
        }
    }
}

function renderCartPage() {
    const container = document.getElementById('cartContent');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h2>Your Cart is Empty</h2>
                <p>Start shopping to add items to your cart</p>
                <a href="index.html" class="browse-products-btn">
                    Browse Products
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                    </svg>
                </a>
            </div>
        `;
        updateCartCount();
        return;
    }
    
    let subtotal = 0;
    let cartItemsHTML = '';
    
    for (const cartItem of cart) {
        const product = cartProducts.find(p => p.id === cartItem.id);
        if (!product) continue;
        const itemTotal = product.price * cartItem.quantity;
        subtotal += itemTotal;
        
        cartItemsHTML += `
            <div class="cart-row" data-id="${product.id}">
                <div class="cart-product-col">
                    <a href="product.html?id=${product.id}" class="cart-product-link">
                        <img src="${product.image}" alt="${product.name}" class="cart-product-image" onerror="this.src='https://placehold.co/80x80?text=No+Image'">
                    </a>
                    <div class="cart-product-info">
                        <a href="product.html?id=${product.id}" class="cart-product-title-link">
                            <h4>${product.name}</h4>
                        </a>
                        <p>${product.category}</p>
                        <button class="cart-remove-btn mobile-remove-btn" onclick="removeFromCart(${product.id})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                <line x1="10" x2="10" y1="11" y2="17"/>
                                <line x1="14" x2="14" y1="11" y2="17"/>
                            </svg>
                            <span class="remove-text">Remove</span>
                        </button>
                    </div>
                </div>
                <div class="cart-price-col">
                    <span class="cart-label">Price:</span>
                    <span>$${product.price.toFixed(2)}</span>
                </div>
                <div class="cart-quantity-col">
                    <span class="cart-label">Quantity:</span>
                    <div class="cart-quantity-control">
                        <button class="cart-qty-btn" onclick="updateQuantity(${product.id}, -1)">-</button>
                        <span class="cart-qty-value">${cartItem.quantity}</span>
                        <button class="cart-qty-btn" onclick="updateQuantity(${product.id}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-total-col">
                    <span class="cart-label">Total:</span>
                    <span>$${itemTotal.toFixed(2)}</span>
                </div>
                <div class="cart-remove-col">
                    <button class="cart-remove-btn desktop-remove-btn" onclick="removeFromCart(${product.id})" title="Remove item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                            <line x1="10" x2="10" y1="11" y2="17"/>
                            <line x1="14" x2="14" y1="11" y2="17"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }
    
    const tax = subtotal * 0.08;
    const discount = promoApplied ? serverDiscount : 0;
    const total = subtotal + tax - discount;
    
    container.innerHTML = `
        <div class="cart-page">
            <h1 class="cart-title">Shopping Cart</h1>
            
            <div class="cart-layout-two-columns">
                <div class="cart-items-column">
                    <div class="cart-table-wrapper">
                        <div class="cart-header-row">
                            <span>Product</span>
                            <span>Price</span>
                            <span>Quantity</span>
                            <span>Total</span>
                            <span></span>
                        </div>
                        <div class="cart-rows-container">
                            ${cartItemsHTML}
                        </div>
                    </div>
                    
                    <div class="promo-section">
                        <label>Have a promo code?</label>
                        <div class="promo-input-wrapper">
                            <input type="text" id="promoInput" placeholder="Enter promo code">
                            <button id="applyPromoBtn">Apply</button>
                        </div>
                        <div id="promoMessage" class="promo-message"></div>
                        <div id="promoSuggestion" class="promo-suggestion"></div>
                    </div>
                </div>
                
                <div class="cart-summary-column">
                    <div class="order-summary-block">
                        <h3>Order Summary</h3>
                        <div class="summary-row">
                            <span>Subtotal</span>
                            <span>$${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Tax (8%)</span>
                            <span>$${tax.toFixed(2)}</span>
                        </div>
                        ${promoApplied ? `
                        <div class="summary-row discount">
                            <span>Discount (${discountPercent}%)</span>
                            <span> -$${discount.toFixed(2)}</span>
                        </div>
                        ` : ''}
                        <div class="summary-row total">
                            <span>Total</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                        <button class="checkout-btn" id="checkoutBtn">
                            Proceed to Checkout
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </button>
                        <a href="index.html" class="continue-shopping-btn">Continue Shopping</a>
                    </div>
                    
                    <div class="shipping-block">
                        <h3>Shipping Information</h3>
                        <div class="shipping-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F54900" stroke-width="1.5">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <div>
                                <strong>Estimated Delivery</strong>
                                <span>3-5 business days</span>
                            </div>
                        </div>
                        <div class="shipping-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F54900" stroke-width="1.5">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <div>
                                <strong>Shipping Address</strong>
                                <span>123 Construction Ave</span>
                                <span>Builder City, BC 12345</span>
                                <span>United States</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    setupPromoCode();
    updateCartCount();
}

function setupPromoCode() {
    const promoInput = document.getElementById('promoInput');
    const applyBtn = document.getElementById('applyPromoBtn');
    const promoMessage = document.getElementById('promoMessage');
    const promoSuggestion = document.getElementById('promoSuggestion');
    
    if (!promoInput || !applyBtn) return;
    
    if (promoApplied) {
        promoMessage.innerHTML = '✓ Promo code applied! You saved 10%';
        promoMessage.className = 'promo-message success';
        return;
    }
    
    const updateSuggestion = () => {
        const currentCode = promoInput.value.trim().toUpperCase();
        
        if (currentCode.length > 0) {
            if (currentCode === 'SAVE10') {
                if (promoSuggestion) {
                    promoSuggestion.style.display = 'none';
                }
            } else {
                if (promoSuggestion) {
                    promoSuggestion.innerHTML = 'Try code: SAVE10 for 10% off';
                    promoSuggestion.style.display = 'block';
                    promoSuggestion.className = 'promo-suggestion';
                }
            }
        } else {
            if (promoSuggestion) {
                promoSuggestion.style.display = 'none';
            }
        }
    };
    
    promoInput.addEventListener('input', () => {
        updateSuggestion();
        if (promoMessage.innerHTML && promoMessage.classList.contains('error')) {
            promoMessage.innerHTML = '';
            promoMessage.className = 'promo-message';
        }
    });
    
    applyBtn.addEventListener('click', async () => {
        const code = promoInput.value.trim();
        if (!code) {
            promoMessage.innerHTML = 'Введите промокод';
            promoMessage.className = 'promo-message error';
            return;
        }

        try {
            await apiSend('/api/cart/apply-promo', 'POST', { code });
            await loadCartProducts();
        } catch (error) {
            promoMessage.innerHTML = messageFromError(error);
            promoMessage.className = 'promo-message error';
        }
    });
}

loadCartProducts();