// Tab switching

function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');

    
    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginTab.classList.add('bg-primary', 'text-white', 'shadow');
        loginTab.classList.remove('text-gray-600', 'dark:text-gray-300');
        registerTab.classList.remove('bg-primary', 'text-white', 'shadow');
        registerTab.classList.add('text-gray-600', 'dark:text-gray-300');
        registerForm.reset();
        clearValidationStates();
    } else {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        registerTab.classList.add('bg-primary', 'text-white', 'shadow');
        registerTab.classList.remove('text-gray-600', 'dark:text-gray-300');
        loginTab.classList.remove('bg-primary', 'text-white', 'shadow');
        loginTab.classList.add('text-gray-600', 'dark:text-gray-300');
        loginForm.reset();
    }
}

function clearValidationStates() {
    // Reset password requirements
    ['req-length', 'req-uppercase', 'req-lowercase', 'req-number', 'req-special'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('text-green-500');
            element.classList.add('text-gray-500');
            const icon = element.querySelector('.material-icons');
            if (icon) icon.textContent = 'radio_button_unchecked';
        }
    });
    
    // Hide match error
    const matchError = document.getElementById('passwordMatchError');
    if (matchError) matchError.classList.add('hidden');
    
    // Remove all field errors
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    });
}

/// Email validation with visual feedback

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.(com|mx|edu|org|net|gov|com\.mx|edu\.mx|gob\.mx)$/i;
    return regex.test(email);
}

function validateEmailField(input) {
    const isValid = validateEmail(input.value);
    if (input.value && !isValid) {
        input.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        input.classList.remove('focus:border-primary', 'focus:ring-primary');
    } else {
        input.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        input.classList.add('focus:border-primary', 'focus:ring-primary');
    }
    return isValid;
}

// Password validation with visual feedback
function validatePasswordMatch() {
    const password = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const errorDiv = document.getElementById('passwordMatchError');
    const errorText = document.getElementById('matchErrorText');
    
    if (!confirmPassword.value) {
        errorDiv.classList.add('hidden');
        confirmPassword.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        return false;
    }
    
    const passwordValid = validatePassword();
    const passwordsMatch = password.value === confirmPassword.value;
    
    if (!passwordsMatch) {
        errorText.textContent = 'Las contraseñas no coinciden';
        errorDiv.classList.remove('hidden');
        confirmPassword.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        confirmPassword.classList.remove('focus:border-primary', 'focus:ring-primary');
        return false;
    }
    
    if (!passwordValid) {
        errorText.textContent = 'La contraseña no cumple todos los requisitos';
        errorDiv.classList.remove('hidden');
        confirmPassword.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        confirmPassword.classList.remove('focus:border-primary', 'focus:ring-primary');
        return false;
    }
    
    errorDiv.classList.add('hidden');
    confirmPassword.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    confirmPassword.classList.add('focus:border-primary', 'focus:ring-primary');
    return true;
}

function validatePassword() {
    const password = document.getElementById('registerPassword');
    const value = password.value;
    
    const requirements = {
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
    };
    
    updateRequirement('req-length', requirements.length);
    updateRequirement('req-uppercase', requirements.uppercase);
    updateRequirement('req-lowercase', requirements.lowercase);
    updateRequirement('req-number', requirements.number);
    updateRequirement('req-special', requirements.special);
    
    const allValid = Object.values(requirements).every(r => r);
    
    if (value && !allValid) {
        password.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        password.classList.remove('focus:border-primary', 'focus:ring-primary');
    } else {
        password.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        password.classList.add('focus:border-primary', 'focus:ring-primary');
    }
    
    return allValid;
}

function updateRequirement(id, valid) {
    const element = document.getElementById(id);
    const icon = element.querySelector('.material-icons');
    
    if (valid) {
        element.classList.remove('text-gray-500');
        element.classList.add('text-green-500');
        icon.textContent = 'check_circle';
    } else {
        element.classList.remove('text-green-500');
        element.classList.add('text-gray-500');
        icon.textContent = 'radio_button_unchecked';
    }
}

// Execute reCAPTCHA
let recaptchaV2Widget = null;

async function executeRecaptcha(action) {
    // Try v3 first
    if (typeof grecaptcha !== 'undefined' && grecaptcha.execute) {
        try {
            return await grecaptcha.execute(CONFIG.RECAPTCHA_SITE_KEY, { action });
        } catch (error) {
            console.error('reCAPTCHA error:', error);
            ErrorHandler.showToast('Error de verificación de seguridad', 'warning');
            return null;        }
    }
    
    // v3 failed - show v2 checkbox
    return await showRecaptchaV2Fallback();
}


function showRecaptchaV2Fallback() {
    return new Promise((resolve) => {
        const fallbackDiv = document.getElementById('recaptchaFallback');
        const container = document.getElementById('recaptcha-v2-container');
        
        fallbackDiv.classList.remove('hidden');
        
        if (recaptchaV2WidgetId === null) {
            recaptchaV2WidgetId = grecaptcha.render(container, {
                'sitekey': CONFIG.RECAPTCHA_SITE_KEY,
                'callback': (token) => {
                    fallbackDiv.classList.add('hidden');
                    resolve(token);
                },
                'expired-callback': () => {
                    ErrorHandler.showToast('Verificación expirada, intenta de nuevo', 'warning');
                    resolve(null);
                }
            });
        } else {
            grecaptcha.reset(recaptchaV2WidgetId);
        }
    });
}

