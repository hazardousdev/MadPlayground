using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MadPlayground.Models
{
    public class MadChatterModel
    {
        [Required]
        [Display(Name = "Message")]
        public string Message { get; set; }
    }
}