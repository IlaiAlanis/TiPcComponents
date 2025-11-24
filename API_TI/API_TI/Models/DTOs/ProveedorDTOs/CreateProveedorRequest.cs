using System.ComponentModel.DataAnnotations;

namespace API_TI.Models.DTOs.ProveedorDTOs
{
    public class CreateProveedorRequest
    {
        [Required] public int PaisId { get; set; }
        [Required] public int EstadoId { get; set; }
        [Required] public int CiudadId { get; set; }
        [Required] public string CodigoPostal { get; set; }
        [Required] public string NombreProveedor { get; set; }
        public string? NombreContacto { get; set; }
        [Required] public string Telefono { get; set; }
        [Required] public string Correo { get; set; }
        public string? Direccion { get; set; }
    }
}
