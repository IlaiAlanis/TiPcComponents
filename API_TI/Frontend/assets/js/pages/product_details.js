let currentProduct = null;
let currentQuantity = 1;
let maxQuantity = 1;
let isInWishlist = false;
let relatedProducts = [];

async function initProductPage() {
    document.getElementById('navbar').innerHTML = Components.navbar();
    document.getElementById('footer').innerHTML = Components.footer();
    const mobileMenuContainer = document.getElementById('mobileMenu');
    mobileMenuContainer.outerHTML = `<div id="mobileMenu">${Components.mobileMenu()}</div>`;

    Components.updateCartBadge();

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        window.location.href = '../../pages/404.html';
        return;
    }

    await loadProduct(productId);
}

async function loadProduct(productId) {
    try {
        const response = await API.products.getById(productId);

        if (response.success && response.data) {
            currentProduct = response.data;
            maxQuantity = currentProduct.cantidadStock || 1;
            renderProduct();
            await checkWishlist();
            await loadRelatedProducts();
        } else {
            window.location.href = '/pages/404.html';
        }
    } catch (error) {
        ErrorHandler.showToast('Error al cargar el producto', 'error');
        setTimeout(() => window.location.href = '/pages/catalog.html', 2000);
    }
}

function renderProduct() {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('productSection').classList.remove('hidden');

    // Breadcrumb
    document.getElementById('breadcrumbCategory').textContent = currentProduct.categoria || 'Productos';
    document.getElementById('breadcrumbProduct').textContent = currentProduct.nombreProducto;

    // Product Info
    document.getElementById('productName').textContent = currentProduct.nombreProducto;
    document.getElementById('productDescription').textContent = currentProduct.descripcion || '';
    document.getElementById('productSKU').textContent = currentProduct.sku || `SKU-${currentProduct.idProducto}`;
    document.getElementById('productCategory').textContent = currentProduct.categoria || 'Sin categoría';

    // Price
    const price = currentProduct.precioPromocional || currentProduct.precioBase;
    const hasDiscount = currentProduct.precioPromocional && currentProduct.precioPromocional < currentProduct.precioBase;

    if (hasDiscount) {
        document.getElementById('originalPrice').textContent = `$${currentProduct.precioBase.toFixed(2)}`;
        document.getElementById('originalPrice').classList.remove('hidden');
    }
    document.getElementById('currentPrice').textContent = `$${price.toFixed(2)}`;

    // Stock
    const inStock = currentProduct.cantidadStock > 0;
    const stockBadge = document.getElementById('stockBadge');
    stockBadge.textContent = inStock ? `${currentProduct.cantidadStock} Disponibles` : 'Agotado';
    stockBadge.className = `px-3 py-1 rounded-full text-sm font-medium ${inStock ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'}`;

    if (!inStock) {
        document.getElementById('addToCartBtn').disabled = true;
        document.getElementById('addToCartBtn').classList.add('opacity-50', 'cursor-not-allowed');
    }

    // Images
    const images = currentProduct.imagenes || [currentProduct.imagenUrl] || [];
    const mainImage = images[0] || 'https://via.placeholder.com/600x600?text=Producto';
    
    document.getElementById('mainImage').src = mainImage;
    document.getElementById('mainImage').alt = currentProduct.nombreProducto;

    const thumbnailsHtml = images.map((img, index) => `
        <div class="cursor-pointer rounded-lg overflow-hidden border-2 ${index === 0 ? 'border-primary' : 'border-gray-200 dark:border-gray-700'} hover:border-primary transition-colors"
             onclick="changeMainImage('${img}', ${index})">
            <img src="${img}" alt="Miniatura ${index + 1}" class="w-full h-20 object-contain p-2 bg-gray-50 dark:bg-gray-900"/>
        </div>
    `).join('');
    document.getElementById('thumbnails').innerHTML = thumbnailsHtml;

    // Specifications
    renderSpecs();
}

function changeMainImage(imageSrc, index) {
    document.getElementById('mainImage').src = imageSrc;
    
    document.querySelectorAll('#thumbnails > div').forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.remove('border-gray-200', 'dark:border-gray-700');
            thumb.classList.add('border-primary');
        } else {
            thumb.classList.remove('border-primary');
            thumb.classList.add('border-gray-200', 'dark:border-gray-700');
        }
    });
}

function renderSpecs() {
    const specs = currentProduct.especificaciones || {};
    const specsHtml = Object.entries(specs).map(([key, value], index) => `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 ${index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-900/50' : ''}">
            <dt class="font-medium text-gray-600 dark:text-gray-400">${key}:</dt>
            <dd class="sm:col-span-2 text-gray-900 dark:text-white">${value}</dd>
        </div>
    `).join('');

    document.getElementById('specsList').innerHTML = specsHtml || '<p class="text-gray-500 dark:text-gray-400">No hay especificaciones disponibles</p>';
}

