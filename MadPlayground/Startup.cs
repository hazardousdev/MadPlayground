using MadService.Chaser;
using Microsoft.Owin;
using Owin;
using System.Web;
using System.Web.UI;

[assembly: OwinStartupAttribute(typeof(MadBinding.Startup))]
namespace MadBinding
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            var chaser = new ChaseWorker(VkontakteChaserService.Instance, 10000*60);
            chaser.StartChasing();
        }
    }
}
