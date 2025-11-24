let userData = null;
let orders = [];

async function initOrdersPage() {
    if (!Auth.requireAuth()) return;

    document.getElementById('navbar').innerHTML = Components.navbar();
    document.getElementById('footer').innerHTML = Components.footer();
    document.getElementById('mobileMenu').outerHTML = `<div id="mobileMenu">${Components.mobileMenu()}</div>`;

    Components.updateCartBadge();
    await loadUserData();
    await loadOrders();
}

async function loadUserData() {
    const response = await API.users.getProfile();
    
    if (response.success && response.data) {
        userData = response.data;
        populateUserInfo();
    }
}

function populateUserInfo() {
    const fullName = `${userData.nombre} ${userData.apellido || ''}`.trim();
    document.getElementById('userName').textContent = fullName;
    document.getElementById('userEmail').textContent = userData.email;
    
    const avatarUrl = userData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=007BFF&color=fff`;
    document.getElementById('userAvatar').src = avatarUrl;
}

async function loadOrders() {
    const container = document.getElementById('ordersContainer');
    container.innerHTML = '<div class="text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>';

    const response = await API.orders.getAll();

    if (response.success && response.data) {
        orders = response.data;
        if (orders.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <span class="material-symbols-outlined text-6xl text-gray-400 mb-4">shopping_bag</span>
                    <p class="text-gray-500 dark:text-gray-400">No tienes pedidos aún</p>
                </div>
            `;
        } else {
            container.innerHTML = orders.map((order, index) => createOrderCard(order, index)).join('');
        }
    } else {
        container.innerHTML = '<div class="text-center py-12 text-red-500">Error al cargar pedidos</div>';
    }
}

