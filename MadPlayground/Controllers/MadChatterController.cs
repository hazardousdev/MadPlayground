using MadPlayground.Models;
using MadService.MadChatter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MadPlayground.Controllers
{

    public class MadChatterController : Controller
    {
        private IMadChatterService service;

        public MadChatterController()
        {
            this.service = new MadChatterShitService();
        }

        // GET: MadChatter
        public ActionResult Index(MadChatterModel model)
        {
            if (model.Message != null)
            {
                model.Message = service.ReplaceSomeWords(model.Message);
            }

            return View(model);
        }
    }
}