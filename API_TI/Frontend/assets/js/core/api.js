// assets/js/core/api.js

/**
 * HTTP Client for API Communication
 * Handles all API requests with proper error handling and token management
 */
class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.timeout = CONFIG.TIMEOUT;
    }

    /**
     * Get authorization headers with JWT token
     */
    getAuthHeaders() {
        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    /**
     * Generic HTTP request handler
     * @param {string} endpoint - API endpoint
     * @param {object} options - Request options
     * @returns {Promise<object>} - API response { success, data, error, correlationId }
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders(),
        };

        const config = {
            method: options.method || 'GET',
            headers: { ...defaultHeaders, ...options.headers },
            credentials: 'include', // ✅ Important: Include cookies for refresh token
            ...options,
        };

        // Add body for POST/PUT/PATCH
        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }

        // Setup timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        config.signal = controller.signal;

        try {
            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            // Parse JSON response
            let data;
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                // Non-JSON response
                data = {
                    success: false,
                    error: {
                        code: 9999,
                        message: 'Respuesta inválida del servidor',
                        severity: 3
                    }
                };
            }

            // Handle HTTP error status codes
            if (!response.ok) {
                // Check if response has our API error structure
                if (!data.error) {
                    data = {
                        success: false,
                        error: {
                            code: response.status === 404 ? 2000 : 9999,
                            message: this.getDefaultErrorMessage(response.status),
                            severity: 3
                        }
                    };
                }

                // Handle 401 Unauthorized (token expired or invalid)
                if (response.status === 401) {
                    await this.handleUnauthorized();
                }
            }

            // Ensure success field exists
            if (typeof data.success === 'undefined') {
                data.success = response.ok;
            }

            return data;

        } catch (error) {
            clearTimeout(timeoutId);

            // Handle AbortError (timeout)
            if (error.name === 'AbortError') {
                ErrorHandler.handleNetworkError(new Error('TimeoutError'));
                return {
                    success: false,
                    error: {
                        code: CONFIG.ERROR_CODES.ERROR_TIMEOUT,
                        message: 'La solicitud tardó demasiado tiempo',
                        severity: 3
                    }
                };
            }

            // Handle network errors
            console.error('API Network Error:', error);
            ErrorHandler.handleNetworkError(error);

            return {
                success: false,
                error: {
                    code: CONFIG.ERROR_CODES.ERROR_DEPENDENCIA,
                    message: 'Error de conexión con el servidor',
                    severity: 3
                }
            };
        }
    }

    /**
     * Handle 401 Unauthorized - try token refresh
     */
    async handleUnauthorized() {
        // Don't refresh if we're already on login page or on refresh endpoint
        if (window.location.pathname.includes('login.html') ||
            window.location.pathname.includes('register.html')) {
            return;
        }

        // Try to refresh token
        const refreshed = await Auth.refreshToken();

        if (!refreshed) {
            // Refresh failed - logout
            Auth.clearAuthData();
            ErrorHandler.showToast('Sesión expirada. Redirigiendo al login...', 'warning');
            setTimeout(() => {
                window.location.href = '/pages/login.html';
            }, 2000);
        }
    }

    /**
     * Get default error message for HTTP status code
     */
    getDefaultErrorMessage(status) {
        const messages = {
            400: 'Solicitud inválida',
            401: 'No autorizado',
            403: 'Acceso denegado',
            404: 'Recurso no encontrado',
            409: 'Conflicto con el estado actual',
            429: 'Demasiadas solicitudes',
            500: 'Error interno del servidor',
            502: 'Servidor no disponible',
            503: 'Servicio no disponible',
        };
        return messages[status] || 'Error desconocido';
    }

    /**
     * GET request
     */
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    /**
     * POST request
     */
    async post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body });
    }

    /**
     * PUT request
     */
    async put(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body });
    }

    /**
     * DELETE request
     */
    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    /**
     * PATCH request
     */
    async patch(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PATCH', body });
    }
}

// Create singleton instance
const api = new APIClient(CONFIG.API_URL);

/**
 * API Service - All API endpoints organized by domain
 */
