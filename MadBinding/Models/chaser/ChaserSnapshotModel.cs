using System;
using System.ComponentModel.DataAnnotations;

namespace MadBinding.Models
{
    public class ChaserSnapshotModel
    {
        public virtual long Id { get; set; }
        public virtual DateTime Date { get; set; }
        public virtual string RawStatus { get; set; }
        public virtual long VictimId { get; set; }
    }
}