using System.Threading;
using System.Web;

namespace MadService.Chaser
{
    public class ChaseWorker
    {
        protected IChaserService chaserService;
        protected int chaseInterval;

        public ChaseWorker(IChaserService chaserService, int chaseInterval)
        {
            this.chaserService = chaserService;
            this.chaseInterval = chaseInterval;
        }

        public void StartChasing()
        {
            Thread newThread = new Thread(new ThreadStart(Run));
            newThread.Start();
        }

        private void Run()
        {
            while (true)
            {
                chaserService.Chase();
                Thread.Sleep(chaseInterval);
            }
        }
    }
}
