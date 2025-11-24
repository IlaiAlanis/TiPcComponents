namespace API_TI.Models.DTOs.DireccionDTOs
{
    public class DireccionDto
    {
        public int IdDireccion { get; set; }
        public int UsuarioId { get; set; }
        public int? PaisId { get; set; }
        public int? EstadoId { get; set; }
        public int? CiudadId { get; set; }
        public string? PaisNombre { get; set; }
        public string? EstadoNombre { get; set; }
        public string? CiudadNombre { get; set; }
        public string CodigoPostal { get; set; }
        public string Colonia { get; set; }
        public string Calle { get; set; }
        public string NumeroExterior { get; set; }
        public string NumeroInterior { get; set; }
        public string Etiqueta { get; set; }
        public string? DireccionCompleta { get; set; }
        public string Referencia { get; set; }
        public bool EsDefault { get; set; }
        public decimal? Latitud { get; set; }
        public decimal? Longitud { get; set; }
    }
}
