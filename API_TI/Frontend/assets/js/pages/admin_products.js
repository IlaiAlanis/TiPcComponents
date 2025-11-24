// assets/js/pages/admin_products.js

/**
 * Admin Products Management Page
 */

let products = [];
let categories = [];
let brands = [];
let currentPage = 1;
let totalPages = 1;
let filters = {
    search: '',
    category: '',
    brand: '',
    inStock: false,
    lowStock: false,
    outOfStock: false,
    page: 1,
    pageSize: 10
};
let editingProductId = null;
let selectedProducts = new Set();
let selectedImageFile = null;

/**
 * Initialize products page
 */
async function initAdminProductsPage() {
    // Check admin authentication
    if (!Auth.requireAdmin()) {
        return;
    }

    // Load admin profile
    await loadAdminProfile();
    
    // Load categories and brands for filters
    await loadCategoriesAndBrands();
    
    // Load products
    await loadProducts();
    
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
 * Load categories and brands for filters
 */
async function loadCategoriesAndBrands() {
    try {
        // Load categories
        const categoriesResponse = await API.products.getCategories();
        if (categoriesResponse.success && categoriesResponse.data) {
            categories = categoriesResponse.data;
            populateSelect('categoryFilter', categories, 'Todas las categorías');
            populateSelect('categorySelect', categories, 'Seleccionar...');
        }

        // Load brands
        const brandsResponse = await API.products.getBrands();
        if (brandsResponse.success && brandsResponse.data) {
            brands = brandsResponse.data;
            populateSelect('brandFilter', brands, 'Todas las marcas');
            populateSelect('brandSelect', brands, 'Seleccionar...');
        }
    } catch (error) {
        console.error('Error loading categories and brands:', error);
    }
}

/**
 * Populate select element
 */
function populateSelect(selectId, items, placeholder) {
    const select = document.getElementById(selectId);
    select.innerHTML = `<option value="">${placeholder}</option>`;
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        select.appendChild(option);
    });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Search input with debounce
    document.getElementById('searchInput').addEventListener('input', debounce((e) => {
        filters.search = e.target.value;
        filters.page = 1;
        loadProducts();
    }, 500));

    // Filter changes
    document.getElementById('categoryFilter').addEventListener('change', () => applyFilters());
    document.getElementById('brandFilter').addEventListener('change', () => applyFilters());
    document.getElementById('filterInStock').addEventListener('change', () => applyFilters());
    document.getElementById('filterLowStock').addEventListener('change', () => applyFilters());
    document.getElementById('filterOutOfStock').addEventListener('change', () => applyFilters());

    // Select all checkbox
    document.getElementById('selectAll').addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.product-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = e.target.checked;
            const productId = parseInt(cb.dataset.productId);
            if (e.target.checked) {
                selectedProducts.add(productId);
            } else {
                selectedProducts.delete(productId);
            }
        });
    });

    // Product form submit
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);

    // Image input change
    document.getElementById('imageInput').addEventListener('change', handleImageSelect);
}

/**
 * Apply filters
 */
function applyFilters() {
    filters.category = document.getElementById('categoryFilter').value;
    filters.brand = document.getElementById('brandFilter').value;
    filters.inStock = document.getElementById('filterInStock').checked;
    filters.lowStock = document.getElementById('filterLowStock').checked;
    filters.outOfStock = document.getElementById('filterOutOfStock').checked;
    filters.page = 1;
    loadProducts();
}

/**
 * Clear filters
 */
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('brandFilter').value = '';
    document.getElementById('filterInStock').checked = false;
    document.getElementById('filterLowStock').checked = false;
    document.getElementById('filterOutOfStock').checked = false;
    
    filters = {
        search: '',
        category: '',
        brand: '',
        inStock: false,
        lowStock: false,
        outOfStock: false,
        page: 1,
        pageSize: 10
    };
    
    loadProducts();
}

/**
 * Load products from API
 */
