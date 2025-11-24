// assets/js/pages/admin_orders.js

/**
 * Admin Orders Management Page
 */

let orders = [];
let currentPage = 1;
let totalPages = 1;
let filters = {
    search: '',
    status: '',
    dateFrom: '',
    page: 1,
    pageSize: 10
};
let selectedOrders = new Set();
let orderStats = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0
};

/**
 * Initialize orders page
 */
async function initAdminOrdersPage() {
    // Check admin authentication
    if (!Auth.requireAdmin()) {
        return;
    }

    // Load admin profile
    await loadAdminProfile();
    
    // Load order stats
    await loadOrderStats();
    
    // Load orders
    await loadOrders();
    
    // Setup event listeners
    setupEventListeners();
    
    // Restore sidebar state
    restoreSidebarState();
}

/**
 * Load admin profile data
 */
async function loadAdminProfile() {
    try {
        const user = Auth.getUser();
        if (user) {
            const fullName = [user.nombreUsuario, user.apellidoPaterno, user.apellidoMaterno]
                .filter(Boolean)
                .join(' ');
            
            document.getElementById('adminName').textContent = fullName || 'Administrador';
            
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'Admin')}&background=007BFF&color=fff`;
            document.getElementById('adminAvatar').src = avatarUrl;
        }
    } catch (error) {
        console.error('Error loading admin profile:', error);
    }
}

/**
 * Load order statistics
 */
async function loadOrderStats() {
    try {
        // Get all orders to calculate stats
        const response = await API.orders.getAll();
        
        if (response.success && response.data) {
            const allOrders = response.data.items || response.data;
            
            orderStats = {
                pending: allOrders.filter(o => o.estado === 'Pendiente').length,
                processing: allOrders.filter(o => o.estado === 'Procesando').length,
                shipped: allOrders.filter(o => o.estado === 'Enviado').length,
                delivered: allOrders.filter(o => o.estado === 'Entregado').length,
            };
            
            // Update stat cards
            document.getElementById('statPending').textContent = orderStats.pending;
            document.getElementById('statProcessing').textContent = orderStats.processing;
            document.getElementById('statShipped').textContent = orderStats.shipped;
            document.getElementById('statDelivered').textContent = orderStats.delivered;
        }
    } catch (error) {
        console.error('Error loading order stats:', error);
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Search input with debounce
    document.getElementById('searchInput').addEventListener('input', debounce((e) => {
        filters.search = e.target.value;
        filters.page = 1;
        loadOrders();
    }, 500));

    // Filter changes
    document.getElementById('statusFilter').addEventListener('change', () => applyFilters());
    document.getElementById('dateFromFilter').addEventListener('change', () => applyFilters());

    // Select all checkbox
    document.getElementById('selectAll').addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.order-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = e.target.checked;
            const orderId = parseInt(cb.dataset.orderId);
            if (e.target.checked) {
                selectedOrders.add(orderId);
            } else {
                selectedOrders.delete(orderId);
            }
        });
    });
}

/**
 * Apply filters
 */
function applyFilters() {
    filters.status = document.getElementById('statusFilter').value;
    filters.dateFrom = document.getElementById('dateFromFilter').value;
    filters.page = 1;
    loadOrders();
}

/**
 * Clear filters
 */
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('dateFromFilter').value = '';
    
    filters = {
        search: '',
        status: '',
        dateFrom: '',
        page: 1,
        pageSize: 10
    };
    
    loadOrders();
}

/**
 * Load orders from API
 */
async function loadOrders() {
    const tbody = document.getElementById('ordersTableBody');
    
    // Show loading state
    tbody.innerHTML = `
        <tr>
            <td colspan="7" class="p-8 text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </td>
        </tr>
    `;

    try {
        const response = await API.orders.getAll();

        if (response.success && response.data) {
            let allOrders = response.data.items || response.data;
            
            // Apply client-side filtering
            if (filters.search) {
                allOrders = allOrders.filter(o => 
                    o.idOrden.toString().includes(filters.search) ||
                    o.nombreCliente?.toLowerCase().includes(filters.search.toLowerCase())
                );
            }
            
            if (filters.status) {
                allOrders = allOrders.filter(o => o.estado === filters.status);
            }
            
            if (filters.dateFrom) {
                allOrders = allOrders.filter(o => 
                    new Date(o.fechaCreacion) >= new Date(filters.dateFrom)
                );
            }
            
            // Calculate pagination
            const totalItems = allOrders.length;
            totalPages = Math.ceil(totalItems / filters.pageSize);
            const startIndex = (filters.page - 1) * filters.pageSize;
            const endIndex = startIndex + filters.pageSize;
            
            orders = allOrders.slice(startIndex, endIndex);
            currentPage = filters.page;

            if (orders.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="p-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                            <span class="material-icons-outlined text-4xl mb-2 opacity-50">inbox</span>
                            <p>No se encontraron pedidos</p>
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = orders.map(order => createOrderRow(order)).join('');
            }

            updatePagination(totalItems);
        } else {
            ErrorHandler.handleApiError(response);
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="p-8 text-center text-red-500">
                        Error al cargar pedidos
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        ErrorHandler.showToast('Error al cargar pedidos', 'error');
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="p-8 text-center text-red-500">
                    Error de conexión
                </td>
            </tr>
        `;
    }
}

