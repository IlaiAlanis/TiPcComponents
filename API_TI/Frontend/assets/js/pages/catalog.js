let currentPage = 1;
let totalPages = 1;
let currentFilters = {
    category: '',
    marca: '',
    precioMax: 10000,
    enStock: false,
    orderBy: 'featured',
    page: 1,
    pageSize: 12
};
let wishlistItems = new Set();

// Initialize page
async function initCatalogPage() {
    document.getElementById('navbar').innerHTML = Components.navbar();
    document.getElementById('footer').innerHTML = Components.footer();
    const mobileMenuContainer = document.getElementById('mobileMenu');
    mobileMenuContainer.outerHTML = `<div id="mobileMenu">${Components.mobileMenu()}</div>`;

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        window.location.href = '../../pages/404.html';
        return;
    }
    
    Components.updateCartBadge();

    const category = params.get('category');
    const query = params.get('q');

    if (category) {
        currentFilters.category = category;
        updateBreadcrumb(category);
    }

    if (query) {
        currentFilters.query = query;
        document.getElementById('pageTitle').textContent = `Resultados para "${query}"`;
    }

    await loadFilters();
    await loadWishlist();
    await loadProducts();
    updateMobileFilterButton();
}

// Load filter options
/*async function loadFilters() {
    const categoriesHtml = [
        { value: '', label: 'Todos' },
        { value: 'cpu', label: 'Procesadores' },
        { value: 'gpu', label: 'Tarjetas Gráficas' },
        { value: 'motherboard', label: 'Placas Madre' },
        { value: 'ram', label: 'Memorias RAM' },
        { value: 'storage', label: 'Almacenamiento' },
        { value: 'psu', label: 'Fuentes de Poder' },
        { value: 'case', label: 'Gabinetes' }
    ].map(cat => `
        <label class="flex items-center cursor-pointer hover:text-primary transition-colors">
            <input type="radio" name="category" value="${cat.value}" 
                   ${currentFilters.category === cat.value ? 'checked' : ''}
                   onchange="currentFilters.category=this.value; applyFilters()"
                   class="text-primary focus:ring-primary"/>
            <span class="ml-2">${cat.label}</span>
        </label>
    `).join('');

    document.getElementById('categoryFilters').innerHTML = categoriesHtml;

    const brands = ['Intel', 'AMD', 'NVIDIA', 'ASUS', 'MSI', 'Corsair', 'Kingston', 'Samsung'];
    const brandsHtml = brands.map(brand => `
        <label class="flex items-center cursor-pointer hover:text-primary transition-colors">
            <input type="checkbox" value="${brand}" 
                   onchange="toggleBrandFilter(this)"
                   class="text-primary focus:ring-primary rounded"/>
            <span class="ml-2">${brand}</span>
        </label>
    `).join('');

    document.getElementById('brandFilters').innerHTML = brandsHtml;
}*/

async function loadFilters() {
    // Fetch categories from API
    const categoriesResponse = await API.products.getCategories();
    const categories = categoriesResponse.success ? categoriesResponse.data : [];
    
    const categoriesHtml = [
        { value: '', label: 'Todos' },
        ...categories.map(cat => ({ value: cat.value, label: cat.label }))
    ].map(cat => `
        <label class="flex items-center cursor-pointer hover:text-primary transition-colors">
            <input type="radio" name="category" value="${cat.value}" 
                   ${currentFilters.category === cat.value ? 'checked' : ''}
                   onchange="currentFilters.category=this.value; applyFilters()"
                   class="text-primary focus:ring-primary"/>
            <span class="ml-2">${cat.label}</span>
        </label>
    `).join('');

    document.getElementById('categoryFilters').innerHTML = categoriesHtml;

    // Fetch brands from API
    const brandsResponse = await API.products.getBrands();
    const brands = brandsResponse.success ? brandsResponse.data : [];
    
    const brandsHtml = brands.map(brand => `
        <label class="flex items-center cursor-pointer hover:text-primary transition-colors">
            <input type="checkbox" value="${brand}" 
                   onchange="toggleBrandFilter(this)"
                   class="text-primary focus:ring-primary rounded"/>
            <span class="ml-2">${brand}</span>
        </label>
    `).join('');

    document.getElementById('brandFilters').innerHTML = brandsHtml;
}

