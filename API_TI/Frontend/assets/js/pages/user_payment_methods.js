let userData = null;
let paymentMethods = [];
let editingPaymentId = null;

async function initPaymentMethodsPage() {
    if (!Auth.requireAuth()) return;

    document.getElementById('navbar').innerHTML = Components.navbar();
    document.getElementById('footer').innerHTML = Components.footer();
    document.getElementById('mobileMenu').outerHTML = `<div id="mobileMenu">${Components.mobileMenu()}</div>`;

    Components.updateCartBadge();
    await loadUserData();
    await loadPaymentMethods();

    document.getElementById('paymentForm').addEventListener('submit', handlePaymentSubmit);
    
    // Format card number input
    document.querySelector('[name="numeroTarjeta"]').addEventListener('input', formatCardNumber);
    document.querySelector('[name="fechaVencimiento"]').addEventListener('input', formatExpiry);
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

async function loadPaymentMethods() {
    const container = document.getElementById('paymentsContainer');
    container.innerHTML = '<div class="col-span-2 text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>';

    const response = await API.paymentMethods.getAll();

    if (response.success && response.data) {
        paymentMethods = response.data;
        if (paymentMethods.length === 0) {
            container.innerHTML = `
                <div class="col-span-2 text-center py-12">
                    <span class="material-symbols-outlined text-6xl text-gray-400 mb-4">credit_card_off</span>
                    <p class="text-gray-500 dark:text-gray-400 mb-4">No tienes métodos de pago guardados</p>
                    <button onclick="openPaymentModal()" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
                        Agregar Tarjeta
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = paymentMethods.map(pm => createPaymentCard(pm)).join('');
        }
    } else {
        container.innerHTML = '<div class="col-span-2 text-center py-12 text-red-500">Error al cargar métodos de pago</div>';
    }
}

function createPaymentCard(payment) {
    const cardType = getCardType(payment.numeroTarjeta);
    const maskedNumber = `•••• •••• •••• ${payment.numeroTarjeta.slice(-4)}`;
    
    return `
        <div class="bg-gradient-to-br from-primary to-blue-600 p-6 rounded-xl text-white relative overflow-hidden">
            ${payment.esPrincipal ? '<span class="absolute top-4 right-4 bg-white text-primary text-xs font-bold px-2 py-1 rounded">Principal</span>' : ''}
            <div class="mb-8">
                <span class="material-symbols-outlined text-3xl">${cardType === 'visa' ? 'credit_card' : 'payment'}</span>
            </div>
            <div class="mb-4">
                <p class="text-xl font-mono tracking-wider">${maskedNumber}</p>
            </div>
            <div class="flex justify-between items-end">
                <div>
                    <p class="text-xs opacity-70 mb-1">Titular</p>
                    <p class="font-medium">${payment.titular}</p>
                </div>
                <div class="text-right">
                    <p class="text-xs opacity-70 mb-1">Vence</p>
                    <p class="font-medium">${payment.fechaVencimiento}</p>
                </div>
            </div>
            <div class="flex gap-2 mt-4">
                <button onclick="editPayment(${payment.idMetodoPago})" class="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium backdrop-blur">
                    Editar
                </button>
                ${!payment.esPrincipal ? `
                    <button onclick="setDefault(${payment.idMetodoPago})" class="px-4 py-2 bg-white text-primary hover:bg-gray-100 rounded-lg text-sm font-medium">
                        Predeterminada
                    </button>
                ` : ''}
                <button onclick="deletePayment(${payment.idMetodoPago})" class="px-4 py-2 bg-red-500/80 hover:bg-red-600 rounded-lg">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        </div>
    `;
}

function getCardType(number) {
    const firstDigit = number.charAt(0);
    if (firstDigit === '4') return 'visa';
    if (firstDigit === '5') return 'mastercard';
    return 'card';
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formatted;
}

function formatExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
}

function openPaymentModal(payment = null) {
    editingPaymentId = payment?.idMetodoPago || null;
    document.getElementById('modalTitle').textContent = payment ? 'Editar Tarjeta' : 'Nueva Tarjeta';
    
    const form = document.getElementById('paymentForm');
    if (payment) {
        form.numeroTarjeta.value = payment.numeroTarjeta;
        form.titular.value = payment.titular;
        form.fechaVencimiento.value = payment.fechaVencimiento;
        form.esPrincipal.checked = payment.esPrincipal;
        form.cvv.value = '';
    } else {
        form.reset();
    }
    
    document.getElementById('paymentModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.add('hidden');
    document.body.style.overflow = '';
    editingPaymentId = null;
}

async function handlePaymentSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        numeroTarjeta: formData.get('numeroTarjeta').replace(/\s/g, ''),
        titular: formData.get('titular'),
        fechaVencimiento: formData.get('fechaVencimiento'),
        cvv: formData.get('cvv'),
        esPrincipal: formData.get('esPrincipal') === 'on'
    };

    const btn = document.getElementById('savePaymentBtn');
    ErrorHandler.setLoading(btn, true);

    const response = editingPaymentId 
        ? await API.paymentMethods.update(editingPaymentId, data)
        : await API.paymentMethods.create(data);

    ErrorHandler.setLoading(btn, false);

    if (response.success) {
        ErrorHandler.showToast(editingPaymentId ? 'Tarjeta actualizada' : 'Tarjeta agregada', 'success');
        closePaymentModal();
        await loadPaymentMethods();
    } else {
        ErrorHandler.handleApiError(response);
    }
}

function editPayment(id) {
    const payment = paymentMethods.find(p => p.idMetodoPago === id);
    if (payment) openPaymentModal(payment);
}

async function setDefault(id) {
    const response = await API.paymentMethods.setDefault(id);
    if (response.success) {
        ErrorHandler.showToast('Método de pago predeterminado actualizado', 'success');
        await loadPaymentMethods();
    } else {
        ErrorHandler.handleApiError(response);
    }
}

async function deletePayment(id) {
    if (!confirm('¿Eliminar esta tarjeta?')) return;
    
    const response = await API.paymentMethods.delete(id);
    if (response.success) {
        ErrorHandler.showToast('Tarjeta eliminada', 'info');
        await loadPaymentMethods();
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
                <button onclick="closeMobileProfileMenu()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg"><span class="material-symbols-outlined">close</span></button>
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
                            <span class="material-symbols-outlined text-base">${item.icon}</span><span>${item.label}</span>
                        </a>
                    `).join('')}
                </nav>
                <div class="border-t border-border-light dark:border-border-dark mt-6 pt-4">
                    <button onclick="logout()" class="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-danger text-sm font-medium w-full">
                        <span class="material-symbols-outlined text-base">logout</span><span>Cerrar Sesión</span>
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

initPaymentMethodsPage();