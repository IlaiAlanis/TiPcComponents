/*const CONFIG = {
    API_URL: 'https://localhost:5001/api',
    RECAPTCHA_SITE_KEY: '6Lf6QhUsAAAAAJ6RtUFA6cabg13tf7ZjMci6A4MF',
    RECAPTCHA_V2_SITE_KEY: '6Lf-TRUsAAAAAMItj0DemVQi6SuijQAvzV0KsoiD',
    STORAGE_KEYS: {
        TOKEN: 'auth_token',
        USER: 'user_data'
    },
    TIMEOUT: 30000
};*/

// assets/js/core/config.js

const CONFIG = {
    // API Configuration
    API_URL: 'https://localhost:7001/api', // ✅ Change to your actual API URL

    // Storage Keys
    STORAGE_KEYS: {
        ACCESS_TOKEN: 'access_token',
        REFRESH_TOKEN: 'refresh_token',
        USER_DATA: 'user_data',
        TOKEN_EXPIRY: 'token_expiry',
    },

    // API Endpoints (matches your .NET API routes)
    ENDPOINTS: {
        // Auth
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        GOOGLE_LOGIN: '/auth/google-login',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        REQUEST_PASSWORD_RESET: '/auth/request-password-reset',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: '/auth/verify-email',
        RESEND_VERIFICATION: '/auth/resend-verification',
        GET_SESSIONS: '/auth/sessions',
        REVOKE_SESSION: (id) => `/auth/sessions/${id}/revoke`,

        // User
        USER_PROFILE: '/user/profile',
        UPDATE_PROFILE: '/user/profile',
        CHANGE_PASSWORD: '/user/change-password',
        UPDATE_EMAIL: '/user/email',
        DELETE_ACCOUNT: '/user/account',

        // Admin
        ADMIN_DASHBOARD: '/admin/dashboard',
        ADMIN_USERS: '/admin/users',
        ADMIN_USER_DETAILS: (id) => `/admin/users/${id}`,
        ADMIN_TOGGLE_USER_STATUS: (id) => `/admin/users/${id}/toggle-status`,
        ADMIN_DASHBOARD_METRICS: '/admin/dashboard/metrics',
        ADMIN_USERS: '/admin/users',
        ADMIN_USER_DETAILS: (id) => `/admin/users/${id}`,
        ADMIN_TOGGLE_USER_STATUS: (id) => `/admin/users/${id}/toggle-status`,
        
        // Products (when implemented)
        PRODUCTS: '/producto',
        PRODUCT_BY_ID: (id) => `/producto/${id}`,
        PRODUCT_SEARCH: '/producto/search',
        PRODUCT_FEATURED: '/producto/featured',
        PRODUCT_CATEGORIES: '/producto/categories',
        PRODUCT_BRANDS: '/producto/brands',

        // Cart (when implemented)
        CART: '/carrito',
        CART_ITEMS: '/carrito/items',
        CART_ITEM: (id) => `/carrito/items/${id}`,
        CART_COUPON: '/carrito/coupon',

        // Orders (when implemented)
        ORDERS: '/orden',
        ORDER_BY_ID: (id) => `/orden/${id}`,
        ORDER_CANCEL: (id) => `/orden/${id}/cancel`,

        // Wishlist (when implemented)
        WISHLIST: '/wishlist',
        WISHLIST_ITEM: (productId) => `/wishlist/items/${productId}`,

        // Notifications (when implemented)
        NOTIFICATIONS: '/notification',
        NOTIFICATION_READ: (id) => `/notification/${id}/read`,
        NOTIFICATION_READ_ALL: '/notification/read-all',
    },

    // App Settings
    TIMEOUT: 30000, // 30 seconds
    TOKEN_REFRESH_THRESHOLD: 2 * 60 * 1000, // Refresh 2 minutes before expiry

    // Google OAuth (if using)
    GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID', // ✅ Add your Google Client ID

    // reCAPTCHA (if using)
    RECAPTCHA_SITE_KEY: '6Lf6', // ✅ Your existing key
    RECAPTCHA_V2_SITE_KEY: '6Lf-TR', // ✅ Your existing key

    // Error Codes (matches your .NET API error codes)
    ERROR_CODES: {
        // General (0-99)
        OK: 0,
        PARAMETRO_INVALIDO: 2,
        FORMATO_INVALIDO: 3,
        DATOS_INCOMPLETOS: 4,
        OPERACION_NO_PERMITIDA: 5,
        REGISTRO_DUPLICADO: 6,

        // Auth (100-199)
        AUTENTICACION_REQUERIDA: 100,
        ACCESO_NO_AUTORIZADO: 101,
        CREDENCIALES_INVALIDAS: 102,
        USUARIO_BLOQUEADO: 103,
        TOKEN_INVALIDO: 104,
        TOKEN_EXPIRADO: 105,
        REFRESH_TOKEN_INVALIDO: 106,
        TOKEN_REVOKED: 107,
        OAUTH_ERROR: 109,

        // Users (200-299)
        USUARIO_NO_EXISTE: 200,
        USUARIO_DUPLICADO: 201,
        USUARIO_INACTIVO: 202,
        CONTRASENA_INCORRECTA: 203,
        ROL_NO_AUTORIZADO: 204,

        // Products (300-399)
        PRODUCTO_NO_EXISTE: 300,
        PRODUCTO_DUPLICADO: 301,
        PRODUCTO_INACTIVO: 302,
        STOCK_INSUFICIENTE: 303,

        // System (9000-9999)
        ERROR_SQL: 9000,
        ERROR_TIMEOUT: 9001,
        ERROR_CONCURRENCIA: 9002,
        ERROR_DEPENDENCIA: 9003,
        ERROR_CONFIGURACION: 9004,
        ERROR_DESCONOCIDO: 9999,
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

