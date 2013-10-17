using Nancy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace satin_regional_proto
{
    public class NancyFxModule : NancyModule
    {
        public NancyFxModule()
        {
            Get["/"] = param => View["index.html"];

            Get["/datasets"] = _ =>
                {
                    var client = new WebClient();
                    var json = client.DownloadString("http://geo.solab.rshu.ru:7000/datasets/");
                    return json;
                };
        }
    }
}