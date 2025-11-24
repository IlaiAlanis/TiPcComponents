// State management
let currentFilters = {
    categoria: null,
    marcas: [],
    precioMax: 10000,
    enStock: false,
    busqueda: '',
    page: 1,
    pageSize: 12,
    ordenar: 'newest'
};

let allProducts = [];
let wishlistItems = new Set();

// Initialize page
async function initCatalogPage() {
    // Render components
    document.getElementById('navbar').innerHTML = Components.navbar();
    document.getElementById('footer').innerHTML = Components.footer();
    const mobileMenuContainer = document.getElementById('mobileMenu');
    mobileMenuContainer.outerHTML = `<div id="mobileMenu">${Components.mobileMenu()}</div>`;
    
    // Update cart badge
    Components.updateCartBadge();
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentFilters.categoria = urlParams.get('category');
    currentFilters.busqueda = urlParams.get('q') || '';
    
    // Update breadcrumb
    if (currentFilters.categoria) {
        document.getElementById('breadcrumbCategory').textContent = 
            currentFilters.categoria.charAt(0).toUpperCase() + currentFilters.categoria.slice(1);
        document.getElementById('pageTitle').textContent = 
            `Catálogo: ${currentFilters.categoria.charAt(0).toUpperCase() + currentFilters.categoria.slice(1)}`;
    } else if (currentFilters.busqueda) {
        document.getElementById('pageTitle').textContent = `Resultados para: "${currentFilters.busqueda}"`;
    }
    
    // Load data
    await Promise.all([
        loadFilters(),
        loadWishlist(),
        loadProducts()
    ]);
}

// Load available filters
async function loadFilters() {
    // Categories
    const categories = [
        { id: 'cpu', name: 'Procesadores', icon: 'memory' },
        { id: 'gpu', name: 'Tarjetas Gráficas', icon: 'view_in_ar' },
        { id: 'motherboard', name: 'Placas Madre', icon: 'developer_board' },
        { id: 'ram', name: 'Memoria RAM', icon: 'storage' },
        { id: 'storage', name: 'Almacenamiento', icon: 'save' }
    ];
    
    const categoryHTML = categories.map(cat => `
        <label class="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors">
            <input type="radio" name="category" value="${cat.id}" 
                   ${currentFilters.categoria === cat.id ? 'checked' : ''}
                   onchange="filterByCategory('${cat.id}')"
                   class="text-primary focus:ring-primary">
            <span class="material-icons text-primary mx-2 text-sm">${cat.icon}</span>
            <span class="flex-1">${cat.name}</span>
        </label>
    `).join('');
    
    document.getElementById('categoryFilters').innerHTML = categoryHTML;
    
    // Brands (you can fetch from API)
    const brands = ['Intel', 'AMD', 'NVIDIA', 'Corsair', 'Kingston', 'Samsung'];
    const brandHTML = brands.map(brand => `
        <label class="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors">
            <input type="checkbox" value="${brand}" 
                   onchange="toggleBrandFilter('${brand}')"
                   class="rounded text-primary focus:ring-primary">
            <span class="ml-2">${brand}</span>
        </label>
    `).join('');
    
    document.getElementById('brandFilters').innerHTML = brandHTML;
}

// Load user's wishlist
async function loadWishlist() {
    if (!Auth.isAuthenticated()) return;
    
    const response = await API.wishlist.get();
    if (response.success && response.data) {
        wishlistItems = new Set(response.data.map(item => item.productoId));
    }
}

