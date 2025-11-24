namespace API_TI.Models.DTOs.DireccionDTOs
{
    public class UpdateDireccionRequest
    {
        public int? PaisId { get; set; }
        public int? EstadoId { get; set; }
        public int? CiudadId { get; set; }
        public string CodigoPostal { get; set; }
        public string Colonia { get; set; }
        public string Calle { get; set; }
        public string NumeroInterior { get; set; }
        public string NumeroExterior { get; set; }
        public string Etiqueta { get; set; }
        public bool? EsDefault { get; set; }
    }
}