function showRecaptchaV2() {
    return new Promise((resolve) => {
        const fallback = document.getElementById('recaptchaFallback');
        fallback.classList.remove('hidden');
        
        if (!recaptchaV2Widget) {
            recaptchaV2Widget = grecaptcha.render('recaptcha-container', {
                sitekey: CONFIG.RECAPTCHA_V2_SITE_KEY,
                callback: (token) => {
                    fallback.classList.add('hidden');
                    resolve(token);
                },
                'expired-callback': () => {
                    ErrorHandler.showToast('Verificación expirada, intenta nuevamente', 'warning');
                    resolve(null);
                }
            });
        } else {
            grecaptcha.reset(recaptchaV2Widget);
        }
    });
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    const btn = document.getElementById('loginBtn');
    const form = e.target;
    
    ErrorHandler.clearFormErrors(form);
    ErrorHandler.setLoading(btn, true);
    
    //const recaptchaToken = await executeRecaptcha('login');

    const formData = {
        correo: form.correo.value.trim(),
        password: form.password.value,
        //Catcha
        //recaptchaToken: recaptchaToken || undefined
    };
    
    const response = await API.auth.login(formData);
    
    ErrorHandler.setLoading(btn, false);
    
    if (response.success) {
        Auth.saveToken(response.data.token, response.data.user);
        ErrorHandler.showToast('Inicio de sesión exitoso', 'success');
        
        setTimeout(() => {
            const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/pages/index.html';
            window.location.href = redirectUrl;
        }, 1000);
    } else {
        ErrorHandler.handleApiError(response, form);
    }
}

// Handle Register
async function handleRegister(e) {
    e.preventDefault();
    const btn = document.getElementById('registerBtn');
    const form = e.target;
    
    ErrorHandler.clearFormErrors(form);
    
    if (!validateEmail(form.correo.value)) {
        ErrorHandler.showFieldError(form.correo, 'Formato de correo inválido');
        return;
    }
    
    if (!validatePasswordMatch()) {
        return; // Error already shown
    }
    
    ErrorHandler.setLoading(btn, true);
    
    //const recaptchaToken = await executeRecaptcha('register');

    const formData = {
        nombreUsuario: form.nombreUsuario.value.trim(),
        correo: form.correo.value.trim(),
        password: form.password.value,
        //Catcha
        //recaptchaToken: recaptchaToken || undefined
    };

    const response = await API.auth.register(formData);
    
    ErrorHandler.setLoading(btn, false);
    
    if (response.success) {
        ErrorHandler.showToast('Cuenta creada. Revisa tu correo.', 'success', 6000);
        setTimeout(() => {
            switchTab('login');
            document.getElementById('loginEmail').value = form.correo.value;
        }, 2000);
    } else {
        ErrorHandler.handleApiError(response, form);
    }
}

// Google Login (placeholder - implement OAuth flow)
function handleGoogleLogin() {
    // Check if Google SDK loaded
    if (typeof google === 'undefined' || !google.accounts) {
        ErrorHandler.showToast('Google Sign-In no disponible', 'error');
        return;
    }

    try {
        google.accounts.id.initialize({
            client_id: '907193631804-osa1043e95mss53lpg2glcenu7t149lq.apps.googleusercontent.com',
            callback: handleGoogleCallback,
            error_callback: (error) => {
                console.error('Google Sign-In Error:', error);
                ErrorHandler.showToast('Error de autenticación con Google. Verifica la configuración del dominio.', 'error');
            }
        });
        
        google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                ErrorHandler.showToast('Google Sign-In no disponible. Verifica que el dominio esté autorizado.', 'warning');
            }
        });
    } catch (error) {
        ErrorHandler.showToast('Error al inicializar Google Sign-In', 'error');
    }
}

async function handleGoogleCallback(response) {
    ErrorHandler.setLoading(document.getElementById('loginBtn'), true);
    
    try {
        const result = await API.auth.googleLogin({ idToken: response.credential });
        
        if (result.success) {
            Auth.saveToken(result.data.token, result.data.usuario);
            ErrorHandler.showToast('Login con Google exitoso', 'success');
            setTimeout(() => window.location.href = '/pages/index.html', 1000);
        } else {
            ErrorHandler.handleApiError(result);
        }
    } catch (error) {
        ErrorHandler.showToast('No se pudo conectar con el servidor', 'error');
    } finally {
        ErrorHandler.setLoading(document.getElementById('loginBtn'), false);
    }
}


// Initialize
function initLoginPage() {
    // Check if already authenticated
    if (Auth.isAuthenticated()) {
        window.location.href = '/pages/index.html';
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        window.location.href = '../../pages/404.html';
        return;
    }
    
    // Render components
    document.getElementById('navbar').innerHTML = Components.navbar();
    document.getElementById('footer').innerHTML = Components.footer();
    const mobileMenuContainer = document.getElementById('mobileMenu');
    mobileMenuContainer.outerHTML = `<div id="mobileMenu">${Components.mobileMenu()}</div>`;
    
    // Attach form handlers
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

initLoginPage();