async function loadWishlist() {
    if (!Auth.isAuthenticated()) return;

    const response = await API.wishlist.get();
    if (response.success && response.data) {
        wishlistItems = new Set(response.data.items?.map(item => item.productoId) || []);
    }
}

async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = createLoadingSpinner();

    try {
        const response = await API.products.search(currentFilters);

        if (response.success && response.data) {
            const products = response.data.items || response.data;
            totalPages = response.data.totalPages || Math.ceil((response.data.total || products.length) / currentFilters.pageSize);

            if (products.length === 0) {
                grid.innerHTML = createEmptyState('No se encontraron productos con los filtros seleccionados');
            } else {
                grid.innerHTML = products.map(product => createProductCard(product)).join('');
                updateProductCount(response.data.total || products.length);
                renderPagination();
            }
        } else {
            grid.innerHTML = createErrorState('Error al cargar productos');
        }
    } catch (error) {
        grid.innerHTML = createErrorState('Error de conexión');
    }
}

function createProductCard(product) {
    const price = product.precioPromocional || product.precioBase;
    const hasDiscount = product.precioPromocional && product.precioPromocional < product.precioBase;
    const discountPercent = hasDiscount ? Math.round(((product.precioBase - product.precioPromocional) / product.precioBase) * 100) : 0;
    const imageUrl = product.imagenUrl || 'https://via.placeholder.com/300x300?text=Producto';
    const isInWishlist = wishlistItems.has(product.idProducto);
    const inStock = product.cantidadStock > 0;
    const sku = product.sku || `SKU-${product.idProducto}`;

    return `
        <div class="product-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group relative">
            <div class="relative overflow-hidden">
                <a href="/pages/product.html?id=${product.idProducto}">
                    <img src="${imageUrl}" alt="${product.nombreProducto}" class="w-full h-64 object-cover transition-transform duration-300"/>
                </a>
                
                ${hasDiscount ? `<span class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-${discountPercent}%</span>` : ''}
                
                <button onclick="toggleWishlist(${product.idProducto}, event)" 
                        class="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors">
                    <span class="material-icons text-xl ${isInWishlist ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}">
                        ${isInWishlist ? 'favorite' : 'favorite_border'}
                    </span>
                </button>
            </div>
            
            <div class="p-4">
                <a href="/pages/product.html?id=${product.idProducto}" class="font-semibold text-base hover:text-primary transition-colors line-clamp-2 block mb-2">
                    ${product.nombreProducto}
                </a>
                
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">${product.categoria || 'Multifuncionales, AEXT, Cat'}</p>
                
                <div class="flex items-center gap-1 mb-3">
                    <span class="material-icons text-green-500 text-sm">check_circle</span>
                    <span class="text-sm text-gray-700 dark:text-gray-300">${product.cantidadStock || 0} Disponible</span>
                </div>
                
                <div class="mb-3">
                    ${hasDiscount ? `<p class="text-sm text-gray-500 dark:text-gray-400 line-through">$${product.precioBase.toFixed(2)}</p>` : ''}
                    <p class="text-2xl font-bold text-primary">$${price.toFixed(2)}</p>
                </div>
                
                <div class="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mb-2">
                    <span class="material-icons text-sm">local_shipping</span>
                    <span>Entrega estimada: 25-27 Nov 2025</span>
                </div>
                
                <div class="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mb-3">
                    <span class="material-icons text-sm">store</span>
                    <span>Envío desde $149.00</span>
                    <span class="font-semibold ml-2">Disponible en GDL</span>
                </div>
                
                <div class="border border-primary rounded px-2 py-1 inline-block">
                    <span class="text-xs font-semibold text-primary">SKU: ${sku}</span>
                </div>
            </div>
            
            <div class="product-actions absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                <button onclick="addToCart(${product.idProducto})" ${!inStock ? 'disabled' : ''}
                        class="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}">
                    <span class="material-icons">shopping_cart</span>
                    <span>Agregar Al Carrito</span>
                </button>
                <button onclick="showQuickPreview(${product.idProducto})" 
                        class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-3 rounded-lg transition-colors">
                    <span class="material-icons">search</span>
                </button>
                <button onclick="compareProduct(${product.idProducto})" 
                        class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-3 rounded-lg transition-colors">
                    <span class="material-icons">compare_arrows</span>
                </button>
            </div>
        </div>
    `;
}

