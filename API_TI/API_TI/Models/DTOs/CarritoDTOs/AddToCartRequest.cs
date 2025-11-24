using System.ComponentModel.DataAnnotations;

namespace API_TI.Models.DTOs.CarritoDTOs
{
    public class AddToCartRequest
    {
        [Required] public int ProductoId { get; set; }
        [Required][Range(1, 100)] public int Cantidad { get; set; }
    }
}
