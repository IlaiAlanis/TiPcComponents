// assets/js/core/auth.js

/**
 * Authentication Manager
 * Handles all authentication operations, token management, and user state
 */
const Auth = {
    /**
     * Current user object (cached)
     */
    user: null,

    /**
     * Token refresh timer
     */
    tokenRefreshTimer: null,

    /**
     * Save authentication data after successful login/register
     * @param {object} authResponse - Response from login/register API
     */
    saveAuthData(authResponse) {
        const { token, refreshToken, expiraEn, usuario } = authResponse;

        // Save access token
        localStorage.setItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);

        // Save refresh token (if provided - otherwise it's in HTTP-only cookie)
        if (refreshToken) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        }

        // Save token expiry time
        localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN_EXPIRY, expiraEn);

        // Save user data
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(usuario));
        this.user = usuario;

        // Setup automatic token refresh
        this.scheduleTokenRefresh(new Date(expiraEn));
    },

    /**
     * Schedule automatic token refresh before expiry
     * @param {Date} expiryDate - Token expiry date
     */
    scheduleTokenRefresh(expiryDate) {
        // Clear existing timer
        if (this.tokenRefreshTimer) {
            clearTimeout(this.tokenRefreshTimer);
        }

        const now = new Date();
        const expiresIn = expiryDate - now;
        const refreshTime = expiresIn - CONFIG.TOKEN_REFRESH_THRESHOLD;

        // Only schedule if refresh time is in the future
        if (refreshTime > 0) {
            console.log(`Token refresh scheduled in ${Math.floor(refreshTime / 1000 / 60)} minutes`);

            this.tokenRefreshTimer = setTimeout(async () => {
                console.log('Auto-refreshing token...');
                try {
                    await this.refreshToken();
                } catch (error) {
                    console.error('Auto token refresh failed', error);
                    this.logout();
                }
            }, refreshTime);
        } else {
            console.warn('Token already expired or will expire soon. Immediate refresh needed.');
            // Try immediate refresh
            this.refreshToken().catch(() => {
                this.logout();
            });
        }
    },

    /**
     * Refresh access token using refresh token
     * @returns {Promise<boolean>} - True if refresh successful
     */
    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);

            // Call refresh endpoint (cookie-based if no refresh token in localStorage)
            const response = await API.auth.refresh(refreshToken);

            if (response.success) {
                this.saveAuthData(response.data);
                console.log('Token refreshed successfully');
                return true;
            } else {
                console.error('Token refresh failed:', response.error);
                return false;
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    },

    /**
     * Get current access token
     * @returns {string|null} - Access token
     */
    getToken() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    },

    /**
     * Get current user data
     * @returns {object|null} - User object
     */
    getUser() {
        if (this.user) return this.user;

        const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA);
        if (userData) {
            try {
                this.user = JSON.parse(userData);
                return this.user;
            } catch (e) {
                console.error('Failed to parse user data', e);
                return null;
            }
        }
        return null;
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        const token = this.getToken();
        const expiry = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_EXPIRY);

        if (!token || !expiry) return false;

        // Check if token is expired
        const expiryDate = new Date(expiry);
        return expiryDate > new Date();
    },

    /**
     * Check if user is admin
     * @returns {boolean}
     */
    isAdmin() {
        const user = this.getUser();
        return user?.rol === 'Admin' || user?.rol === 'ADMIN';
    },

    /**
     * Get user role
     * @returns {string}
     */
    getUserRole() {
        const user = this.getUser();
        return user?.rol || 'User';
    },

    /**
     * Check if user has specific role
     * @param {string} role - Role to check
     * @returns {boolean}
     */
    hasRole(role) {
        return this.getUserRole().toLowerCase() === role.toLowerCase();
    },

    /**
     * Update user data (for profile updates)
     * @param {object} userData - Updated user data
     */
    updateUser(userData) {
        const currentUser = this.getUser();
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
        this.user = updatedUser;
    },

    /**
     * Clear all authentication data
     */
    clearAuthData() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN_EXPIRY);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_DATA);
        this.user = null;

        if (this.tokenRefreshTimer) {
            clearTimeout(this.tokenRefreshTimer);
            this.tokenRefreshTimer = null;
        }
    },

    /**
     * Logout user
     */
    async logout() {
        try {
            const refreshToken = localStorage.getItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);

            // Call logout endpoint to revoke tokens on server
            if (refreshToken) {
                await API.auth.logout(refreshToken);
            }
        } catch (error) {
            console.error('Logout API call failed', error);
        } finally {
            // Always clear local data
            this.clearAuthData();

            ErrorHandler.showToast('Sesión cerrada correctamente', 'success');

            // Redirect to login
            setTimeout(() => {
                window.location.href = '/pages/login.html';
            }, 1000);
        }
    },

    /**
     * Require authentication (use in protected pages)
     * Redirects to login if not authenticated
     * @returns {boolean} - True if authenticated
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            ErrorHandler.showToast('Debes iniciar sesión para acceder', 'warning');
            setTimeout(() => {
                const currentPath = window.location.pathname;
                window.location.href = '/pages/login.html?redirect=' + encodeURIComponent(currentPath);
            }, 1500);
            return false;
        }
        return true;
    },

    /**
     * Require admin role (use in admin pages)
     * Redirects to home if not admin
     * @returns {boolean} - True if admin
     */
    requireAdmin() {
        if (!this.isAuthenticated()) {
            ErrorHandler.showToast('Debes iniciar sesión', 'warning');
            return false;
        }

        if (!this.isAdmin()) {
            ErrorHandler.showModal(
                'Acceso Denegado',
                'No tienes permisos de administrador para acceder a esta sección.',
                () => {
                    window.location.href = '/pages/index.html';
                }
            );
            return false;
        }

        return true;
    },

    /**
     * Initialize auth on page load
     * Checks authentication status and schedules token refresh
     */
    init() {
        if (this.isAuthenticated()) {
            const expiry = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_EXPIRY);
            if (expiry) {
                this.scheduleTokenRefresh(new Date(expiry));
            }
        }
    }
};