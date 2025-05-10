namespace RenovationApp.Server.DTOs
{
    public class ProjectCommunicationDto
    {
        public int Id { get; set; }

        public DateTime CreatedTimestamp { get; set; }

        public string Message { get; set; } = string.Empty;

        public int ProjectId { get; set; }
    }
}
