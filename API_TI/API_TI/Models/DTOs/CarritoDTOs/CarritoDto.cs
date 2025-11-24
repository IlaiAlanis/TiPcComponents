namespace API_TI.Models.DTOs.CarritoDTOs
{
    public class CarritoDto
    {
        public int IdCarrito { get; set; }
        public int UsuarioId { get; set; }
        public List<CarritoItemDto> Items { get; set; }
        public List<CarritoDescuentoDto> DescuentosAplicados { get; set; }
        public decimal Subtotal { get; set; }
        public decimal DescuentoTotal { get; set; }
        public decimal ImpuestoTotal { get; set; }
        public decimal EnvioTotal { get; set; }
        public decimal Total { get; set; }
        public int TotalItems { get; set; }
    }
}