// Load products
async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = createLoadingSpinner();
    
    try {
        // Build search filters
        const searchFilters = {
            page: currentFilters.page,
            pageSize: currentFilters.pageSize,
            precioMax: currentFilters.precioMax,
            categoria: currentFilters.categoria,
            marcas: currentFilters.marcas.length > 0 ? currentFilters.marcas : null,
            busqueda: currentFilters.busqueda || null,
            enStock: currentFilters.enStock || null
        };
        
        const response = await API.products.search(searchFilters);
        
        if (response.success && response.data) {
            allProducts = response.data.items || [];
            
            // Sort products
            sortProducts();
            
            // Update result count
            document.getElementById('resultCount').textContent = 
                `Mostrando ${allProducts.length} de ${response.data.totalItems || 0} productos`;
            
            // Render products
            if (allProducts.length > 0) {
                grid.innerHTML = allProducts.map(product => createProductCard(product)).join('');
            } else {
                grid.innerHTML = createEmptyState('No se encontraron productos con estos filtros');
            }
            
            // Render pagination
            renderPagination(response.data.totalPages || 1);
        } else {
            grid.innerHTML = createErrorState('Error al cargar productos');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        grid.innerHTML = createErrorState('Error de conexión');
    }
}

// Create product card
function createProductCard(product) {
    const price = product.precioPromocional || product.precioBase;
    const hasDiscount = product.precioPromocional && product.precioPromocional < product.precioBase;
    const imageUrl = product.imagenUrl || 'https://via.placeholder.com/400x300?text=PC+Component';
    const isInWishlist = wishlistItems.has(product.idProducto);
    const inStock = product.cantidadEnStock > 0;
    
    return `
        <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div class="relative bg-gray-100 dark:bg-gray-900 p-4">
                <img src="${imageUrl}" 
                     alt="${product.nombreProducto}"
                     class="w-full h-48 object-contain cursor-pointer transform group-hover:scale-105 transition-transform duration-300"
                     onclick="window.location.href='/pages/product.html?id=${product.idProducto}'">
                
                ${hasDiscount ? '<span class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">OFERTA</span>' : ''}
                ${!inStock ? '<span class="absolute top-3 left-3 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded">AGOTADO</span>' : ''}
                
                <button onclick="toggleWishlist(${product.idProducto}, this)" 
                        class="absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-full transition-all hover:bg-white dark:hover:bg-gray-800 hover:scale-110">
                    <span class="material-icons text-xl ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}">${isInWishlist ? 'favorite' : 'favorite_border'}</span>
                </button>
            </div>
            
            <div class="p-4 flex flex-col flex-grow">
                <h3 class="font-semibold text-lg cursor-pointer hover:text-primary line-clamp-2" 
                    onclick="window.location.href='/pages/product.html?id=${product.idProducto}'">
                    ${product.nombreProducto}
                </h3>
                
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-3 line-clamp-2 flex-grow">
                    ${product.descripcion || 'Sin descripción'}
                </p>
                
                ${product.calificacionPromedio ? `
                    <div class="flex items-center text-yellow-400 mb-3">
                        ${generateStars(product.calificacionPromedio)}
                        <span class="text-sm text-gray-600 dark:text-gray-400 ml-2">(${product.cantidadResenas || 0})</span>
                    </div>
                ` : ''}
                
                <div class="flex items-center justify-between mt-auto">
                    <div>
                        ${hasDiscount ? `
                            <p class="text-sm text-gray-500 line-through">$${product.precioBase.toFixed(2)}</p>
                            <p class="text-2xl font-bold text-primary">$${price.toFixed(2)}</p>
                        ` : `
                            <p class="text-2xl font-bold text-primary">$${price.toFixed(2)}</p>
                        `}
                    </div>
                    
                    <button onclick="${inStock ? `addToCart(${product.idProducto})` : ''}" 
                            ${!inStock ? 'disabled' : ''}
                            class="bg-primary hover:bg-primary-hover text-white p-3 rounded-lg transition-colors ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}">
                        <span class="material-icons">shopping_cart</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let html = '';
    
    for (let i = 0; i < fullStars; i++) {
        html += '<span class="material-icons text-sm">star</span>';
    }
    if (hasHalfStar) {
        html += '<span class="material-icons text-sm">star_half</span>';
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        html += '<span class="material-icons text-sm">star_border</span>';
    }
    
    return html;
}

// Pagination
function renderPagination(totalPages) {
    if (totalPages <= 1) {
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    let html = `
        <button onclick="changePage(${currentFilters.page - 1})" 
                ${currentFilters.page === 1 ? 'disabled' : ''}
                class="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="material-icons">chevron_left</span>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentFilters.page - 1 && i <= currentFilters.page + 1)) {
            html += `
                <button onclick="changePage(${i})"
                        class="px-4 py-2 rounded-lg ${i === currentFilters.page ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}">
                    ${i}
                </button>
            `;
        } else if (i === currentFilters.page - 2 || i === currentFilters.page + 2) {
            html += '<span class="px-2">...</span>';
        }
    }
    
    html += `
        <button onclick="changePage(${currentFilters.page + 1})" 
                ${currentFilters.page === totalPages ? 'disabled' : ''}
                class="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="material-icons">chevron_right</span>
        </button>
    `;
    
    document.getElementById('pagination').innerHTML = html;
}

