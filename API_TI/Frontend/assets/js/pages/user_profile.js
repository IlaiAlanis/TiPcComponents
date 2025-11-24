let userData = null;

async function initProfilePage() {
    if (!Auth.requireAuth()) return;

    document.getElementById('navbar').innerHTML = Components.navbar();
    document.getElementById('footer').innerHTML = Components.footer();
    document.getElementById('mobileMenu').outerHTML = `<div id="mobileMenu">${Components.mobileMenu()}</div>`;

    Components.updateCartBadge();
    await loadUserData();
}

async function loadUserData() {
    const response = await API.users.getProfile();
    
    if (response.success && response.data) {
        userData = response.data;
        populateForm();
    } else {
        ErrorHandler.showToast('Error al cargar perfil', 'error');
    }
}

function populateForm() {
    const fullName = `${userData.nombre} ${userData.apellido || ''}`.trim();
    document.getElementById('userName').textContent = fullName;
    document.getElementById('userEmail').textContent = userData.email;
    
    const avatarUrl = userData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=007BFF&color=fff`;
    document.getElementById('userAvatar').src = avatarUrl;

    document.getElementById('first-name').value = userData.nombre || '';
    document.getElementById('last-name').value = userData.apellido || '';
    document.getElementById('email').value = userData.email || '';
}

async function saveProfile() {
    const profileForm = document.getElementById('profileForm');
    const passwordForm = document.getElementById('passwordForm');

    const btn = document.getElementById('saveBtn');
    ErrorHandler.setLoading(btn, true);

    const updateData = {
        nombre: document.getElementById('first-name').value,
        apellido: document.getElementById('last-name').value,
        email: document.getElementById('email').value
    };

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;

    if (newPassword) {
        if (!currentPassword) {
            ErrorHandler.showToast('Ingresa tu contraseña actual', 'error');
            ErrorHandler.setLoading(btn, false);
            return;
        }
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
    }

    const response = await API.users.updateProfile(updateData);

    ErrorHandler.setLoading(btn, false);

    if (response.success) {
        ErrorHandler.showToast('Perfil actualizado correctamente', 'success');
        passwordForm.reset();
        await loadUserData();
    } else {
        ErrorHandler.handleApiError(response);
    }
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

initProfilePage();