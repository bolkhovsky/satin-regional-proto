using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy.Conventions;

namespace satin_regional_proto
{
    public class Bootstrapper : Nancy.DefaultNancyBootstrapper
    {
        protected override void ConfigureConventions(Nancy.Conventions.NancyConventions nancyConventions)
        {
            base.ConfigureConventions(nancyConventions);
        }
    }
}
