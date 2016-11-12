using System.ComponentModel.DataAnnotations;

namespace MadBinding.Models
{
    public class ChaserVictimModel
    {
        public virtual long Id { get; set; }
        public virtual long ExternalId { get; set; }
    }
}