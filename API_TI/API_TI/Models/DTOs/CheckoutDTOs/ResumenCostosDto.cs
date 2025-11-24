namespace API_TI.Models.DTOs.CheckoutDTOs
{
    public class ResumenCostosDto
    {
        public decimal Subtotal { get; set; }
        public decimal DescuentoTotal { get; set; }
        public decimal SubtotalConDescuento { get; set; }
        public decimal Impuesto { get; set; }
        public decimal Envio { get; set; }
        public decimal Total { get; set; }
    }
}
