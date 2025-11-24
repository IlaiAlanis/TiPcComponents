namespace API_TI.Models.DTOs.AdminDTOs
{
    public class TopProductDto
    {
        public int ProductoId { get; set; }
        public string Nombre { get; set; }
        public int CantidadVendida { get; set; }
        public decimal TotalVentas { get; set; }
    }
}
