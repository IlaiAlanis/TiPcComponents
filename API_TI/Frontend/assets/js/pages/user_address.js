let userData = null;
let addresses = [];
let editingAddressId = null;

async function initAddressesPage() {
    if (!Auth.requireAuth()) return;

    document.getElementById('navbar').innerHTML = Components.navbar();
    document.getElementById('footer').innerHTML = Components.footer();
    document.getElementById('mobileMenu').outerHTML = `<div id="mobileMenu">${Components.mobileMenu()}</div>`;

    Components.updateCartBadge();
    await loadUserData();
    await loadAddresses();

    document.getElementById('addressForm').addEventListener('submit', handleAddressSubmit);
}

async function loadUserData() {
    const response = await API.users.getProfile();
    if (response.success && response.data) {
        userData = response.data;
        const fullName = `${userData.nombre} ${userData.apellido || ''}`.trim();
        document.getElementById('userName').textContent = fullName;
        document.getElementById('userEmail').textContent = userData.email;
        const avatarUrl = userData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=007BFF&color=fff`;
        document.getElementById('userAvatar').src = avatarUrl;
    }
}

async function loadAddresses() {
    const container = document.getElementById('addressesContainer');
    container.innerHTML = '<div class="col-span-2 text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>';

    const response = await API.addresses.getAll();

    if (response.success && response.data) {
        addresses = response.data;
        if (addresses.length === 0) {
            container.innerHTML = `
                <div class="col-span-2 text-center py-12">
                    <span class="material-symbols-outlined text-6xl text-gray-400 mb-4">location_off</span>
                    <p class="text-gray-500 dark:text-gray-400 mb-4">No tienes direcciones guardadas</p>
                    <button onclick="openAddressModal()" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
                        Agregar Dirección
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = addresses.map(addr => createAddressCard(addr)).join('');
        }
    } else {
        container.innerHTML = '<div class="col-span-2 text-center py-12 text-red-500">Error al cargar direcciones</div>';
    }
}

function createAddressCard(address) {
    return `
        <div class="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border ${address.esPrincipal ? 'border-primary' : 'border-border-light dark:border-border-dark'}">
            ${address.esPrincipal ? '<span class="inline-block bg-primary text-white text-xs font-bold px-2 py-1 rounded mb-3">Principal</span>' : ''}
            <h3 class="font-semibold text-lg mb-2">${address.nombre}</h3>
            <p class="text-sm text-muted-light dark:text-muted-dark mb-1">${address.calle}</p>
            <p class="text-sm text-muted-light dark:text-muted-dark mb-1">${address.ciudad}, ${address.estado} ${address.codigoPostal}</p>
            <p class="text-sm text-muted-light dark:text-muted-dark mb-4">Tel: ${address.telefono}</p>
            <div class="flex gap-2">
                <button onclick="editAddress(${address.idDireccion})" class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-medium">
                    Editar
                </button>
                ${!address.esPrincipal ? `
                    <button onclick="setDefault(${address.idDireccion})" class="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium">
                        Predeterminada
                    </button>
                ` : ''}
                <button onclick="deleteAddress(${address.idDireccion})" class="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        </div>
    `;
}

function openAddressModal(address = null) {
    editingAddressId = address?.idDireccion || null;
    document.getElementById('modalTitle').textContent = address ? 'Editar Dirección' : 'Nueva Dirección';
    
    const form = document.getElementById('addressForm');
    if (address) {
        form.nombre.value = address.nombre;
        form.telefono.value = address.telefono;
        form.calle.value = address.calle;
        form.ciudad.value = address.ciudad;
        form.estado.value = address.estado;
        form.codigoPostal.value = address.codigoPostal;
        form.esPrincipal.checked = address.esPrincipal;
    } else {
        form.reset();
    }
    
    document.getElementById('addressModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeAddressModal() {
    document.getElementById('addressModal').classList.add('hidden');
    document.body.style.overflow = '';
    editingAddressId = null;
}

async function handleAddressSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        nombre: formData.get('nombre'),
        telefono: formData.get('telefono'),
        calle: formData.get('calle'),
        ciudad: formData.get('ciudad'),
        estado: formData.get('estado'),
        codigoPostal: formData.get('codigoPostal'),
        esPrincipal: formData.get('esPrincipal') === 'on'
    };

    const btn = document.getElementById('saveAddressBtn');
    ErrorHandler.setLoading(btn, true);

    const response = editingAddressId 
        ? await API.addresses.update(editingAddressId, data)
        : await API.addresses.create(data);

    ErrorHandler.setLoading(btn, false);

    if (response.success) {
        ErrorHandler.showToast(editingAddressId ? 'Dirección actualizada' : 'Dirección agregada', 'success');
        closeAddressModal();
        await loadAddresses();
    } else {
        ErrorHandler.handleApiError(response);
    }
}

function editAddress(id) {
    const address = addresses.find(a => a.idDireccion === id);
    if (address) openAddressModal(address);
}

async function setDefault(id) {
    const response = await API.addresses.setDefault(id);
    if (response.success) {
        ErrorHandler.showToast('Dirección predeterminada actualizada', 'success');
        await loadAddresses();
    } else {
        ErrorHandler.handleApiError(response);
    }
}

async function deleteAddress(id) {
    if (!confirm('¿Eliminar esta dirección?')) return;
    
    const response = await API.addresses.delete(id);
    if (response.success) {
        ErrorHandler.showToast('Dirección eliminada', 'info');
        await loadAddresses();
    } else {
        ErrorHandler.handleApiError(response);
    }
}

function openMobileProfileMenu() {
    const modal = document.getElementById('mobileProfileModal');
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
                    ${menuItems.map(item => `
                        <a href="${item.href}" class="flex items-center space-x-3 px-4 py-2.5 rounded-md ${window.location.pathname.includes(item.href.split('/').pop().split('.')[0]) ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-muted-light dark:text-muted-dark'} text-sm font-medium">
                            <span class="material-symbols-outlined text-base">${item.icon}</span>
                            <span>${item.label}</span>
                        </a>
                    `).join('')}
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

initAddressesPage();