using System.ComponentModel.DataAnnotations;

namespace API_TI.Models.DTOs.CheckoutDTOs
{
    public class ConfirmCheckoutRequest
    {
        [Required] public int DireccionEnvioId { get; set; }
        [Required] public string MetodoPago { get; set; } // "stripe" or "paypal"
        public string PaymentIntentId { get; set; } // For Stripe
        public string PayPalOrderId { get; set; } // For PayPal

    }
}
