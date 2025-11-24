let currentStep = 1;
let cart = null;
let shippingCost = 0;
const TAX_RATE = 0.16;

async function initCheckoutPage() {
    if (!Auth.requireAuth()) return;

    document.getElementById('navbar').innerHTML = Components.navbar();
    document.getElementById('footer').innerHTML = Components.footer();
    document.getElementById('mobileMenu').outerHTML = `<div id="mobileMenu">${Components.mobileMenu()}</div>`;

    await loadCart();
    setupCardInput();
}

async function loadCart() {
    const response = await API.cart.get();
    if (response.success && response.data) {
        cart = response.data;
        if (!cart.items || cart.items.length === 0) {
            ErrorHandler.showToast('Tu carrito está vacío', 'warning');
            setTimeout(() => window.location.href = '/pages/cart.html', 2000);
            return;
        }
        renderSummary();
    } else {
        ErrorHandler.showToast('Error al cargar el carrito', 'error');
        setTimeout(() => window.location.href = '/pages/cart.html', 2000);
    }
}

function renderSummary() {
    if (!cart || !cart.items) return;

    const itemsHtml = cart.items.map(item => {
        const product = item.producto;
        const imageUrl = product.imagenUrl || 'https://via.placeholder.com/60x60?text=P';
        const price = product.precioPromocional || product.precioBase;
        return `
            <div class="flex gap-3">
                <img src="${imageUrl}" alt="${product.nombreProducto}" class="w-16 h-16 object-cover rounded"/>
                <div class="flex-1">
                    <p class="font-medium text-sm">${product.nombreProducto}</p>
                    <p class="text-xs text-gray-500">Cant: ${item.cantidad}</p>
                </div>
                <p class="font-semibold">$${(price * item.cantidad).toFixed(2)}</p>
            </div>
        `;
    }).join('');
    document.getElementById('summaryItems').innerHTML = itemsHtml;
    updateTotals();
}

function updateTotals() {
    if (!cart || !cart.items) {
        console.error('Cart not loaded');
        return;
    }
    
    const subtotal = cart.items.reduce((sum, item) => {
        const price = item.producto.precioPromocional || item.producto.precioBase;
        return sum + (price * item.cantidad);
    }, 0);

    const tax = (subtotal + shippingCost) * TAX_RATE;
    const total = subtotal + shippingCost + tax;

    document.getElementById('summarySubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summaryShipping').textContent = shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toFixed(2)}`;
    document.getElementById('summaryTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
}

function nextStep(step) {
    if (step > currentStep && !validateCurrentStep()) return;

    // Hide all content
    document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));
    
    // Reset all steps
    document.querySelectorAll('.step-item').forEach(el => {
        el.classList.remove('active');
        const circle = el.querySelector('.step-circle');
        const icon = el.querySelector('.material-icons');
        const text = el.querySelector('p');
        
        circle.classList.remove('bg-primary');
        circle.classList.add('bg-gray-300', 'dark:bg-gray-700');
        icon.classList.remove('text-white');
        icon.classList.add('text-gray-600', 'dark:text-gray-400');
        text.classList.remove('font-medium');
        text.classList.add('text-gray-500', 'dark:text-gray-400');
    });

    // Activate current step
    const stepEl = document.getElementById(`step${step}`);
    stepEl.classList.add('active');
    const circle = stepEl.querySelector('.step-circle');
    const icon = stepEl.querySelector('.material-icons');
    const text = stepEl.querySelector('p');
    
    circle.classList.remove('bg-gray-300', 'dark:bg-gray-700');
    circle.classList.add('bg-primary');
    icon.classList.remove('text-gray-600', 'dark:text-gray-400');
    icon.classList.add('text-white');
    text.classList.remove('text-gray-500', 'dark:text-gray-400');
    text.classList.add('font-medium');

    // Show content and update progress
    if (step === 1) {
        document.getElementById('shippingStep').classList.remove('hidden');
        document.getElementById('progressLine').style.width = '0%';
    } else if (step === 2) {
        document.getElementById('paymentStep').classList.remove('hidden');
        document.getElementById('progressLine').style.width = 'calc(50% - 3rem)';
    } else if (step === 3) {
        document.getElementById('reviewStep').classList.remove('hidden');
        document.getElementById('progressLine').style.width = 'calc(100% - 3rem)';
        renderReview();
    }

    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateCurrentStep() {
    if (currentStep === 1) {
        const form = document.getElementById('shippingForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }
        const shippingMethod = document.querySelector('input[name="envio"]:checked').value;
        shippingCost = shippingMethod === 'express' ? 149 : 0;
        updateTotals();
    }
    return true;
}

function renderReview() {
    const form = document.getElementById('shippingForm');
    const formData = new FormData(form);
    const shipping = `${formData.get('nombre')}, ${formData.get('calle')}, ${formData.get('ciudad')}, ${formData.get('estado')} ${formData.get('codigoPostal')}`;
    const shippingMethod = document.querySelector('input[name="envio"]:checked').value === 'express' ? 'Express (1-2 días)' : 'Estándar (3-5 días)';

    document.getElementById('reviewDetails').innerHTML = `
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h3 class="font-semibold mb-2">Dirección de Envío</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">${shipping}</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h3 class="font-semibold mb-2">Método de Envío</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">${shippingMethod}</p>
        </div>
    `;
}

async function confirmOrder() {
    const btn = document.getElementById('confirmBtn');
    ErrorHandler.setLoading(btn, true);

    const form = document.getElementById('shippingForm');
    const formData = new FormData(form);

    const orderData = {
        direccionEnvio: {
            nombre: formData.get('nombre'),
            telefono: formData.get('telefono'),
            calle: formData.get('calle'),
            ciudad: formData.get('ciudad'),
            estado: formData.get('estado'),
            codigoPostal: formData.get('codigoPostal')
        },
        metodoEnvio: document.querySelector('input[name="envio"]:checked').value,
        metodoPago: 'tarjeta'
    };

    const response = await API.orders.create(orderData);

    ErrorHandler.setLoading(btn, false);

    if (response.success) {
        window.location.href = `/pages/order-confirmation.html?order=${response.data.idOrden}`;
    } else {
        ErrorHandler.handleApiError(response);
    }
}

function switchPaymentMethod(method) {
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.classList.remove('active', 'border-primary', 'bg-primary/10');
        tab.classList.add('border-gray-300', 'dark:border-gray-600');
    });
    
    if (method === 'card') {
        document.getElementById('cardTab').classList.add('active', 'border-primary', 'bg-primary/10');
        document.getElementById('cardTab').classList.remove('border-gray-300', 'dark:border-gray-600');
        document.getElementById('cardForm').classList.remove('hidden');
        document.getElementById('paypalForm').classList.add('hidden');
    } else {
        document.getElementById('paypalTab').classList.add('active', 'border-primary', 'bg-primary/10');
        document.getElementById('paypalTab').classList.remove('border-gray-300', 'dark:border-gray-600');
        document.getElementById('cardForm').classList.add('hidden');
        document.getElementById('paypalForm').classList.remove('hidden');
    }
}

function setupCardInput() {
    const input = document.getElementById('cardNumber');
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formatted;

        const brand = document.getElementById('cardBrand');
        if (value.startsWith('4')) {
            brand.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" class="h-6"/>';
        } else if (value.startsWith('5')) {
            brand.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" class="h-6"/>';
        } else {
            brand.innerHTML = '';
        }
    });
}

initCheckoutPage();