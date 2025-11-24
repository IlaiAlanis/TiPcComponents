using System.ComponentModel.DataAnnotations;

namespace API_TI.Models.DTOs.CheckoutDTOs
{
    public class InitiateCheckoutRequest
    {
        [Required] public int DireccionEnvioId { get; set; }
    }
}
