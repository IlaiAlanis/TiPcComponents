using System.ComponentModel.DataAnnotations;

namespace API_TI.Models.DTOs.CarritoDTOs
{
    public class UpdateCartItemRequest
    {
        [Required][Range(1, 100)] public int Cantidad { get; set; }
    }
}
