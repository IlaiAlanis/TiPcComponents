let userData = null;
let notifications = [];

async function initNotificationsPage() {
    if (!Auth.requireAuth()) return;

    document.getElementById('navbar').innerHTML = Components.navbar();
    document.getElementById('footer').innerHTML = Components.footer();
    document.getElementById('mobileMenu').outerHTML = `<div id="mobileMenu">${Components.mobileMenu()}</div>`;

    Components.updateCartBadge();
    await loadUserData();
    await loadNotifications();
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

async function loadNotifications() {
    const container = document.getElementById('notificationsContainer');
    container.innerHTML = '<div class="text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>';

    const response = await API.notifications.getAll();

    if (response.success && response.data) {
        notifications = response.data;
        if (notifications.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <span class="material-symbols-outlined text-6xl text-gray-400 mb-4">notifications_off</span>
                    <p class="text-gray-500 dark:text-gray-400">No tienes notificaciones</p>
                </div>
            `;
        } else {
            container.innerHTML = notifications.map(notif => createNotificationItem(notif)).join('');
        }
    } else {
        container.innerHTML = '<div class="text-center py-12 text-red-500">Error al cargar notificaciones</div>';
    }
}

function createNotificationItem(notification) {
    const isUnread = !notification.leida;
    return `
        <div class="flex items-start gap-4 p-4 rounded-lg ${isUnread ? 'bg-primary/10' : ''}">
            <div class="w-1.5 h-1.5 rounded-full ${isUnread ? 'bg-primary' : 'bg-transparent'} mt-2 flex-shrink-0"></div>
            <div class="flex-1">
                <p class="${isUnread ? 'text-gray-900 dark:text-white' : 'text-muted-light dark:text-muted-dark'}">${notification.mensaje}</p>
                <p class="text-muted-light dark:text-muted-dark text-sm mt-1">${formatTimeAgo(notification.fechaCreacion)}</p>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="toggleRead(${notification.idNotificacion}, ${isUnread})" class="text-muted-light dark:text-muted-dark hover:text-gray-900 dark:hover:text-white transition-colors">
                    <span class="material-symbols-outlined text-base">${isUnread ? 'drafts' : 'mark_email_read'}</span>
                </button>
                <button onclick="deleteNotification(${notification.idNotificacion})" class="text-muted-light dark:text-muted-dark hover:text-red-500 transition-colors">
                    <span class="material-symbols-outlined text-base">delete</span>
                </button>
            </div>
        </div>
    `;
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-ES');
}

async function toggleRead(id, isUnread) {
    const response = isUnread ? await API.notifications.markAsRead(id) : await API.notifications.markAsUnread(id);
    if (response.success) {
        await loadNotifications();
    } else {
        ErrorHandler.handleApiError(response);
    }
}

async function deleteNotification(id) {
    if (!confirm('¿Eliminar esta notificación?')) return;
    const response = await API.notifications.delete(id);
    if (response.success) {
        ErrorHandler.showToast('Notificación eliminada', 'info');
        await loadNotifications();
    } else {
        ErrorHandler.handleApiError(response);
    }
}

function openSettings() {
    ErrorHandler.showToast('Configuración de notificaciones próximamente', 'info');
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
                            <a href="${item.href}" class="flex items-center space-x-3 px-4 py-2.5 rounded-md ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-muted-light dark:text-muted-dark hover:text-gray-900 dark:hover:text-white'} text-sm font-medium">
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
    modal.addEventListener('click', (e) => { if (e.target === modal) closeMobileProfileMenu(); });
}

function closeMobileProfileMenu() {
    document.getElementById('mobileProfileModal').classList.add('hidden');
    document.body.style.overflow = '';
}

function logout() {
    if (confirm('¿Estás seguro de cerrar sesión?')) Auth.logout();
}

// Auto-close mobile menu on resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        closeMobileProfileMenu();
    }
});

initNotificationsPage();