using RenovationApp.Server.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RenovationApp.Server.Dtos
{
    public class RFQImageDTOs
    {
        public class GetImageDTOs
        {
            public int Id { get; set; }
            public string? FileName { get; set; }
            public DateTime UploadedAt { get; set; }
            public string? ImageUri { get; set; }
        }
    }
}
