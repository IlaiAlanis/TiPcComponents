// Load featured products
async function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    container.innerHTML = createLoadingSpinner();
    
    try {
        const response = await API.products.getAll();
        
        if (response.success && response.data.length > 0) {
            container.innerHTML = response.data
                .slice(0, 4)
                .map(product => Components.productCard(product))
                .join('');
        } else {
            container.innerHTML = createEmptyState('No hay productos destacados disponibles');
        }
    } catch (error) {
        container.innerHTML = createErrorState('Error cargando productos destacados');
    }
}

// Load special offers
async function loadSpecialOffers() {
    const container = document.getElementById('specialOffers');
    container.innerHTML = createLoadingSpinner();
    
    try {
        const response = await API.products.search({ 
            page: 1, 
            pageSize: 4,
            precioMax: 500 
        });
        
        if (response.success && response.data.items.length > 0) {
            container.innerHTML = response.data.items
                .map(product => Components.productCard(product))
                .join('');
        } else {
            container.innerHTML = createEmptyState('No hay ofertas especiales disponibles');
        }
    } catch (error) {
        container.innerHTML = createErrorState('Error cargando ofertas');
    }
}

// Add to cart
async function addToCart(productId) {
    if (!Auth.isAuthenticated()) {
        window.location.href = '/pages/login.html';
        return;
    }
    
    const response = await API.cart.addItem({ productoId: productId, cantidad: 1 });
    
    if (response.success) {
        showToast('Producto agregado al carrito', 'success');
        Components.updateCartBadge();
    } else {
        showToast(response.error?.message || 'Error al agregar al carrito', 'error');
    }
}

// Toggle wishlist
async function toggleWishlist(productId) {
    if (!Auth.isAuthenticated()) {
        window.location.href = '/pages/login.html';
        return;
    }
    
    const response = await API.wishlist.addItem(productId);
    
    if (response.success) {
        showToast('Agregado a favoritos', 'success');
    } else {
        showToast(response.error?.message || 'Error', 'error');
    }
}

// Initialize page
function initHomePage() {
    // Render components
    document.getElementById('navbar').innerHTML = Components.navbar();
    document.getElementById('footer').innerHTML = Components.footer();
    

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        window.location.href = '../../pages/404.html';
        return;
    }

    // Render mobile menu (using outerHTML to replace the entire div)
    const mobileMenuContainer = document.getElementById('mobileMenu');
    mobileMenuContainer.outerHTML = `<div id="mobileMenu">${Components.mobileMenu()}</div>`;
    
    // Update cart badge
    Components.updateCartBadge();
    
    // Load products
    loadFeaturedProducts();
    loadSpecialOffers();
}

// Run on page load
initHomePage();