async function loadProducts() {
    const tbody = document.getElementById('productsTableBody');
    
    // Show loading state
    tbody.innerHTML = `
        <tr>
            <td colspan="9" class="p-8 text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </td>
        </tr>
    `;

    try {
        const response = await API.products.search(filters);

        if (response.success && response.data) {
            products = response.data.items || response.data;
            totalPages = response.data.totalPages || 1;
            currentPage = filters.page;

            if (products.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="9" class="p-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                            <span class="material-icons-outlined text-4xl mb-2 opacity-50">inventory_2</span>
                            <p>No se encontraron productos</p>
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = products.map(product => createProductRow(product)).join('');
            }

            updatePagination(response.data.total || products.length);
        } else {
            ErrorHandler.handleApiError(response);
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="p-8 text-center text-red-500">
                        Error al cargar productos
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading products:', error);
        ErrorHandler.showToast('Error al cargar productos', 'error');
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="p-8 text-center text-red-500">
                    Error de conexión
                </td>
            </tr>
        `;
    }
}

/**
 * Create product table row
 */
function createProductRow(product) {
    const stockStatus = getStockStatus(product.stock);
    const imageUrl = product.imagenUrl || 'https://via.placeholder.com/150?text=No+Image';
    
    return `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td class="p-3">
                <input type="checkbox" 
                       class="product-checkbox rounded border-gray-400 text-primary focus:ring-primary" 
                       data-product-id="${product.idProducto}"
                       onchange="handleCheckboxChange(${product.idProducto}, this.checked)"/>
            </td>
            <td class="p-3">
                <img src="${imageUrl}" alt="${product.nombreProducto}" class="w-12 h-12 object-cover rounded"/>
            </td>
            <td class="p-3">
                <p class="font-semibold">${product.nombreProducto}</p>
                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">${product.descripcion || ''}</p>
            </td>
            <td class="p-3 text-xs">${product.sku || 'N/A'}</td>
            <td class="p-3 text-xs">${product.categoria || 'N/A'}</td>
            <td class="p-3">
                <p class="font-semibold">${formatCurrency(product.precioBase)}</p>
                ${product.precioPromocional ? `<p class="text-xs text-success line-through">${formatCurrency(product.precioPromocional)}</p>` : ''}
            </td>
            <td class="p-3 text-center font-semibold">${product.stock}</td>
            <td class="p-3">
                <span class="px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}">
                    ${stockStatus.label}
                </span>
            </td>
            <td class="p-3">
                <div class="flex items-center gap-1">
                    <button onclick="viewProduct(${product.idProducto})" 
                            class="p-2 text-primary hover:bg-primary/10 rounded" 
                            title="Ver">
                        <span class="material-icons-outlined text-base">visibility</span>
                    </button>
                    <button onclick="editProduct(${product.idProducto})" 
                            class="p-2 text-warning hover:bg-warning/10 rounded" 
                            title="Editar">
                        <span class="material-icons-outlined text-base">edit</span>
                    </button>
                    <button onclick="deleteProduct(${product.idProducto})" 
                            class="p-2 text-danger hover:bg-danger/10 rounded" 
                            title="Eliminar">
                        <span class="material-icons-outlined text-base">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Get stock status
 */
function getStockStatus(stock) {
    if (stock === 0) {
        return { label: 'Agotado', color: 'bg-red-500/20 text-red-800 dark:text-red-400' };
    } else if (stock <= 10) {
        return { label: 'Poco stock', color: 'bg-yellow-500/20 text-yellow-800 dark:text-yellow-400' };
    } else {
        return { label: 'En stock', color: 'bg-success/20 text-green-800 dark:text-success' };
    }
}

/**
 * Handle checkbox change
 */
function handleCheckboxChange(productId, checked) {
    if (checked) {
        selectedProducts.add(productId);
    } else {
        selectedProducts.delete(productId);
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
    loadProducts();
}

/**
 * Handle image selection
 */
function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        ErrorHandler.showToast('Por favor selecciona una imagen válida', 'error');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        ErrorHandler.showToast('La imagen no debe superar 5MB', 'error');
        return;
    }

    selected

ImageFile = file;

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview"/>`;
        preview.classList.add('has-image');
    };
    reader.readAsDataURL(file);
}

/**
 * Open product modal
 */
function openProductModal(product = null) {
    editingProductId = product?.idProducto || null;
    document.getElementById('modalTitle').textContent = product ? 'Editar Producto' : 'Nuevo Producto';
    
    const form = document.getElementById('productForm');
    const imagePreview = document.getElementById('imagePreview');
    
    if (product) {
        // Edit mode - populate form
        form.nombreProducto.value = product.nombreProducto || '';
        form.descripcion.value = product.descripcion || '';
        form.sku.value = product.sku || '';
        form.categoria.value = product.categoria || '';
        form.marca.value = product.marca || '';
        form.stock.value = product.stock || 0;
        form.precioBase.value = product.precioBase || 0;
        form.precioPromocional.value = product.precioPromocional || '';
        form.estaActivo.checked = product.estaActivo !== false;
        form.imagenUrl.value = product.imagenUrl || '';
        
        // Show existing image
        if (product.imagenUrl) {
            imagePreview.innerHTML = `<img src="${product.imagenUrl}" alt="Product"/>`;
            imagePreview.classList.add('has-image');
        }
    } else {
        // New product - reset form
        form.reset();
        imagePreview.innerHTML = `
            <span class="text-text-secondary-light dark:text-text-secondary-dark">
                <span class="material-icons-outlined text-4xl">add_photo_alternate</span>
                <p class="text-sm mt-2">Click para subir imagen</p>
            </span>
        `;
        imagePreview.classList.remove('has-image');
        form.estaActivo.checked = true;
    }
    
    selectedImageFile = null;
    document.getElementById('productModal').classList.remove('hidden');
}

/**
 * Close product modal
 */
function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
    editingProductId = null;
    selectedImageFile = null;
}

