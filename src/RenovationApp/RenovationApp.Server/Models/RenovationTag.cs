using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class RenovationTag
    {
        [Key]
        [Column("id", TypeName = "varchar(255)")]
        [StringLength(255)]
        public string Id { get; set; } = null!;
    }
}