// Filter functions
function filterByCategory(category) {
    currentFilters.categoria = category;
    currentFilters.page = 1;
    applyFilters();
}

function toggleBrandFilter(brand) {
    const index = currentFilters.marcas.indexOf(brand);
    if (index > -1) {
        currentFilters.marcas.splice(index, 1);
    } else {
        currentFilters.marcas.push(brand);
    }
}

function updatePriceLabel() {
    const value = document.getElementById('priceRange').value;
    document.getElementById('priceLabel').textContent = `$${parseInt(value).toLocaleString()}`;
}

function clearFilters() {
    currentFilters = {
        categoria: null,
        marcas: [],
        precioMax: 10000,
        enStock: false,
        busqueda: '',
        page: 1,
        pageSize: 12,
        ordenar: 'newest'
    };
    
    // Reset UI
    document.querySelectorAll('input[name="category"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[type="checkbox"]').forEach(input => input.checked = false);
    document.getElementById('priceRange').value = 10000;
    document.getElementById('priceLabel').textContent = '$10,000';
    document.getElementById('sortBy').value = 'newest';
    
    loadProducts();
}

function applyFilters() {
    currentFilters.precioMax = parseInt(document.getElementById('priceRange').value);
    currentFilters.enStock = document.getElementById('inStockOnly').checked;
    currentFilters.ordenar = document.getElementById('sortBy').value;
    currentFilters.page = 1;
    
    loadProducts();
}

function sortProducts() {
    switch (currentFilters.ordenar) {
        case 'price_asc':
            allProducts.sort((a, b) => (a.precioPromocional || a.precioBase) - (b.precioPromocional || b.precioBase));
            break;
        case 'price_desc':
            allProducts.sort((a, b) => (b.precioPromocional || b.precioBase) - (a.precioPromocional || a.precioBase));
            break;
        case 'name':
            allProducts.sort((a, b) => a.nombreProducto.localeCompare(b.nombreProducto));
            break;
        default: // newest
            allProducts.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
    }
}

function changePage(page) {
    currentFilters.page = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadProducts();
}

// Wishlist functions
async function toggleWishlist(productId, button) {
    if (!Auth.isAuthenticated()) {
        window.location.href = '/pages/login.html?redirect=' + encodeURIComponent(window.location.pathname);
        return;
    }
    
    const icon = button.querySelector('.material-icons');
    const isInWishlist = wishlistItems.has(productId);
    
    try {
        if (isInWishlist) {
            const response = await API.wishlist.removeItem(productId);
            if (response.success) {
                wishlistItems.delete(productId);
                icon.textContent = 'favorite_border';
                icon.classList.remove('text-red-500');
                icon.classList.add('text-gray-400');
                ErrorHandler.showToast('Eliminado de favoritos', 'success');
            }
        } else {
            const response = await API.wishlist.addItem(productId);
            if (response.success) {
                wishlistItems.add(productId);
                icon.textContent = 'favorite';
                icon.classList.remove('text-gray-400');
                icon.classList.add('text-red-500');
                ErrorHandler.showToast('Agregado a favoritos', 'success');
            }
        }
    } catch (error) {
        ErrorHandler.showToast('Error al actualizar favoritos', 'error');
    }
}

// Add to cart
async function addToCart(productId) {
    if (!Auth.isAuthenticated()) {
        window.location.href = '/pages/login.html?redirect=' + encodeURIComponent(window.location.pathname);
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

// Initialize
initCatalogPage();