async function checkWishlist() {
    if (!Auth.isAuthenticated()) return;

    const response = await API.wishlist.get();
    if (response.success && response.data) {
        const wishlistIds = response.data.items?.map(item => item.productoId) || [];
        isInWishlist = wishlistIds.includes(currentProduct.idProducto);
        updateWishlistButton();
    }
}

function updateWishlistButton() {
    const btn = document.getElementById('wishlistBtn');
    const icon = btn.querySelector('.material-icons');
    icon.textContent = isInWishlist ? 'favorite' : 'favorite_border';
    icon.classList.toggle('text-red-500', isInWishlist);
}

async function toggleWishlist() {
    if (!Auth.isAuthenticated()) {
        ErrorHandler.showToast('Debes iniciar sesión para agregar a favoritos', 'warning');
        setTimeout(() => window.location.href = `/pages/login.html?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`, 1500);
        return;
    }

    const response = isInWishlist 
        ? await API.wishlist.removeItem(currentProduct.idProducto)
        : await API.wishlist.addItem(currentProduct.idProducto);

    if (response.success) {
        isInWishlist = !isInWishlist;
        updateWishlistButton();
        ErrorHandler.showToast(isInWishlist ? 'Agregado a favoritos' : 'Eliminado de favoritos', isInWishlist ? 'success' : 'info');
    } else {
        ErrorHandler.handleApiError(response);
    }
}

function incrementQuantity() {
    if (currentQuantity < maxQuantity) {
        currentQuantity++;
        document.getElementById('quantity').value = currentQuantity;
    }
}

function decrementQuantity() {
    if (currentQuantity > 1) {
        currentQuantity--;
        document.getElementById('quantity').value = currentQuantity;
    }
}

async function addToCart() {
    if (!Auth.isAuthenticated()) {
        ErrorHandler.showToast('Debes iniciar sesión para agregar al carrito', 'warning');
        setTimeout(() => window.location.href = `/pages/login.html?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`, 1500);
        return;
    }

    const btn = document.getElementById('addToCartBtn');
    ErrorHandler.setLoading(btn, true);

    const response = await API.cart.addItem({
        productoId: currentProduct.idProducto,
        cantidad: currentQuantity
    });

    ErrorHandler.setLoading(btn, false);

    if (response.success) {
        ErrorHandler.showToast(`${currentQuantity} producto(s) agregado(s) al carrito`, 'success');
        Components.updateCartBadge();
    } else {
        ErrorHandler.handleApiError(response);
    }
}

async function loadRelatedProducts() {
    try {
        const response = await API.products.search({
            category: currentProduct.categoria,
            pageSize: 4
        });

        if (response.success && response.data) {
            relatedProducts = (response.data.items || response.data)
                .filter(p => p.idProducto !== currentProduct.idProducto)
                .slice(0, 4);
            
            renderRelatedProducts();
        }
    } catch (error) {
        console.error('Error loading related products:', error);
    }
}

function renderRelatedProducts() {
    const html = relatedProducts.map(product => {
        const price = product.precioPromocional || product.precioBase;
        const imageUrl = product.imagenUrl || 'https://via.placeholder.com/300x300?text=Producto';
        
        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden group">
                <div class="p-4 bg-gray-100 dark:bg-gray-900">
                    <a href="/pages/product.html?id=${product.idProducto}">
                        <img src="${imageUrl}" alt="${product.nombreProducto}" 
                             class="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-300"/>
                    </a>
                </div>
                <div class="p-4">
                    <a href="/pages/product.html?id=${product.idProducto}" 
                       class="font-semibold text-lg mb-2 hover:text-primary line-clamp-2 block">
                        ${product.nombreProducto}
                    </a>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                        ${product.descripcion || ''}
                    </p>
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-xl text-primary">$${price.toFixed(2)}</span>
                        <button onclick="quickAddToCart(${product.idProducto})" 
                                class="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                            <span class="material-icons">add_shopping_cart</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('relatedProducts').innerHTML = html || '<p class="text-gray-500">No hay productos relacionados</p>';
}

async function quickAddToCart(productId) {
    if (!Auth.isAuthenticated()) {
        ErrorHandler.showToast('Debes iniciar sesión para agregar al carrito', 'warning');
        setTimeout(() => window.location.href = `/pages/login.html?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`, 1500);
        return;
    }

    const response = await API.cart.addItem({ productoId, cantidad: 1 });

    if (response.success) {
        ErrorHandler.showToast('Producto agregado al carrito', 'success');
        Components.updateCartBadge();
    } else {
        ErrorHandler.handleApiError(response);
    }
}

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active', 'border-primary', 'text-primary');
        btn.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-400');
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    document.getElementById(`${tab}Tab`).classList.add('active', 'border-primary', 'text-primary');
    document.getElementById(`${tab}Content`).classList.remove('hidden');
}

function shareProduct(platform) {
    const url = window.location.href;
    const title = currentProduct.nombreProducto;
    
    let shareUrl = '';
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
        case 'link':
            navigator.clipboard.writeText(url);
            ErrorHandler.showToast('Enlace copiado al portapapeles', 'success');
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

initProductPage();