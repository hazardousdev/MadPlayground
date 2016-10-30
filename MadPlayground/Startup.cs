using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MadPlayground.Startup))]
namespace MadPlayground
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
