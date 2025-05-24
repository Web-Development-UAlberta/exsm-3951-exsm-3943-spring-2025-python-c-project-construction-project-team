using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RenovationApp.Server.Dtos
{
    public class ProjectCommentDTOs
    {
        public class ProjectCommentDTO
        {
            required public string Comment { get; set; }

        }
    }
}
