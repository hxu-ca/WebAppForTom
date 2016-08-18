using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebAppTom.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult Client()
        {
            ViewBag.Message = "Your contact page.";
            var path = ConfigurationManager.AppSettings.Get("ServiceUrl");
            ViewBag.ServiceUrl = 
                (path.StartsWith("http")) ? 
                path : 
                string.Format("{0}://{1}{2}", HttpContext.Request.Url.Scheme, HttpContext.Request.Url.Authority, path);
            return View();
        }
    }
}