async function showQuickPreview(productId) {
    const modal = document.createElement('div');
    modal.id = 'quickPreviewModal';
    modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in';
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <div class="flex items-center justify-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const response = await API.products.getById(productId);

    if (response.success && response.data) {
        const product = response.data;
        const price = product.precioPromocional || product.precioBase;
        const hasDiscount = product.precioPromocional && product.precioPromocional < product.precioBase;
        const imageUrl = product.imagenUrl || 'https://via.placeholder.com/400x400?text=Producto';
        const inStock = product.cantidadStock > 0;
        const sku = product.sku || `SKU-${product.idProducto}`;

        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                <button onclick="closeQuickPreview()" 
                        class="absolute top-4 right-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-lg z-10">
                    <span class="material-icons text-gray-700 dark:text-gray-300">close</span>
                </button>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div class="flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                        <img src="${imageUrl}" alt="${product.nombreProducto}" class="max-w-full h-auto object-contain"/>
                    </div>
                    
                    <div class="flex flex-col">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">${product.nombreProducto}</h2>
                        
                        <div class="mb-4">
                            <span class="text-green-600 dark:text-green-400 font-semibold">Disponible en GDL</span>
                        </div>
                        
                        <div class="mb-6">
                            ${hasDiscount ? `<p class="text-lg text-gray-500 dark:text-gray-400 line-through">$${product.precioBase.toFixed(2)}</p>` : ''}
                            <p class="text-4xl font-bold text-primary">$${price.toFixed(2)}</p>
                        </div>
                        
                        <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div class="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                <span class="material-icons text-sm">local_shipping</span>
                                <span class="text-sm">Entrega estimada: 25-27 Nov 2025</span>
                            </div>
                        </div>
                        
                        <div class="mb-6 p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                            <p class="text-sm mb-2">Hasta <span class="font-bold">3 meses sin intereses</span> de <span class="text-primary font-bold">$${(price / 3).toFixed(2)}</span></p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">(con tarjetas participantes de Mercado Pago)</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">Vendido y enviado por <span class="font-semibold">DIMERCOM</span></p>
                        </div>
                        
                        <div class="mb-6">
                            <div class="flex items-center gap-3 mb-4">
                                <button onclick="decrementQuantity()" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                    <span class="material-icons">remove</span>
                                </button>
                                <input type="number" id="quickPreviewQuantity" value="1" min="1" max="${product.cantidadStock}"
                                       class="w-16 text-center border border-gray-300 dark:border-gray-600 rounded-lg py-2 bg-white dark:bg-gray-700"/>
                                <button onclick="incrementQuantity(${product.cantidadStock})" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                    <span class="material-icons">add</span>
                                </button>
                                <button onclick="addToCartFromPreview(${product.idProducto})" ${!inStock ? 'disabled' : ''}
                                        class="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-lg transition-colors ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}">
                                    Agregar Al Carrito
                                </button>
                            </div>
                            
                            <div class="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                                <span class="material-icons text-sm">store</span>
                                <span>Envío desde $149.00</span>
                            </div>
                        </div>
                        
                        <div class="mb-4 p-2 border border-primary rounded-lg inline-block">
                            <span class="text-sm font-semibold text-primary">SKU: ${sku}</span>
                        </div>
                        
                        <div class="mb-4">
                            <span class="text-sm text-gray-600 dark:text-gray-400">
                                <span class="font-semibold">Categorías:</span> ${product.categoria || 'AEXT, Cat, Multifuncionales'}
                            </span>
                        </div>
                        
                        <div class="flex items-center gap-3">
                            <span class="text-sm font-semibold">Comparte:</span>
                            <button class="hover:text-primary transition-colors">
                                <span class="material-icons text-gray-600 dark:text-gray-400">facebook</span>
                            </button>
                            <button class="hover:text-primary transition-colors">
                                <span class="material-icons text-gray-600 dark:text-gray-400">email</span>
                            </button>
                            <button class="hover:text-primary transition-colors">
                                <span class="material-icons text-gray-600 dark:text-gray-400">link</span>
                            </button>
                        </div>
                        
                        <a href="/pages/product.html?id=${product.idProducto}" 
                           class="mt-6 block text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg transition-colors">
                            Ver Detalles Completos
                        </a>
                    </div>
                </div>
            </div>
        `;
    } else {
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                <div class="text-center text-red-500">
                    <span class="material-icons text-5xl mb-4">error_outline</span>
                    <p>Error al cargar el producto</p>
                    <button onclick="closeQuickPreview()" class="mt-4 bg-primary text-white px-6 py-2 rounded-lg">Cerrar</button>
                </div>
            </div>
        `;
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeQuickPreview();
    });
}

