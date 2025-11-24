using API_TI.Models.DTOs.DireccionDTOs;

namespace API_TI.Models.DTOs.OrdenDTOs
{
    public class OrdenDto
    {
        public int IdOrden { get; set; }
        public string NumeroOrden { get; set; }
        public DateTime FechaOrden { get; set; }
        public string EstatusVenta { get; set; }
        public DireccionDto DireccionEnvio { get; set; }
        public List<OrdenItemDto> Items { get; set; }
        public List<OrdenDescuentoDto> Descuentos { get; set; }
        public decimal Subtotal { get; set; }
        public decimal DescuentoTotal { get; set; }
        public decimal ImpuestoTotal { get; set; }
        public decimal EnvioTotal { get; set; }
        public decimal Total { get; set; }
    }
}
