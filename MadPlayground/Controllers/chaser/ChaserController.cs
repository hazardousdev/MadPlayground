using MadBinding.Models;
using MadService.Chaser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MadPlayground.Controllers.chaser
{
    public class ChaserController : Controller
    {
        private IChaserService chaserService;

        public ChaserController()
        {
            this.chaserService = VkontakteChaserService.Instance;
        }

        // GET: Chaser
        public ActionResult Victims()
        {
            return View(chaserService.GetVictims());
        }

        // GET: Chaser/Details/5
        public ActionResult Details(int id)
        {
            return View(chaserService.GetSnapshots(id));
        }

        // GET: Chaser/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Chaser/Create
        [HttpPost]
        public ActionResult Create(ChaserVictimModel model)
        {
            try
            {
                chaserService.AddVictim(model.ExternalId);

                return RedirectToAction("Victims");
            }
            catch
            {
                return View();
            }
        }

        // GET: Chaser/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Chaser/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Chaser/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Chaser/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
