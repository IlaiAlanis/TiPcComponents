namespace API_TI.Models.DTOs.CheckoutDTOs
{
    public class CheckoutResultDto
    {
        public int OrdenId { get; set; }
        public string NumeroOrden { get; set; }
        public string PaymentIntentId { get; set; }
        public string ClientSecret { get; set; }
        public string PayPalOrderId { get; set; }
        public string ApprovalUrl { get; set; }
    }
}
