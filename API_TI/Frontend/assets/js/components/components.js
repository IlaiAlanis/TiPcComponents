const Components = {
    // NAVBAR
    navbar() {
        const user = Auth.getUser();
        const isAuth = Auth.isAuthenticated();
        
        return `
            <header class="bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
                <nav class="container mx-auto px-4 lg:px-8 py-4">
                    <div class="flex justify-between items-center">
                        <!-- Logo & Search -->
                        <div class="flex items-center gap-8">
                            <a class="flex items-center gap-2" href="/pages/index.html">
                                <span class="material-icons text-primary text-3xl">desktop_windows</span>
                                <span class="text-xl font-bold text-gray-900 dark:text-white">PC Components</span>
                            </a>
                            <div class="hidden lg:flex relative w-80">
                                <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">search</span>
                                <input class="w-full bg-gray-200 dark:bg-gray-800 border-transparent focus:border-primary focus:ring-primary rounded-lg pl-10 pr-4 py-2 text-sm" 
                                       placeholder="Buscar productos..." 
                                       type="text" 
                                       id="globalSearch" 
                                       onkeypress="if(event.key==='Enter' && this.value.trim()) window.location.href='/pages/catalog.html?q='+encodeURIComponent(this.value)"/>
                            </div>
                        </div>
                        
                        <!-- Desktop Menu -->
                        <div class="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                            <a class="hover:text-primary transition-colors" href="/pages/catalog.html?category=cpu">CPUs</a>
                            <a class="hover:text-primary transition-colors" href="/pages/catalog.html?category=gpu">GPUs</a>
                            <a class="hover:text-primary transition-colors" href="/pages/catalog.html?category=motherboard">Placas Madre</a>
                            <a class="hover:text-primary transition-colors" href="/pages/catalog.html?category=storage">Almacenamiento</a>
                            <a class="hover:text-primary transition-colors" href="/pages/catalog.html?category=ram">RAM</a>
                            <a class="hover:text-primary transition-colors" href="/pages/faq.html">FAQ</a>
                            
                            <!-- Cart -->
                            <a class="relative hover:text-primary transition-colors" href="/pages/cart.html">
                                <span class="material-icons">shopping_cart</span>
                                <span id="cartBadge" class="hidden absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"></span>
                            </a>
                            
                            <!-- User Menu -->
                            ${isAuth ? this.userDropdown(user) : this.loginButton()}
                        </div>
                        
                        <!-- Mobile Menu Button -->
                        <button onclick="toggleMobileMenu()" class="lg:hidden text-gray-700 dark:text-gray-300">
                            <span class="material-icons">menu</span>
                        </button>
                    </div>
                </nav>
            </header>
        `;
    },

    // User Dropdown (for navbar)
    userDropdown(user) {
        return `
            <div class="relative group">
                <button class="flex items-center gap-2 hover:text-primary transition-colors">
                    <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <span class="text-white font-bold text-lg">${user.nombreUsuario.charAt(0).toUpperCase()}</span>
                    </div>
                </button>
                <div class="absolute right-0 mt-2 w-56 bg-surface-dark border border-border-dark rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div class="px-4 py-3 border-b border-border-dark">
                        <p class="font-semibold">${user.nombreUsuario}</p>
                        <p class="text-sm text-muted-dark">${user.correo}</p>
                    </div>
                    <a href="/pages/profile.html" class="block px-4 py-3 hover:bg-background-dark transition-colors">
                        <div class="flex items-center gap-3">
                            <span class="material-icons text-primary">person</span>
                            <span>Mi Perfil</span>
                        </div>
                    </a>
                    <a href="/pages/orders.html" class="block px-4 py-3 hover:bg-background-dark transition-colors">
                        <div class="flex items-center gap-3">
                            <span class="material-icons text-primary">receipt_long</span>
                            <span>Mis Pedidos</span>
                        </div>
                    </a>
                    <a href="/pages/wishlist.html" class="block px-4 py-3 hover:bg-background-dark transition-colors">
                        <div class="flex items-center gap-3">
                            <span class="material-icons text-primary">favorite</span>
                            <span>Lista de Deseos</span>
                        </div>
                    </a>
                    <a href="/pages/notifications.html" class="block px-4 py-3 hover:bg-background-dark transition-colors">
                        <div class="flex items-center gap-3">
                            <span class="material-icons text-primary">notifications</span>
                            <span>Notificaciones</span>
                        </div>
                    </a>
                    ${user.rol === 'ADMIN' ? `
                        <div class="border-t border-border-dark"></div>
                        <a href="/pages/admin/dashboard.html" class="block px-4 py-3 hover:bg-background-dark transition-colors">
                            <div class="flex items-center gap-3">
                                <span class="material-icons text-primary">dashboard</span>
                                <span>Panel Admin</span>
                            </div>
                        </a>
                    ` : ''}
                    <div class="border-t border-border-dark"></div>
                    <button onclick="Auth.logout()" class="w-full text-left px-4 py-3 hover:bg-background-dark transition-colors text-danger">
                        <div class="flex items-center gap-3">
                            <span class="material-icons">logout</span>
                            <span>Cerrar Sesión</span>
                        </div>
                    </button>
                </div>
            </div>
        `;
    },

    // Login Button (for navbar)
    loginButton() {
        return `
            <a href="/pages/login.html" class="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                <span class="material-icons text-base">person</span>
                <span>Join/Login</span>
            </a>
        `;
    },

    // FOOTER
    footer() {
        return `
            <footer class="bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
                <div class="container mx-auto px-4 lg:px-8 py-12">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">PC Components</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Tu tienda de confianza para los mejores componentes de PC. Potencia, rendimiento y calidad al mejor precio.</p>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Enlaces Rápidos</h3>
                            <ul class="space-y-2 text-sm">
                                <li><a class="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" href="/pages/about.html">Quiénes Somos</a></li>
                                <li><a class="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" href="/pages/faq.html">Preguntas Frecuentes</a></li>
                                <li><a class="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" href="#">Términos y Condiciones</a></li>
                                <li><a class="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" href="#">Política de Envíos</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contacto</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Email: contacto@pccomponents.com</p>
                            <div class="flex gap-4 mt-4">
                                <a class="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors" href="#"><svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg></a>
                                <a class="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors" href="#"><svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.242 2.766 7.828 6.539 9.01.478.088.653-.207.653-.46 0-.226-.009-.824-.014-1.618-2.685.584-3.25-1.296-3.25-1.296-.434-1.103-1.06-1.396-1.06-1.396-.867-.593.065-.58.065-.58.958.067 1.462 1.004 1.462 1.004.851 1.46.223 1.037 2.775.793.087-.616.333-1.037.608-1.275-2.119-.24-4.347-1.06-4.347-4.714 0-1.04.37-1.892 1.003-2.558-.1-.242-.435-1.21.096-2.522 0 0 .79-.256 2.625.975A9.15 9.15 0 0112 6.848c.81.003 1.62.11 2.378.325 1.83-1.23 2.62-.975 2.62-.975.534 1.312.198 2.28.098 2.522.635.666 1.003 1.518 1.003 2.558 0 3.664-2.23 4.47-4.357 4.704.342.295.65.878.65 1.77 0 1.275-.012 2.302-.012 2.613 0 .256.173.553.657.459A10.025 10.025 0 0022 12c0-5.523-4.477-10-10-10z" fill-rule="evenodd"/></svg></a>
                            </div>
                        </div>
                    </div>
                    <div class="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>© 2025 PC Components. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        `;
    },

    // MOBILE MENU
    mobileMenu() {
        return `
            <div class="fixed inset-0 bg-black/50 z-50 hidden" onclick="closeMobileMenu()">
                <div class="fixed right-0 top-0 h-full w-64 bg-surface-dark shadow-xl" onclick="event.stopPropagation()">
                    <div class="p-6">
                        <button onclick="closeMobileMenu()" class="text-white mb-8">
                            <span class="material-icons">close</span>
                        </button>
                        <nav class="space-y-4">
                            <a href="/pages/catalog.html?category=cpu" class="block text-white hover:text-primary py-2">CPUs</a>
                            <a href="/pages/catalog.html?category=gpu" class="block text-white hover:text-primary py-2">GPUs</a>
                            <a href="/pages/catalog.html?category=motherboard" class="block text-white hover:text-primary py-2">Placas Madre</a>
                            <a href="/pages/catalog.html?category=storage" class="block text-white hover:text-primary py-2">Almacenamiento</a>
                            <a href="/pages/catalog.html?category=ram" class="block text-white hover:text-primary py-2">RAM</a>
                            <a href="/pages/faq.html" class="block text-white hover:text-primary py-2">FAQ</a>
                        </nav>
                    </div>
                </div>
            </div>
        `;
    },

    // PRODUCT CARD
    productCard(product) {
        const price = product.precioPromocional || product.precioBase;
        const hasDiscount = product.precioPromocional && product.precioPromocional < product.precioBase;
        const imageUrl = product.imagenUrl || 'https://via.placeholder.com/400x300?text=PC+Component';
        
        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                <div class="relative">
                    <img alt="${product.nombreProducto}" 
                         class="w-full h-48 object-cover cursor-pointer" 
                         src="${imageUrl}" 
                         onclick="window.location.href='/pages/product.html?id=${product.idProducto}'">
                    ${hasDiscount ? '<span class="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">OFERTA</span>' : ''}
                    <button onclick="event.stopPropagation(); toggleWishlist(${product.idProducto})" 
                            class="absolute top-3 right-3 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/40 transition-colors">
                        <span class="material-icons text-xl">favorite_border</span>
                    </button>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-primary" 
                        onclick="window.location.href='/pages/product.html?id=${product.idProducto}'">${product.nombreProducto}</h3>
                    <div class="flex justify-between items-center mt-4">
                        ${hasDiscount ? `
                            <div>
                                <p class="text-gray-500 line-through text-sm">$${product.precioBase.toFixed(2)}</p>
                                <p class="text-primary font-bold text-lg">$${price.toFixed(2)}</p>
                            </div>
                        ` : `
                            <p class="text-primary font-bold text-lg">$${price.toFixed(2)}</p>
                        `}
                        <button onclick="event.stopPropagation(); addToCart(${product.idProducto})" 
                                class="text-primary hover:text-blue-600">
                            <span class="material-icons">shopping_cart</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Update cart badge
    async updateCartBadge() {
        if (Auth.isAuthenticated()) {
            const response = await API.cart.get();
            if (response.success) {
                const badge = document.getElementById('cartBadge');
                const count = response.data.totalItems || 0;
                if (badge) {
                    badge.textContent = count;
                    badge.classList.toggle('hidden', count === 0);
                }
            }
        }
    }

    
};

Components.updateCartBadge = async function() {
    if (!Auth.isAuthenticated()) {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            badge.classList.add('hidden');
        }
        return;
    }

    try {
        const response = await API.cart.get();
        if (response.success && response.data) {
            const badge = document.getElementById('cartBadge');
            const count = response.data.totalItems || 0;
            if (badge) {
                badge.textContent = count;
                badge.classList.toggle('hidden', count === 0);
            }
        }
    } catch (error) {
        console.error('Failed to update cart badge:', error);
    }
};

// Initialize cart badge on page load
document.addEventListener('DOMContentLoaded', () => {
    Components.updateCartBadge();
});