function closeQuickPreview() {
    const modal = document.getElementById('quickPreviewModal');
    if (modal) modal.remove();
}

function incrementQuantity(max) {
    const input = document.getElementById('quickPreviewQuantity');
    if (input && parseInt(input.value) < max) {
        input.value = parseInt(input.value) + 1;
    }
}

function decrementQuantity() {
    const input = document.getElementById('quickPreviewQuantity');
    if (input && parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

async function addToCartFromPreview(productId) {
    if (!Auth.isAuthenticated()) {
        ErrorHandler.showToast('Debes iniciar sesión para agregar al carrito', 'warning');
        setTimeout(() => window.location.href = '/pages/login.html?redirect=' + encodeURIComponent(window.location.pathname), 1500);
        return;
    }

    const quantity = parseInt(document.getElementById('quickPreviewQuantity').value);
    const response = await API.cart.addItem({ productoId: productId, cantidad: quantity });

    if (response.success) {
        ErrorHandler.showToast(`${quantity} producto(s) agregado(s) al carrito`, 'success');
        Components.updateCartBadge();
        closeQuickPreview();
    } else {
        ErrorHandler.handleApiError(response);
    }
}

function compareProduct(productId) {
    ErrorHandler.showToast('Función de comparación próximamente', 'info');
}

async function toggleWishlist(productId, event) {
    event.stopPropagation();

    if (!Auth.isAuthenticated()) {
        ErrorHandler.showToast('Debes iniciar sesión para agregar a favoritos', 'warning');
        setTimeout(() => window.location.href = '/pages/login.html?redirect=' + encodeURIComponent(window.location.pathname), 1500);
        return;
    }

    const isInWishlist = wishlistItems.has(productId);
    const response = isInWishlist ? await API.wishlist.removeItem(productId) : await API.wishlist.addItem(productId);

    if (response.success) {
        if (isInWishlist) {
            wishlistItems.delete(productId);
            ErrorHandler.showToast('Eliminado de favoritos', 'info');
        } else {
            wishlistItems.add(productId);
            ErrorHandler.showToast('Agregado a favoritos', 'success');
        }
        await loadProducts();
    } else {
        ErrorHandler.handleApiError(response);
    }
}

async function addToCart(productId) {
    if (!Auth.isAuthenticated()) {
        ErrorHandler.showToast('Debes iniciar sesión para agregar al carrito', 'warning');
        setTimeout(() => window.location.href = '/pages/login.html?redirect=' + encodeURIComponent(window.location.pathname), 1500);
        return;
    }

    const response = await API.cart.addItem({ productoId: productId, cantidad: 1 });

    if (response.success) {
        ErrorHandler.showToast('Producto agregado al carrito', 'success');
        Components.updateCartBadge();
    } else {
        ErrorHandler.handleApiError(response);
    }
}

function toggleBrandFilter(checkbox) {
    const brands = Array.from(document.querySelectorAll('#brandFilters input:checked')).map(cb => cb.value);
    currentFilters.marca = brands.join(',');
}

function updatePriceLabel() {
    const value = document.getElementById('priceRange').value;
    document.getElementById('priceLabel').textContent = value >= 10000 ? '$10,000+' : `$${value}`;
    currentFilters.precioMax = parseInt(value);
}

function applyFilters() {
    currentFilters.enStock = document.getElementById('inStockOnly').checked;
    currentFilters.orderBy = document.getElementById('sortBy').value;
    currentFilters.page = 1;
    currentPage = 1;
    loadProducts();
}

function clearFilters() {
    currentFilters = {
        category: '',
        marca: '',
        precioMax: 10000,
        enStock: false,
        orderBy: 'featured',
        page: 1,
        pageSize: 12
    };

    document.querySelectorAll('#categoryFilters input[value=""]')[0].checked = true;
    document.querySelectorAll('#brandFilters input').forEach(cb => cb.checked = false);
    document.getElementById('priceRange').value = 10000;
    document.getElementById('priceLabel').textContent = '$10,000+';
    document.getElementById('inStockOnly').checked = false;
    document.getElementById('sortBy').value = 'featured';

    loadProducts();
}

function openMobileFilters() {
    const modal = document.getElementById('mobileFilterModal');
    const count = getActiveFiltersCount();
    
    modal.innerHTML = `
        <div class="absolute inset-x-0 bottom-0 bg-white dark:bg-gray-800 rounded-t-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
            <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                <h3 class="text-xl font-bold">Filtros</h3>
                <button onclick="closeMobileFilters()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <span class="material-icons">close</span>
                </button>
            </div>

            <div class="p-4">
                <div class="mb-4">
                    <button onclick="toggleFilterSection('stock')" class="w-full flex items-center justify-between py-3">
                        <div class="flex items-center gap-3">
                            <span class="material-icons text-gray-600 dark:text-gray-400">inventory_2</span>
                            <span class="font-semibold">Disponibilidad</span>
                        </div>
                        <span class="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full min-w-[32px] text-center">
                            ${currentFilters.enStock ? '1' : '0'}
                        </span>
                    </button>
                    <div id="stockFilter" class="pl-10 space-y-2 hidden">
                        <label class="flex items-center cursor-pointer py-2">
                            <input type="checkbox" id="mobileInStockOnly" ${currentFilters.enStock ? 'checked' : ''} class="text-primary focus:ring-primary rounded"/>
                            <span class="ml-3">Solo en stock</span>
                        </label>
                    </div>
                </div>

                <div class="mb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <button onclick="toggleFilterSection('category')" class="w-full flex items-center justify-between py-3">
                        <div class="flex items-center gap-3">
                            <span class="material-icons text-gray-600 dark:text-gray-400">category</span>
                            <span class="font-semibold">Categoría</span>
                        </div>
                        <span class="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full min-w-[32px] text-center">
                            ${currentFilters.category ? '1' : '8'}
                        </span>
                    </button>
                    <div id="categoryFilter" class="pl-10 space-y-2 hidden"></div>
                </div>

                <div class="mb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <button onclick="toggleFilterSection('brand')" class="w-full flex items-center justify-between py-3">
                        <div class="flex items-center gap-3">
                            <span class="material-icons text-gray-600 dark:text-gray-400">business</span>
                            <span class="font-semibold">Marcas</span>
                        </div>
                        <span class="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full min-w-[32px] text-center">
                            ${currentFilters.marca ? currentFilters.marca.split(',').length : '8'}
                        </span>
                    </button>
                    <div id="brandFilter" class="pl-10 space-y-2 hidden"></div>
                </div>

                <div class="mb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <button onclick="toggleFilterSection('price')" class="w-full flex items-center justify-between py-3">
                        <div class="flex items-center gap-3">
                            <span class="material-icons text-gray-600 dark:text-gray-400">payments</span>
                            <span class="font-semibold">Precio</span>
                        </div>
                        <span class="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full min-w-[32px] text-center">0</span>
                    </button>
                    <div id="priceFilter" class="pl-10 hidden">
                        <input type="range" id="mobilePriceRange" min="0" max="10000" value="${currentFilters.precioMax}"
                               class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                               oninput="updateMobilePriceLabel()"/>
                        <div class="flex justify-between text-sm text-gray-500 mt-2">
                            <span>$0</span>
                            <span id="mobilePriceLabel">$${currentFilters.precioMax >= 10000 ? '10,000+' : currentFilters.precioMax}</span>
                        </div>
                    </div>
                </div>

                <div class="mb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <button onclick="toggleFilterSection('sort')" class="w-full flex items-center justify-between py-3">
                        <div class="flex items-center gap-3">
                            <span class="material-icons text-gray-600 dark:text-gray-400">sort</span>
                            <span class="font-semibold">Ordenar por</span>
                        </div>
                        <span class="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full min-w-[32px] text-center">0</span>
                    </button>
                    <div id="sortFilter" class="pl-10 space-y-2 hidden">
                        <label class="flex items-center cursor-pointer py-2">
                            <input type="radio" name="mobileSortBy" value="featured" ${currentFilters.orderBy === 'featured' ? 'checked' : ''} class="text-primary focus:ring-primary"/>
                            <span class="ml-3">Destacados</span>
                        </label>
                        <label class="flex items-center cursor-pointer py-2">
                            <input type="radio" name="mobileSortBy" value="price_asc" ${currentFilters.orderBy === 'price_asc' ? 'checked' : ''} class="text-primary focus:ring-primary"/>
                            <span class="ml-3">Precio: Menor a Mayor</span>
                        </label>
                        <label class="flex items-center cursor-pointer py-2">
                            <input type="radio" name="mobileSortBy" value="price_desc" ${currentFilters.orderBy === 'price_desc' ? 'checked' : ''} class="text-primary focus:ring-primary"/>
                            <span class="ml-3">Precio: Mayor a Menor</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
                <button onclick="applyMobileFilters()" class="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-4 rounded-lg transition-colors">
                    Ver resultados
                </button>
                <button onclick="clearMobileFilters()" class="w-full text-primary hover:text-primary-hover font-semibold py-2">
                    Limpiar filtros
                </button>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    populateMobileFilters();
}

function closeMobileFilters() {
    const modal = document.getElementById('mobileFilterModal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function toggleFilterSection(section) {
    const element = document.getElementById(`${section}Filter`);
    element.classList.toggle('hidden');
}

function populateMobileFilters() {
    const categories = [
        { value: '', label: 'Todos' },
        { value: 'cpu', label: 'Procesadores' },
        { value: 'gpu', label: 'Tarjetas Gráficas' },
        { value: 'motherboard', label: 'Placas Madre' },
        { value: 'ram', label: 'Memorias RAM' },
        { value: 'storage', label: 'Almacenamiento' },
        { value: 'psu', label: 'Fuentes de Poder' },
        { value: 'case', label: 'Gabinetes' }
    ];
    
    document.getElementById('categoryFilter').innerHTML = categories.map(cat => `
        <label class="flex items-center cursor-pointer py-2">
            <input type="radio" name="mobileCategory" value="${cat.value}" ${currentFilters.category === cat.value ? 'checked' : ''} class="text-primary focus:ring-primary"/>
            <span class="ml-3">${cat.label}</span>
        </label>
    `).join('');
    
    const brands = ['Intel', 'AMD', 'NVIDIA', 'ASUS', 'MSI', 'Corsair', 'Kingston', 'Samsung'];
    document.getElementById('brandFilter').innerHTML = brands.map(brand => `
        <label class="flex items-center cursor-pointer py-2">
            <input type="checkbox" value="${brand}" ${currentFilters.marca && currentFilters.marca.includes(brand) ? 'checked' : ''} class="text-primary focus:ring-primary rounded"/>
            <span class="ml-3">${brand}</span>
        </label>
    `).join('');
}

function updateMobilePriceLabel() {
    const value = document.getElementById('mobilePriceRange').value;
    document.getElementById('mobilePriceLabel').textContent = value >= 10000 ? '$10,000+' : `$${value}`;
}

function applyMobileFilters() {
    currentFilters.enStock = document.getElementById('mobileInStockOnly').checked;
    currentFilters.precioMax = parseInt(document.getElementById('mobilePriceRange').value);
    
    const selectedCategory = document.querySelector('input[name="mobileCategory"]:checked');
    currentFilters.category = selectedCategory ? selectedCategory.value : '';
    
    const selectedBrands = Array.from(document.querySelectorAll('#mobileBrandFilters input:checked')).map(cb => cb.value);
    currentFilters.marca = selectedBrands.join(',');
    
    const selectedSort = document.querySelector('input[name="mobileSortBy"]:checked');
    currentFilters.orderBy = selectedSort ? selectedSort.value : 'featured';
    
    currentFilters.page = 1;
    currentPage = 1;
    
    closeMobileFilters();
    loadProducts();
    updateMobileFilterButton();
}

function clearMobileFilters() {
    currentFilters = {
        category: '',
        marca: '',
        precioMax: 10000,
        enStock: false,
        orderBy: 'featured',
        page: 1,
        pageSize: 12
    };
    populateMobileFilters();
    document.getElementById('mobilePriceRange').value = 10000;
    document.getElementById('mobilePriceLabel').textContent = '$10,000+';
    document.getElementById('mobileInStockOnly').checked = false;
}

function getActiveFiltersCount() {
    let count = 0;
    if (currentFilters.category) count++;
    if (currentFilters.marca) count += currentFilters.marca.split(',').length;
    if (currentFilters.enStock) count++;
    if (currentFilters.precioMax < 10000) count++;
    return count;
}

function updateMobileFilterButton() {
    const btn = document.getElementById('mobileFilterBtn');
    const count = getActiveFiltersCount();
    const badge = count > 0 ? `<span class="bg-white text-primary text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ml-2">${count}</span>` : '';
    
    btn.innerHTML = `
        <span class="material-icons">tune</span>
        <span class="font-semibold">Filtros</span>
        ${badge}
    `;
}

function renderPagination() {
    const container = document.getElementById('pagination');
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}
                class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="material-icons">chevron_left</span>
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `
                <button onclick="changePage(${i})" 
                        class="px-4 py-2 rounded-lg ${i === currentPage ? 'bg-primary text-white' : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<span class="px-2">...</span>';
        }
    }

    html += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}
                class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="material-icons">chevron_right</span>
        </button>
    `;

    container.innerHTML = html;
}

function changePage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    currentFilters.page = page;
    loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProductCount(total) {
    document.getElementById('productCount').textContent = `${total} producto${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`;
}

function updateBreadcrumb(category) {
    const categories = {
        'cpu': 'Procesadores',
        'gpu': 'Tarjetas Gráficas',
        'motherboard': 'Placas Madre',
        'ram': 'Memorias RAM',
        'storage': 'Almacenamiento',
        'psu': 'Fuentes de Poder',
        'case': 'Gabinetes'
    };
    document.getElementById('breadcrumbCategory').textContent = categories[category] || 'Catálogo';
    document.getElementById('pageTitle').textContent = categories[category] || 'Catálogo de Productos';
}

initCatalogPage();
