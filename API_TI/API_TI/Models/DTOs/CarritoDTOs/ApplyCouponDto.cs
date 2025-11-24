using System.ComponentModel.DataAnnotations;

namespace API_TI.Models.DTOs.CarritoDTOs
{
    public class ApplyCouponDto
    {
        [Required] public string CodigoCupon { get; set; }
    }
}
