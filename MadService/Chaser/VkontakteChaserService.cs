using System.Collections.Generic;
using MadBinding.Models;
using NHibernate;
using NHibernate.Criterion;
using MadBinding.Repositories;
using System;
using System.Linq;
using System.Net;
using System.IO;

namespace MadService.Chaser
{
    public class VkontakteChaserService : IChaserService
    {
        private static VkontakteChaserService instance;

        private VkontakteChaserService() {
        }

        public static VkontakteChaserService Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new VkontakteChaserService();
                }
                return instance;
            }
        }

        public void AddVictim(long externalId)
        {
            using (ISession session = NHibernateHelper.OpenSession())
            {
                using (ITransaction transaction = session.BeginTransaction())
                {
                    var victim = new ChaserVictimModel()
                    {
                        ExternalId = externalId
                    };

                    session.Save(victim);
                    transaction.Commit();
                }
            }
        }

        public IEnumerable<ChaserSnapshotModel> GetSnapshots(long victimId)
        {
            using (ISession session = NHibernateHelper.OpenSession())
            {
                var entities = session.CreateCriteria<ChaserSnapshotModel>()
                    .Add(Restrictions.Eq("VictimId", victimId))
                    .AddOrder(Order.Asc("Date"))
                    .List<ChaserSnapshotModel>();
                return entities;
            }
        }

        public IEnumerable<ChaserVictimModel> GetVictims()
        {
            using (ISession session = NHibernateHelper.OpenSession())
            {
                var entities = session.CreateCriteria<ChaserVictimModel>().List<ChaserVictimModel>();
                return entities;
            }
        }

        public void Chase()
        {
            var victims = GetVictims();
            var ids = String.Join(",", victims.Select(v => v.ExternalId).ToArray());

            string response = GET("https://api.vk.com/method/users.get", "user_ids=" + ids + "&fields=online,last_seen&v=5.60");

            var statuses = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(response);

            var newSnapshots = new List<ChaserSnapshotModel>();
            for (int i = 0; i < statuses.response.Count; i++)
            {
                var snapshot = new ChaserSnapshotModel()
                {
                    Date = DateTime.Now,
                    RawStatus = Convert.ToString(statuses.response[i]),
                    VictimId = victims.ToArray()[i].Id
                };
                newSnapshots.Add(snapshot);
            }


            using (ISession session = NHibernateHelper.OpenSession())
            {
                using (ITransaction transaction = session.BeginTransaction())
                {
                    foreach (var snapshot in newSnapshots)
                    {
                        session.Save(snapshot);
                    }
                    transaction.Commit();
                }
            }
        }

        private string GET(string Url, string Data)
        {
            WebRequest req = WebRequest.Create(Url + "?" + Data);
            WebResponse resp = req.GetResponse();
            Stream stream = resp.GetResponseStream();
            StreamReader sr = new StreamReader(stream);
            string Out = sr.ReadToEnd();
            sr.Close();
            return Out;
        }
    }
}
