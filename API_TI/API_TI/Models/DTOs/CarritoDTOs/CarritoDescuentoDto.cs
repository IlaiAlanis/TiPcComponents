namespace API_TI.Models.DTOs.CarritoDTOs
{
    public class CarritoDescuentoDto
    {
        public int IdDescuento { get; set; }
        public string NombreDescuento { get; set; }
        public string TipoDescuento { get; set; }
        public decimal MontoDescuento { get; set; }
        public string CodigoCupon { get; set; }
    }
}
