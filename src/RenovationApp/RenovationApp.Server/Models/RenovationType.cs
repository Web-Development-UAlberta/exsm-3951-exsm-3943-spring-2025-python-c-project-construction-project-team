using System.ComponentModel.DataAnnotations;

namespace RenovationApp.Server.Models
{
    public enum RenovationType
    {
        [Display(Name = "Kitchen Remodels")]
        KitchenRemodels,

        [Display(Name = "Bathroom Renovations")]
        BathroomRenovations,

        [Display(Name = "Basement Finishing")]
        BasementFinishing,

        [Display(Name = "Home Additions")]
        HomeAdditions
    }
}