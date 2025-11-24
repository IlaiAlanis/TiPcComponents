using API_TI.Models.dbModels;
using API_TI.Models.DTOs.CarritoDTOs;
using API_TI.Models.DTOs.DireccionDTOs;
using API_TI.Models.DTOs.PagoDTOs;

namespace API_TI.Models.DTOs.CheckoutDTOs
{
    public class Checkout
    {
        public CarritoDto Carrito { get; set; }
        public MetodoPagoDto MetodoPago { get; set; }
        public DireccionDto DireccionEnvio { get; set; }
        public decimal CostoEnvio { get; set; }
        public decimal TotalPagar => Carrito.Total + CostoEnvio;

        public int UsuarioId { get; internal set; }
    }
}