function createOrderCard(order, index) {
    const statusColors = {
        'entregado': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'enviado': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'procesando': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
    };

    const isExpanded = index === 0;
    
    return `
        <div class="bg-surface-light dark:bg-surface-dark rounded-lg ${isExpanded ? 'border border-primary/50' : ''}">
            <div class="p-6 flex items-center justify-between cursor-pointer" onclick="toggleOrder(${index})">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full items-center pr-4">
                    <div>
                        <p class="text-xs text-muted-light dark:text-muted-dark">Fecha</p>
                        <p class="font-medium">${formatDate(order.fechaPedido)}</p>
                    </div>
                    <div>
                        <p class="text-xs text-muted-light dark:text-muted-dark">Nº Pedido</p>
                        <p class="font-medium">#${order.idOrden}</p>
                    </div>
                    <div>
                        <p class="text-xs text-muted-light dark:text-muted-dark">Total</p>
                        <p class="font-medium">$${order.total.toFixed(2)}</p>
                    </div>
                    <div class="justify-self-start sm:justify-self-end">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.estado] || statusColors.procesando}">
                            ${order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
                        </span>
                    </div>
                </div>
                <span class="material-symbols-outlined text-muted-light dark:text-muted-dark transform ${isExpanded ? 'rotate-180' : ''}" id="arrow-${index}">expand_more</span>
            </div>
            <div id="details-${index}" class="px-6 pb-6 border-t border-border-light dark:border-border-dark ${isExpanded ? '' : 'hidden'}">
                <h3 class="text-lg font-semibold pt-6 pb-4">Detalles del Pedido #${order.idOrden}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 class="font-medium mb-3">Productos</h4>
                        <div class="space-y-3">
                            ${order.items?.map(item => `
                                <div class="flex justify-between items-center text-sm">
                                    <span>${item.nombreProducto} (x${item.cantidad})</span>
                                    <span class="font-medium">$${(item.precioUnitario * item.cantidad).toFixed(2)}</span>
                                </div>
                            `).join('') || '<p class="text-sm text-muted-light dark:text-muted-dark">Sin productos</p>'}
                        </div>
                    </div>
                    <div>
                        <h4 class="font-medium mb-3">Método de Pago</h4>
                        <p class="text-sm text-muted-light dark:text-muted-dark">${order.metodoPago || 'No especificado'}</p>
                    </div>
                    <div>
                        <h4 class="font-medium mb-3">Dirección de Envío</h4>
                        <p class="text-sm text-muted-light dark:text-muted-dark">${formatAddress(order.direccionEnvio)}</p>
                    </div>
                    <div>
                        <h4 class="font-medium mb-3">Seguimiento</h4>
                        ${order.tracking ? `<a class="text-sm text-primary font-medium hover:underline" href="#">Rastrear envío</a>` : '<p class="text-sm text-muted-light dark:text-muted-dark">No disponible</p>'}
                    </div>
                </div>
                <div class="mt-8 flex flex-col sm:flex-row gap-4">
                    <button onclick="reorder(${order.idOrden})" class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-hover">
                        <span class="material-symbols-outlined text-base">refresh</span>
                        Repetir Pedido
                    </button>
                    ${order.estado === 'entregado' ? `
                        <button onclick="returnOrder(${order.idOrden})" class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark font-medium text-sm hover:bg-background-light dark:hover:bg-background-dark">
                            <span class="material-symbols-outlined text-base">assignment_return</span>
                            Iniciar Devolución
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function toggleOrder(index) {
    const details = document.getElementById(`details-${index}`);
    const arrow = document.getElementById(`arrow-${index}`);
    
    details.classList.toggle('hidden');
    arrow.classList.toggle('rotate-180');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatAddress(address) {
    if (!address) return 'No especificada';
    return `${address.calle}, ${address.ciudad}, ${address.estado} ${address.codigoPostal}`;
}

async function reorder(orderId) {
    const order = orders.find(o => o.idOrden === orderId);
    if (!order) return;

    for (const item of order.items) {
        await API.cart.addItem({ productoId: item.productoId, cantidad: item.cantidad });
    }

    ErrorHandler.showToast('Productos agregados al carrito', 'success');
    Components.updateCartBadge();
}

function returnOrder(orderId) {
    ErrorHandler.showToast('Función de devolución próximamente', 'info');
}

function openMobileProfileMenu() {
    const modal = document.getElementById('mobileProfileModal');
    const currentPath = window.location.pathname;
    
    const menuItems = [
        { href: '/pages/profile.html', icon: 'person', label: 'Mi Perfil' },
        { href: '/pages/orders.html', icon: 'receipt_long', label: 'Mis Pedidos' },
        { href: '/pages/wishlist.html', icon: 'favorite', label: 'Mi Lista de Deseo' },
        { href: '/pages/addresses.html', icon: 'home', label: 'Direcciones' },
        { href: '/pages/payment-methods.html', icon: 'credit_card', label: 'Métodos de Pago' },
        { href: '/pages/notifications.html', icon: 'notifications', label: 'Mis Notificaciones' },
        { href: '/pages/preferences.html', icon: 'tune', label: 'Preferencias' }
    ];
    
    modal.innerHTML = `
        <div class="absolute inset-x-0 bottom-0 bg-surface-light dark:bg-surface-dark rounded-t-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
            <div class="sticky top-0 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark p-4 flex justify-between items-center">
                <h3 class="text-xl font-bold">Mi Cuenta</h3>
                <button onclick="closeMobileProfileMenu()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="p-4">
                <div class="flex items-center space-x-4 mb-6 pb-6 border-b border-border-light dark:border-border-dark">
                    <img id="modalUserAvatar" alt="Avatar" class="h-12 w-12 rounded-full object-cover"/>
                    <div>
                        <h4 id="modalUserName" class="font-semibold text-gray-900 dark:text-white"></h4>
                        <p id="modalUserEmail" class="text-sm text-muted-light dark:text-muted-dark"></p>
                    </div>
                </div>
                <nav class="space-y-2">
                    ${menuItems.map(item => {
                        const isActive = currentPath.includes(item.href.split('/').pop().split('.')[0]);
                        return `
                            <a href="${item.href}" 
                               class="flex items-center space-x-3 px-4 py-2.5 rounded-md ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-muted-light dark:text-muted-dark hover:text-gray-900 dark:hover:text-white'} text-sm font-medium">
                                <span class="material-symbols-outlined text-base">${item.icon}</span>
                                <span>${item.label}</span>
                            </a>
                        `;
                    }).join('')}
                </nav>
                <div class="border-t border-border-light dark:border-border-dark mt-6 pt-4">
                    <button onclick="logout()" class="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-danger text-sm font-medium w-full">
                        <span class="material-symbols-outlined text-base">logout</span>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    if (userData) {
        const fullName = `${userData.nombre} ${userData.apellido || ''}`.trim();
        const avatarUrl = userData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=007BFF&color=fff`;
        document.getElementById('modalUserAvatar').src = avatarUrl;
        document.getElementById('modalUserName').textContent = fullName;
        document.getElementById('modalUserEmail').textContent = userData.email;
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeMobileProfileMenu();
    });
}

function closeMobileProfileMenu() {
    const modal = document.getElementById('mobileProfileModal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function logout() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        Auth.logout();
    }
}


// Auto-close mobile menu on resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        closeMobileProfileMenu();
    }
});

initOrdersPage();