const API = {
    // ========================================
    // AUTHENTICATION
    // ========================================
    auth: {
        /**
         * Login with email and password
         * @param {string} correo - Email
         * @param {string} contrasena - Password
         */
        login: (correo, contrasena) =>
            api.post(CONFIG.ENDPOINTS.LOGIN, { correo, contrasena }),

        /**
         * Register new user
         * @param {object} data - Registration data
         */
        register: (data) =>
            api.post(CONFIG.ENDPOINTS.REGISTER, data),

        /**
         * Login with Google OAuth
         * @param {string} idToken - Google ID token
         */
        googleLogin: (idToken) =>
            api.post(CONFIG.ENDPOINTS.GOOGLE_LOGIN, { idToken }),

        /**
         * Refresh access token
         * @param {string} refreshToken - Optional refresh token (uses cookie if not provided)
         */
        refresh: (refreshToken = null) =>
            api.post(CONFIG.ENDPOINTS.REFRESH, { refreshToken }),

        /**
         * Logout
         * @param {string} refreshToken - Optional refresh token
         */
        logout: (refreshToken = null) =>
            api.post(CONFIG.ENDPOINTS.LOGOUT, { refreshToken }),

        /**
         * Request password reset code
         * @param {string} email - User email
         */
        requestPasswordReset: (email) =>
            api.post(CONFIG.ENDPOINTS.REQUEST_PASSWORD_RESET, { email }),

        /**
         * Reset password with code
         * @param {object} data - { email, code, newPassword, confirmNewPassword }
         */
        resetPassword: (data) =>
            api.post(CONFIG.ENDPOINTS.RESET_PASSWORD, data),

        /**
         * Verify email with code
         * @param {string} code - Verification code
         */
        verifyEmail: (code) =>
            api.post(CONFIG.ENDPOINTS.VERIFY_EMAIL, { code }),

        /**
         * Resend email verification code
         */
        resendVerification: () =>
            api.post(CONFIG.ENDPOINTS.RESEND_VERIFICATION),

        /**
         * Get active sessions
         */
        getSessions: () =>
            api.get(CONFIG.ENDPOINTS.GET_SESSIONS),

        /**
         * Revoke a specific session
         * @param {number} sessionId - Session ID to revoke
         */
        revokeSession: (sessionId) =>
            api.post(CONFIG.ENDPOINTS.REVOKE_SESSION(sessionId)),
    },

    // ========================================
    // USER PROFILE
    // ========================================
    user: {
        /**
         * Get current user profile
         */
        getProfile: () =>
            api.get(CONFIG.ENDPOINTS.USER_PROFILE),

        /**
         * Update user profile
         * @param {object} data - Profile data to update
         */
        updateProfile: (data) =>
            api.put(CONFIG.ENDPOINTS.UPDATE_PROFILE, data),

        /**
         * Change password
         * @param {object} data - { currentPassword, newPassword, confirmNewPassword }
         */
        changePassword: (data) =>
            api.post(CONFIG.ENDPOINTS.CHANGE_PASSWORD, data),

        /**
         * Update email
         * @param {object} data - { newEmail, password }
         */
        updateEmail: (data) =>
            api.put(CONFIG.ENDPOINTS.UPDATE_EMAIL, data),

        /**
         * Delete account
         * @param {string} password - User password for confirmation
         */
        deleteAccount: (password) =>
            api.delete(CONFIG.ENDPOINTS.DELETE_ACCOUNT, {
                body: { password }
            }),
    },

    // ========================================
    // ADMIN
    // ========================================
    admin: {
        /**
         * Get dashboard metrics
         */
        getDashboardMetrics: () =>
            api.get('/admin/dashboard/metrics'),

        /**
         * Get users list
         * @param {object} params - { page, pageSize, search, role }
         */
        getUsers: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return api.get(`/admin/users${queryString ? '?' + queryString : ''}`);
        },

        /**
         * Get user details
         * @param {number} userId - User ID
         */
        getUserDetails: (userId) =>
            api.get(`/admin/users/${userId}`),

        /**
         * Toggle user active status
         * @param {number} userId - User ID
         */
        toggleUserStatus: (userId) =>
            api.put(`/admin/users/${userId}/toggle-status`),

        /**
         * Create new user (admin)
         * @param {object} data - User data
         */
        createUser: (data) =>
            api.post('/admin/users', data),

        /**
         * Update user (admin)
         * @param {number} userId - User ID
         * @param {object} data - Updated user data
         */
        updateUser: (userId, data) =>
            api.put(`/admin/users/${userId}`, data),

        /**
         * Delete user (admin)
         * @param {number} userId - User ID
         */
        deleteUser: (userId) =>
            api.delete(`/admin/users/${userId}`),
    }, 

    // ========================================
    // PRODUCTS (Future implementation)
    // ========================================
    products: {
        /**
         * Get all products
         */
        getAll: () =>
            api.get(CONFIG.ENDPOINTS.PRODUCTS),

        /**
         * Get product by ID
         * @param {number} id - Product ID
         */
        getById: (id) =>
            api.get(CONFIG.ENDPOINTS.PRODUCT_BY_ID(id)),

        /**
         * Search products
         * @param {object} filters - Search filters
         */
        search: (filters) =>
            api.post(CONFIG.ENDPOINTS.PRODUCT_SEARCH, filters),

        /**
         * Get featured products
         */
        getFeatured: () =>
            api.get(CONFIG.ENDPOINTS.PRODUCT_FEATURED),

        /**
         * Get product categories
         */
        getCategories: () =>
            api.get(CONFIG.ENDPOINTS.PRODUCT_CATEGORIES),

        /**
         * Get product brands
         */
        getBrands: () =>
            api.get(CONFIG.ENDPOINTS.PRODUCT_BRANDS),
    },

    // ========================================
    // CART (Future implementation)
    // ========================================
    cart: {
        /**
         * Get user's cart
         */
        get: () =>
            api.get(CONFIG.ENDPOINTS.CART),

        /**
         * Add item to cart
         * @param {number} productId - Product ID
         * @param {number} quantity - Quantity
         */
        addItem: (productId, quantity = 1) =>
            api.post(CONFIG.ENDPOINTS.CART_ITEMS, { productId, quantity }),

        /**
         * Update cart item quantity
         * @param {number} itemId - Cart item ID
         * @param {number} quantity - New quantity
         */
        updateItem: (itemId, quantity) =>
            api.put(CONFIG.ENDPOINTS.CART_ITEM(itemId), { quantity }),

        /**
         * Remove item from cart
         * @param {number} itemId - Cart item ID
         */
        removeItem: (itemId) =>
            api.delete(CONFIG.ENDPOINTS.CART_ITEM(itemId)),

        /**
         * Apply coupon code
         * @param {string} code - Coupon code
         */
        applyCoupon: (code) =>
            api.post(CONFIG.ENDPOINTS.CART_COUPON, { codigoCupon: code }),

        /**
         * Remove coupon
         */
        removeCoupon: () =>
            api.delete(CONFIG.ENDPOINTS.CART_COUPON),

        /**
         * Clear entire cart
         */
        clear: () =>
            api.delete(CONFIG.ENDPOINTS.CART),
    },

    // ========================================
    // ORDERS (Future implementation)
    // ========================================
    orders: {
        /**
         * Get all user orders
         */
        getAll: () =>
            api.get(CONFIG.ENDPOINTS.ORDERS),

        /**
         * Get order by ID
         * @param {number} id - Order ID
         */
        getById: (id) =>
            api.get(CONFIG.ENDPOINTS.ORDER_BY_ID(id)),

        /**
         * Create new order
         * @param {object} data - Order data
         */
        create: (data) =>
            api.post(CONFIG.ENDPOINTS.ORDERS, data),

        /**
         * Cancel order
         * @param {number} id - Order ID
         */
        cancel: (id) =>
            api.post(CONFIG.ENDPOINTS.ORDER_CANCEL(id)),
    },

    // ========================================
    // WISHLIST (Future implementation)
    // ========================================
    wishlist: {
        /**
         * Get user's wishlist
         */
        get: () =>
            api.get(CONFIG.ENDPOINTS.WISHLIST),

        /**
         * Add product to wishlist
         * @param {number} productId - Product ID
         */
        addItem: (productId) =>
            api.post(CONFIG.ENDPOINTS.WISHLIST_ITEM(productId)),

        /**
         * Remove product from wishlist
         * @param {number} productId - Product ID
         */
        removeItem: (productId) =>
            api.delete(CONFIG.ENDPOINTS.WISHLIST_ITEM(productId)),

        /**
         * Clear wishlist
         */
        clear: () =>
            api.delete(CONFIG.ENDPOINTS.WISHLIST),
    },

    // ========================================
    // NOTIFICATIONS (Future implementation)
    // ========================================
    notifications: {
        /**
         * Get all notifications
         */
        getAll: () =>
            api.get(CONFIG.ENDPOINTS.NOTIFICATIONS),

        /**
         * Mark notification as read
         * @param {number} id - Notification ID
         */
        markAsRead: (id) =>
            api.put(CONFIG.ENDPOINTS.NOTIFICATION_READ(id)),

        /**
         * Mark all notifications as read
         */
        markAllAsRead: () =>
            api.put(CONFIG.ENDPOINTS.NOTIFICATION_READ_ALL),

        /**
         * Delete notification
         * @param {number} id - Notification ID
         */
        delete: (id) =>
            api.delete(CONFIG.ENDPOINTS.NOTIFICATIONS + `/${id}`),
    },
    // ========================================
    // FAQs 
    // ========================================
    faqs: {
    getAll: () => api.get('/faqs'),
},
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { api, API };
}