/**
 * Create order table row
 */
function createOrderRow(order) {
    const statusInfo = getOrderStatusInfo(order.estado);
    
    return `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td class="p-3">
                <input type="checkbox" 
                       class="order-checkbox rounded border-gray-400 text-primary focus:ring-primary" 
                       data-order-id="${order.idOrden}"
                       onchange="handleCheckboxChange(${order.idOrden}, this.checked)"/>
            </td>
            <td class="p-3">
                <p class="font-semibold text-primary cursor-pointer" onclick="viewOrderDetails(${order.idOrden})">#${order.idOrden}</p>
            </td>
            <td class="p-3">
                <p class="font-medium">${order.nombreCliente || 'N/A'}</p>
                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">${order.correoCliente || ''}</p>
            </td>
            <td class="p-3 text-xs">
                ${formatDateTime(order.fechaCreacion)}
            </td>
            <td class="p-3 font-semibold">
                ${formatCurrency(order.total || 0)}
            </td>
            <td class="p-3">
                <select onchange="updateOrderStatus(${order.idOrden}, this.value)" 
                        class="text-xs px-2 py-1 rounded-full font-semibold border-0 ${statusInfo.color} cursor-pointer">
                    <option value="Pendiente" ${order.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="Procesando" ${order.estado === 'Procesando' ? 'selected' : ''}>Procesando</option>
                    <option value="Enviado" ${order.estado === 'Enviado' ? 'selected' : ''}>Enviado</option>
                    <option value="Entregado" ${order.estado === 'Entregado' ? 'selected' : ''}>Entregado</option>
                    <option value="Cancelado" ${order.estado === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
            </td>
            <td class="p-3">
                <div class="flex items-center gap-1">
                    <button onclick="viewOrderDetails(${order.idOrden})" 
                            class="p-2 text-primary hover:bg-primary/10 rounded" 
                            title="Ver detalles">
                        <span class="material-icons-outlined text-base">visibility</span>
                    </button>
                    <button onclick="printOrder(${order.idOrden})" 
                            class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" 
                            title="Imprimir">
                        <span class="material-icons-outlined text-base">print</span>
                    </button>
                    <button onclick="cancelOrder(${order.idOrden})" 
                            class="p-2 text-danger hover:bg-danger/10 rounded" 
                            title="Cancelar">
                        <span class="material-icons-outlined text-base">cancel</span>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Get order status info
 */
function getOrderStatusInfo(status) {
    const statusMap = {
        'Pendiente': { label: 'Pendiente', color: 'bg-orange-500/20 text-orange-800 dark:text-orange-400' },
        'Procesando': { label: 'Procesando', color: 'bg-blue-500/20 text-blue-800 dark:text-blue-400' },
        'Enviado': { label: 'Enviado', color: 'bg-purple-500/20 text-purple-800 dark:text-purple-400' },
        'Entregado': { label: 'Entregado', color: 'bg-green-200 text-green-800 dark:bg-green-900/40 dark:text-green-400' },
        'Cancelado': { label: 'Cancelado', color: 'bg-red-500/20 text-red-800 dark:text-red-400' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-500/20 text-gray-800 dark:text-gray-400' };
}

/**
 * Handle checkbox change
 */
function handleCheckboxChange(orderId, checked) {
    if (checked) {
        selectedOrders.add(orderId);
    } else {
        selectedOrders.delete(orderId);
    }
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
}

/**
 * Format date and time
 */
function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Update pagination
 */
function updatePagination(total) {
    document.getElementById('paginationInfo').textContent = 
        `Mostrando ${(currentPage - 1) * filters.pageSize + 1}-${Math.min(currentPage * filters.pageSize, total)} de ${total}`;

    const buttons = [];
    
    // Previous button
    buttons.push(`
        <button onclick="changePage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''} 
                class="px-3 py-2 text-sm rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">
            Anterior
        </button>
    `);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            buttons.push(`
                <button onclick="changePage(${i})" 
                        class="px-3 py-2 text-sm rounded ${i === currentPage ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'}">
                    ${i}
                </button>
            `);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            buttons.push('<span class="px-2 text-sm">...</span>');
        }
    }
    
    // Next button
    buttons.push(`
        <button onclick="changePage(${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''} 
                class="px-3 py-2 text-sm rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">
            Siguiente
        </button>
    `);
    
    document.getElementById('paginationButtons').innerHTML = buttons.join('');
}

/**
 * Change page
 */
function changePage(page) {
    if (page < 1 || page > totalPages) return;
    filters.page = page;
    loadOrders();
}

/**
 * View order details
 */
async function viewOrderDetails(orderId) {
    try {
        const response = await API.orders.getById(orderId);
        
        if (response.success && response.data) {
            const order = response.data;
            const statusInfo = getOrderStatusInfo(order.estado);
            
            const detailsHTML = `
                <div class="space-y-6">
                    <!-- Order Header -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">ID Pedido</p>
                            <p class="text-lg font-bold">#${order.idOrden}</p>
                        </div>
                        <div>
                            <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Estado</p>
                            <span class="px-3 py-1 text-sm font-semibold rounded-full ${statusInfo.color}">
                                ${statusInfo.label}
                            </span>
                        </div>
                        <div>
                            <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Fecha</p>
                            <p class="font-medium">${formatDateTime(order.fechaCreacion)}</p>
                        </div>
                        <div>
                            <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Total</p>
                            <p class="text-lg font-bold text-primary">${formatCurrency(order.total)}</p>
                        </div>
                    </div>

                    <!-- Customer Info -->
                    <div class="border-t border-border-light dark:border-border-dark pt-4">
                        <h3 class="font-bold mb-3">Información del Cliente</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Nombre</p>
                                <p class="font-medium">${order.nombreCliente || 'N/A'}</p>
                            </div>
                            <div>
                                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Correo</p>
                                <p class="font-medium">${order.correoCliente || 'N/A'}</p>
                            </div>
                            <div class="col-span-2">
                                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Dirección</p>
                                <p class="font-medium">${order.direccionEnvio || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Order Items -->
                    <div class="border-t border-border-light dark:border-border-dark pt-4">
                        <h3 class="font-bold mb-3">Productos</h3>
                        <div class="space-y-2">
                            ${(order.items || []).map(item => `
                                <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                                    <div class="flex-1">
                                        <p class="font-medium">${item.nombreProducto}</p>
                                        <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                            Cantidad: ${item.cantidad} × ${formatCurrency(item.precioUnitario)}
                                        </p>
                                    </div>
                                    <p class="font-bold">${formatCurrency(item.subtotal)}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Order Summary -->
                    <div class="border-t border-border-light dark:border-border-dark pt-4">
                        <div class="flex justify-between mb-2">
                            <p class="text-text-secondary-light dark:text-text-secondary-dark">Subtotal</p>
                            <p class="font-medium">${formatCurrency(order.subtotal || 0)}</p>
                        </div>
                        <div class="flex justify-between mb-2">
                            <p class="text-text-secondary-light dark:text-text-secondary-dark">Envío</p>
                            <p class="font-medium">${formatCurrency(order.costoEnvio || 0)}</p>
                        </div>
                        ${order.descuento ? `
                            <div class="flex justify-between mb-2">
                                <p class="text-text-secondary-light dark:text-text-secondary-dark">Descuento</p>
                                <p class="font-medium text-success">-${formatCurrency(order.descuento)}</p>
                            </div>
                        ` : ''}
                        <div class="flex justify-between pt-2 border-t border-border-light dark:border-border-dark">
                            <p class="font-bold text-lg">Total</p>
                            <p class="font-bold text-lg text-primary">${formatCurrency(order.total)}</p>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('orderDetails').innerHTML = detailsHTML;
            document.getElementById('orderModal').classList.remove('hidden');
        } else {
            ErrorHandler.handleApiError(response);
        }
    } catch (error) {
        console.error('Error loading order details:', error);
        ErrorHandler.showToast('Error al cargar detalles del pedido', 'error');
    }
}

/**
 * Close order modal
 */
function closeOrderModal() {
    document.getElementById('orderModal').classList.add('hidden');
}

/**
 * Update order status
 */
async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await API.orders.updateStatus(orderId, { estado: newStatus });
        
        if (response.success) {
            ErrorHandler.showToast('Estado actualizado correctamente', 'success');
            await loadOrders();
            await loadOrderStats();
        } else {
            ErrorHandler.handleApiError(response);
            await loadOrders(); // Reload to revert the select
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        ErrorHandler.showToast('Error al actualizar estado', 'error');
        await loadOrders(); // Reload to revert the select
    }
}

/**
 * Cancel order
 */
async function cancelOrder(orderId) {
    if (!confirm('¿Estás seguro de que deseas cancelar este pedido?')) return;
    
    try {
        const response = await API.orders.cancel(orderId);
        
        if (response.success) {
            ErrorHandler.showToast('Pedido cancelado correctamente', 'success');
            await loadOrders();
            await loadOrderStats();
        } else {
            ErrorHandler.handleApiError(response);
        }
    } catch (error) {
        console.error('Error canceling order:', error);
        ErrorHandler.showToast('Error al cancelar pedido', 'error');
    }
}

/**
 * Print order
 */
function printOrder(orderId) {
    // TODO: Implement print functionality
    ErrorHandler.showToast('Función de impresión no implementada aún', 'info');
}

/**
 * Export orders
 */
function exportOrders() {
    // TODO: Implement export to CSV/Excel
    ErrorHandler.showToast('Función de exportación no implementada aún', 'info');
}

/**
 * Toggle sidebar
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (window.innerWidth < 1024) {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('hidden');
    } else {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    }
}

/**
 * Restore sidebar state
 */
function restoreSidebarState() {
    if (window.innerWidth >= 1024 && localStorage.getItem('sidebarCollapsed') === 'true') {
        document.getElementById('sidebar').classList.add('collapsed');
    }
}

/**
 * Handle window resize
 */
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        document.getElementById('sidebar').classList.remove('mobile-open');
        document.getElementById('sidebarOverlay').classList.add('hidden');
    }
});

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Logout
 */
function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        Auth.logout();
    }
}

// Initialize page when DOM is ready
document.addEventListener('DOMContentLoaded', initAdminOrdersPage);