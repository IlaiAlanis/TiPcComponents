namespace API_TI.Models.DTOs.NotificacionDTOs
{
    public class NotificacionDto
    {
        public int IdNotificacion { get; set; }
        public string Titulo { get; set; }
        public string Mensaje { get; set; }
        public string Tipo { get; set; }
        public bool Leido { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
}
