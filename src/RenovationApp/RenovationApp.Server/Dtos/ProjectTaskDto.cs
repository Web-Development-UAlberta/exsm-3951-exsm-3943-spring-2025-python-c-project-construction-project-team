using System;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.DTOs
{
    public class ProjectTaskDTO
    {
        public int Id { get; set; }
        public DateTime CreatedTimestamp { get; set; }
        public int? ProjectId { get; set; }
        public int? UserId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
    }
}