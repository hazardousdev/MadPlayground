using MadBinding.Models;
using System.Collections.Generic;
using System.Web;

namespace MadService.Chaser
{
    public interface IChaserService
    {
        IEnumerable<ChaserVictimModel> GetVictims();
        IEnumerable<ChaserSnapshotModel> GetSnapshots(long victimId);
        void AddVictim(long externalId);
        void Chase();
    }
}
