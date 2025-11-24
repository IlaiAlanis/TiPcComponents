let cart = null;
const SHIPPING_COST = 149.00;
const TAX_RATE = 0.16;

async function initCartPage() {
    if (!Auth.requireAuth()) return;

    document.getElementById('navbar').innerHTML = Components.navbar();
    document.getElementById('footer').innerHTML = Components.footer();
    const mobileMenuContainer = document.getElementById('mobileMenu');
    mobileMenuContainer.outerHTML = `<div id="mobileMenu">${Components.mobileMenu()}</div>`;

    Components.updateCartBadge();
    await loadCart();
}

async function loadCart() {
    try {
        const response = await API.cart.get();

        if (response.success && response.data) {
            cart = response.data;
            renderCart();
        } else {
            showEmptyCart();
        }
    } catch (error) {
        ErrorHandler.handleNetworkError(error);
        showEmptyCart();
    }
}

function renderCart() {
    document.getElementById('loadingState').classList.add('hidden');

    if (!cart.items || cart.items.length === 0) {
        showEmptyCart();
        return;
    }

    document.getElementById('cartContent').classList.remove('hidden');
    document.getElementById('relatedSection').classList.remove('hidden');

    renderCartItems();
    updateSummary();
    loadRelatedProducts();
}

function showEmptyCart() {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('emptyCart').classList.remove('hidden');
}

function renderCartItems() {
    const itemsHtml = cart.items.map(item => {
        const product = item.producto;
        const price = product.precioPromocional || product.precioBase;
        const itemTotal = price * item.cantidad;
        const imageUrl = product.imagenUrl || 'https://via.placeholder.com/100x100?text=Producto';

        return `
            <li class="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <!-- Product Info -->
                <div class="col-span-1 md:col-span-3 flex items-center gap-4">
                    <img src="${imageUrl}" alt="${product.nombreProducto}" 
                         class="w-20 h-20 object-cover rounded cursor-pointer"
                         onclick="window.location.href='/pages/product.html?id=${product.idProducto}'"/>
                    <div class="flex-1">
                        <a href="/pages/product.html?id=${product.idProducto}" 
                           class="font-semibold hover:text-primary transition-colors">
                            ${product.nombreProducto}
                        </a>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            ${product.categoria || ''}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            SKU: ${product.sku || product.idProducto}
                        </p>
                    </div>
                </div>

                <!-- Price -->
                <div class="flex md:justify-center items-center">
                    <span class="md:hidden font-medium mr-2">Precio:</span>
                    <span class="font-semibold">$${price.toFixed(2)}</span>
                </div>

                <!-- Quantity Controls -->
                <div class="flex md:justify-center items-center">
                    <span class="md:hidden font-medium mr-2">Cantidad:</span>
                    <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                        <button onclick="updateQuantity(${item.idCarritoItem}, ${item.cantidad - 1})" 
                                ${item.cantidad <= 1 ? 'disabled' : ''}
                                class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <span class="material-icons text-sm">remove</span>
                        </button>
                        <span class="px-4 py-2 min-w-[3rem] text-center">${item.cantidad}</span>
                        <button onclick="updateQuantity(${item.idCarritoItem}, ${item.cantidad + 1})" 
                                ${item.cantidad >= product.cantidadStock ? 'disabled' : ''}
                                class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <span class="material-icons text-sm">add</span>
                        </button>
                    </div>
                </div>

                <!-- Total & Remove -->
                <div class="flex md:justify-end items-center gap-4">
                    <div class="flex-1 md:flex-none">
                        <span class="md:hidden font-medium">Total: </span>
                        <span class="font-bold text-lg">$${itemTotal.toFixed(2)}</span>
                    </div>
                    <button onclick="removeItem(${item.idCarritoItem})" 
                            class="text-red-500 hover:text-red-700 transition-colors">
                        <span class="material-icons">delete_outline</span>
                    </button>
                </div>
            </li>
        `;
    }).join('');

    document.getElementById('cartItems').innerHTML = itemsHtml;
}

