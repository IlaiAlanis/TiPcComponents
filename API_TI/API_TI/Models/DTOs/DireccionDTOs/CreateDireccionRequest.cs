using System.ComponentModel.DataAnnotations;

namespace API_TI.Models.DTOs.DireccionDTOs
{
    public class CreateDireccionRequest
    {
        [Required] public int PaisId { get; set; }
        [Required] public int EstadoId { get; set; }
        [Required] public int CiudadId { get; set; }
        [Required] public string CodigoPostal { get; set; }
        public string Colonia { get; set; }
        [Required] public string Calle { get; set; }
        public string NumeroExterior { get; set; }
        public string NumeroInterior { get; set; }
        public string Etiqueta { get; set; }
        public string DireccionCompleta { get; set; }
        public string Referencia { get; set; }
        public bool EsDefault { get; set; }

        // Google Places
        public string PlaceId { get; set; }
        public decimal? Latitud { get; set; }
        public decimal? Longitud { get; set; }
    }
}
