using System.ComponentModel.DataAnnotations;

namespace RenovationApp.Server.Models
{
    public enum UserRole
    {
        [Display(Name = "Home Owner")]
        HomeOwner,

        [Display(Name = "Project Manager")]
        ProjectManager,

        [Display(Name = "Administrator")]
        Admin
    }
}