function updateSummary() {
    const subtotal = cart.subtotal || cart.items.reduce((sum, item) => {
        const price = item.producto.precioPromocional || item.producto.precioBase;
        return sum + (price * item.cantidad);
    }, 0);

    const discount = cart.descuento || 0;
    const shipping = subtotal > 1000 ? 0 : SHIPPING_COST;
    const tax = (subtotal - discount + shipping) * TAX_RATE;
    const total = subtotal - discount + shipping + tax;

    document.getElementById('itemCount').textContent = cart.totalItems || cart.items.length;
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;

    if (discount > 0) {
        document.getElementById('discountRow').classList.remove('hidden');
        document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
    }
}

async function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;

    try {
        const response = await API.cart.updateItem(itemId, newQuantity);

        if (response.success) {
            await loadCart();
            Components.updateCartBadge();
            ErrorHandler.showToast('Cantidad actualizada', 'success');
        } else {
            ErrorHandler.handleApiError(response);
        }
    } catch (error) {
        ErrorHandler.handleNetworkError(error);
    }
}

async function removeItem(itemId) {
    if (!confirm('¿Estás seguro de eliminar este producto del carrito?')) return;

    try {
        const response = await API.cart.removeItem(itemId);

        if (response.success) {
            await loadCart();
            Components.updateCartBadge();
            ErrorHandler.showToast('Producto eliminado del carrito', 'info');
        } else {
            ErrorHandler.handleApiError(response);
        }
    } catch (error) {
        ErrorHandler.handleNetworkError(error);
    }
}

async function applyCoupon() {
    const code = document.getElementById('couponInput').value.trim();
    const messageEl = document.getElementById('couponMessage');

    if (!code) {
        messageEl.textContent = 'Por favor ingresa un código';
        messageEl.className = 'mt-2 text-sm text-red-500';
        return;
    }

    try {
        const response = await API.cart.applyCoupon(code);

        if (response.success) {
            messageEl.textContent = '✓ Cupón aplicado correctamente';
            messageEl.className = 'mt-2 text-sm text-green-500';
            await loadCart();
        } else {
            messageEl.textContent = response.error?.message || 'Cupón inválido';
            messageEl.className = 'mt-2 text-sm text-red-500';
        }
    } catch (error) {
        messageEl.textContent = 'Error al aplicar el cupón';
        messageEl.className = 'mt-2 text-sm text-red-500';
    }
}

async function loadRelatedProducts() {
    if (!cart.items || cart.items.length === 0) return;

    const categories = [...new Set(cart.items.map(item => item.producto.categoria))];
    
    try {
        const response = await API.products.search({
            category: categories[0],
            pageSize: 4
        });

        if (response.success && response.data) {
            const products = (response.data.items || response.data)
                .filter(p => !cart.items.find(item => item.producto.idProducto === p.idProducto))
                .slice(0, 4);

            renderRelatedProducts(products);
        }
    } catch (error) {
        console.error('Error loading related products:', error);
    }
}

function renderRelatedProducts(products) {
    const html = products.map(product => {
        const price = product.precioPromocional || product.precioBase;
        const imageUrl = product.imagenUrl || 'https://via.placeholder.com/300x300?text=Producto';

        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <a href="/pages/product.html?id=${product.idProducto}" class="block p-4 bg-gray-50 dark:bg-gray-900">
                    <img src="${imageUrl}" alt="${product.nombreProducto}" 
                         class="w-full h-48 object-contain"/>
                </a>
                <div class="p-4">
                    <a href="/pages/product.html?id=${product.idProducto}" 
                       class="font-semibold hover:text-primary line-clamp-2 block mb-2">
                        ${product.nombreProducto}
                    </a>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                        ${product.descripcion || ''}
                    </p>
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-xl text-primary">$${price.toFixed(2)}</span>
                        <button onclick="addRelatedToCart(${product.idProducto})" 
                                class="bg-primary/10 text-primary hover:bg-primary hover:text-white p-2 rounded-lg transition-colors">
                            <span class="material-icons">add_shopping_cart</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('relatedProducts').innerHTML = html;
}

async function addRelatedToCart(productId) {
    try {
        const response = await API.cart.addItem({ productoId: productId, cantidad: 1 });

        if (response.success) {
            ErrorHandler.showToast('Producto agregado al carrito', 'success');
            await loadCart();
            Components.updateCartBadge();
        } else {
            ErrorHandler.handleApiError(response);
        }
    } catch (error) {
        ErrorHandler.handleNetworkError(error);
    }
}

function proceedToCheckout() {
    window.location.href = '/pages/checkout.html';
}

initCartPage();