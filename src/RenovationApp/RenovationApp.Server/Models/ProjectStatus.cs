using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http.HttpResults;

namespace RenovationApp.Server.Models
{
    public enum ProjectStatus
    {
        [Display(Name = "Created")]
        Created,

        [Display(Name = "In Progress")]
        InProgress,

        [Display(Name = "On Hold")]
        OnHold,

        [Display(Name = "Pending")]
        Pending,

        [Display(Name = "Completed")]
        Completed,

        [Display(Name = "Cancelled")]
        Cancelled

    }
}