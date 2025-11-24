let order = null;

async function initConfirmationPage() {
    if (!Auth.requireAuth()) return;

    document.getElementById('navbar').innerHTML = Components.navbar();
    document.getElementById('footer').innerHTML = Components.footer();
    const mobileMenuContainer = document.getElementById('mobileMenu');
    mobileMenuContainer.outerHTML = `<div id="mobileMenu">${Components.mobileMenu()}</div>`;

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order');

    if (!orderId) {
        ErrorHandler.showToast('ID de pedido no válido', 'error');
        setTimeout(() => window.location.href = '/pages/orders.html', 2000);
        return;
    }

    await loadOrder(orderId);
}

async function loadOrder(orderId) {
    try {
        const response = await API.orders.getById(orderId);

        if (response.success && response.data) {
            order = response.data;
            renderOrder();
        } else {
            ErrorHandler.showToast('No se pudo cargar el pedido', 'error');
            setTimeout(() => window.location.href = '/pages/orders.html', 2000);
        }
    } catch (error) {
        ErrorHandler.handleNetworkError(error);
        setTimeout(() => window.location.href = '/pages/orders.html', 2000);
    }
}

function renderOrder() {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('confirmationContent').classList.remove('hidden');

    // Order Header
    document.getElementById('orderNumber').textContent = order.numeroOrden || order.idOrden;
    document.getElementById('orderDate').textContent = `Realizado el ${formatDate(order.fechaCreacion)}`;

    // Status Badge
    const statusBadge = document.getElementById('orderStatus');
    const statusConfig = getStatusConfig(order.estado);
    statusBadge.textContent = statusConfig.text;
    statusBadge.className = `px-3 py-1 rounded-full text-sm font-semibold ${statusConfig.class}`;

    // Order Items
    const itemsHtml = order.items.map(item => {
        const product = item.producto;
        const imageUrl = product.imagenUrl || 'https://via.placeholder.com/100x100?text=Producto';
        
        return `
            <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-4 flex-1">
                    <img src="${imageUrl}" alt="${product.nombreProducto}" 
                         class="w-16 h-16 object-cover rounded-lg bg-gray-100 dark:bg-gray-900"/>
                    <div class="flex-1">
                        <p class="font-semibold">${product.nombreProducto}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Cantidad: ${item.cantidad}</p>
                    </div>
                </div>
                <p class="font-semibold">$${(item.precioUnitario * item.cantidad).toFixed(2)}</p>
            </div>
        `;
    }).join('');
    document.getElementById('orderItems').innerHTML = itemsHtml;

    // Totals
    document.getElementById('subtotal').textContent = `$${order.subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = order.costoEnvio ? `$${order.costoEnvio.toFixed(2)}` : 'GRATIS';
    document.getElementById('tax').textContent = `$${order.impuestos.toFixed(2)}`;
    document.getElementById('total').textContent = `$${order.total.toFixed(2)}`;

    // Tracking
    document.getElementById('trackingNumber').textContent = order.numeroSeguimiento || 'Generando...';
    updateProgress(order.estado);

    // Addresses
    renderAddress('shippingAddress', order.direccionEnvio);
    renderAddress('billingAddress', order.direccionFacturacion);
}

function renderAddress(elementId, address) {
    if (!address) {
        document.getElementById(elementId).textContent = 'No disponible';
        return;
    }

    const html = `
        ${address.nombre || ''}<br/>
        ${address.calle || ''}<br/>
        ${address.ciudad || ''}, ${address.estado || ''} ${address.codigoPostal || ''}<br/>
        ${address.pais || ''}
    `;
    document.getElementById(elementId).innerHTML = html;
}

function getStatusConfig(status) {
    const configs = {
        'PENDIENTE': { text: 'Pendiente', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
        'PROCESANDO': { text: 'Procesando', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
        'ENVIADO': { text: 'Enviado', class: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
        'ENTREGADO': { text: 'Entregado', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
        'CANCELADO': { text: 'Cancelado', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
    };
    return configs[status] || configs['PENDIENTE'];
}

function updateProgress(status) {
    const progress = {
        'PENDIENTE': { width: '0%', text: 'PENDIENTE' },
        'PROCESANDO': { width: '25%', text: 'PROCESANDO' },
        'ENVIADO': { width: '50%', text: 'ENVIADO' },
        'EN_TRANSITO': { width: '75%', text: 'EN TRÁNSITO' },
        'ENTREGADO': { width: '100%', text: 'ENTREGADO' }
    };

    const config = progress[status] || progress['PROCESANDO'];
    document.getElementById('progressBar').style.width = config.width;
    document.getElementById('statusText').textContent = config.text;

    // Timeline
    const timeline = [
        { status: 'PROCESANDO', text: 'Pedido confirmado', date: order.fechaCreacion, active: true },
        { status: 'ENVIADO', text: 'Pedido enviado', date: order.fechaEnvio, active: status !== 'PENDIENTE' && status !== 'PROCESANDO' },
        { status: 'ENTREGADO', text: 'Pedido entregado', date: order.fechaEntrega, active: status === 'ENTREGADO' }
    ];

    const timelineHtml = timeline.map(item => `
        <div class="flex items-start gap-3 ${item.active ? '' : 'opacity-50'}">
            <span class="material-icons text-sm mt-0.5 ${item.active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}">
                ${item.active ? 'check_circle' : 'radio_button_unchecked'}
            </span>
            <div>
                <p class="font-medium">${item.text}</p>
                ${item.date ? `<p class="text-xs text-gray-500 dark:text-gray-400">${formatDate(item.date)}</p>` : ''}
            </div>
        </div>
    `).join('');
    document.getElementById('statusTimeline').innerHTML = timelineHtml;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function printOrder() {
    window.print();
}

function downloadInvoice() {
    ErrorHandler.showToast('Descargando factura...', 'info');
    // Implement PDF download via API
    // window.open(`${CONFIG.API_URL}/orden/${order.idOrden}/factura`, '_blank');
}

initConfirmationPage();