/**
 * Handle product form submit
 */
async function handleProductSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        nombreProducto: formData.get('nombreProducto'),
        descripcion: formData.get('descripcion'),
        sku: formData.get('sku'),
        categoria: formData.get('categoria'),
        marca: formData.get('marca'),
        stock: parseInt(formData.get('stock')),
        precioBase: parseFloat(formData.get('precioBase')),
        precioPromocional: formData.get('precioPromocional') ? parseFloat(formData.get('precioPromocional')) : null,
        estaActivo: formData.get('estaActivo') === 'on',
        imagenUrl: formData.get('imagenUrl') || null,
    };

    // If new image selected, upload it first
    if (selectedImageFile) {
        // TODO: Implement image upload to your server/cloud storage
        // For now, we'll use a placeholder
        // data.imagenUrl = await uploadImage(selectedImageFile);
        ErrorHandler.showToast('Función de subida de imagen no implementada aún', 'warning');
    }

    const btn = document.getElementById('saveBtn');
    ErrorHandler.setLoading(btn, true);

    try {
        const response = editingProductId 
            ? await API.products.update(editingProductId, data)
            : await API.products.create(data);

        ErrorHandler.setLoading(btn, false);

        if (response.success) {
            ErrorHandler.showToast(
                editingProductId ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
                'success'
            );
            closeProductModal();
            await loadProducts();
        } else {
            ErrorHandler.handleApiError(response, e.target);
        }
    } catch (error) {
        ErrorHandler.setLoading(btn, false);
        console.error('Error saving product:', error);
        ErrorHandler.showToast('Error al guardar producto', 'error');
    }
}

/**
 * View product details
 */
function viewProduct(id) {
    // TODO: Implement product details view
    window.location.href = `/pages/product.html?id=${id}`;
}

/**
 * Edit product
 */
function editProduct(id) {
    const product = products.find(p => p.idProducto === id);
    if (product) {
        openProductModal(product);
    }
}

/**
 * Delete product
 */
async function deleteProduct(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    
    try {
        const response = await API.products.delete(id);
        
        if (response.success) {
            ErrorHandler.showToast('Producto eliminado correctamente', 'success');
            await loadProducts();
        } else {
            ErrorHandler.handleApiError(response);
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        ErrorHandler.showToast('Error al eliminar producto', 'error');
    }
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
document.addEventListener('DOMContentLoaded', initAdminProductsPage);