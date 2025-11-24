// assets/js/pages/admin_users.js

/**
 * Admin Users Management Page
 */

let users = [];
let currentPage = 1;
let totalPages = 1;
let filters = { search: '', role: '', page: 1, pageSize: 10 };
let editingUserId = null;
let selectedUsers = new Set();

/**
 * Initialize users page
 */
async function initAdminUsersPage() {
    // Check admin authentication
    if (!Auth.requireAdmin()) {
        return;
    }

    // Load admin profile
    await loadAdminData();

    // Load users
    await loadUsers();

    // Setup event listeners
    setupEventListeners();

    // Restore sidebar state
    restoreSidebarState();
}

/**
 * Load admin profile data
 */
async function loadAdminData() {
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
        console.error('Error loading admin data:', error);
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
        loadUsers();
    }, 500));

    // Role filter
    document.getElementById('roleFilter').addEventListener('change', (e) => {
        filters.role = e.target.value;
        filters.page = 1;
        loadUsers();
    });

    // Select all checkbox
    document.getElementById('selectAll').addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.user-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = e.target.checked;
            const userId = parseInt(cb.dataset.userId);
            if (e.target.checked) {
                selectedUsers.add(userId);
            } else {
                selectedUsers.delete(userId);
            }
        });
    });

    // User form submit
    document.getElementById('userForm').addEventListener('submit', handleUserSubmit);
}

/**
 * Load users from API
 */
async function loadUsers() {
    const tbody = document.getElementById('usersTableBody');

    // Show loading state
    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="p-8 text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </td>
        </tr>
    `;

    try {
        // ✅ FIXED: Use correct API method
        const response = await API.admin.getUsers(filters);

        if (response.success && response.data) {
            users = response.data.items || response.data;
            totalPages = response.data.totalPages || 1;
            currentPage = filters.page;

            if (users.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="p-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                            <span class="material-icons-outlined text-4xl mb-2 opacity-50">inbox</span>
                            <p>No se encontraron usuarios</p>
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = users.map(user => createUserRow(user)).join('');
            }

            updatePagination(response.data.total || users.length);
        } else {
            ErrorHandler.handleApiError(response);
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="p-8 text-center text-red-500">
                        Error al cargar usuarios
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading users:', error);
        ErrorHandler.showToast('Error al cargar usuarios', 'error');
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="p-8 text-center text-red-500">
                    Error de conexión
                </td>
            </tr>
        `;
    }
}

/**
 * Create user table row
 */
function createUserRow(user) {
    // ✅ FIXED: Match your API response structure
    const roleColors = {
        'Admin': 'bg-warning/20 text-yellow-800 dark:text-warning',
        'User': 'bg-primary/20 text-blue-800 dark:text-primary',
        'ADMIN': 'bg-warning/20 text-yellow-800 dark:text-warning',
        'USER': 'bg-primary/20 text-blue-800 dark:text-primary'
    };
    const roleLabels = {
        'Admin': 'Administrador',
        'User': 'Usuario',
        'ADMIN': 'Administrador',
        'USER': 'Usuario',
    };

    const fullName = [user.nombreUsuario, user.apellidoPaterno, user.apellidoMaterno]
        .filter(Boolean)
        .join(' ');

    return `
    <tr>
        <td class="p-3">
            <input type="checkbox" 
                   class="user-checkbox rounded border-gray-400 text-primary focus:ring-primary" 
                   data-user-id="${user.idUsuario}"
                   onchange="handleCheckboxChange(${user.idUsuario}, this.checked)"/>
        </td>
        <td class="p-3 whitespace-nowrap">${fullName}</td>
        <td class="p-3 whitespace-nowrap">${user.correo}</td>
        <td class="p-3 whitespace-nowrap">
            <span class="px-2 py-1 text-xs font-semibold rounded-full ${roleColors[user.rol] || roleColors['User']}">
                ${roleLabels[user.rol] || user.rol}
            </span>
        </td>
        <td class="p-3 whitespace-nowrap text-text-secondary-light dark:text-text-secondary-dark hidden sm:table-cell">
            ${formatDate(user.fechaCreacion)}
        </td>
        <td class="p-3 whitespace-nowrap">
            <button onclick="editUser(${user.idUsuario})" 
                    class="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary mr-2"
                    title="Editar">
                <span class="material-icons-outlined text-lg">edit</span>
            </button>
            <button onclick="toggleUserStatus(${user.idUsuario})" 
                    class="text-text-secondary-light dark:text-text-secondary-dark hover:text-warning"
                    title="${user.estaActivo ? 'Desactivar' : 'Activar'}">
                <span class="material-icons-outlined text-lg">
                    ${user.estaActivo ? 'block' : 'check_circle'}
                </span>
            </button>
        </td>
    </tr>
`;
}

