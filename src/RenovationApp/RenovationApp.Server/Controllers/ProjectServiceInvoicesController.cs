using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Controllers
{
    public class ProjectServiceInvoicesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProjectServiceInvoicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var invoices = await _context.ProjectServiceInvoices
                .Include(i => i.ProjectService)
                .ToListAsync();
            return View(invoices);
        }

        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();
            var invoice = await _context.ProjectServiceInvoices
                .Include(i => i.ProjectService)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (invoice == null) return NotFound();
            return View(invoice);
        }

        public IActionResult Create()
        {
            ViewData["ProjectServices"] = new SelectList(_context.ProjectServices, "Id", "Id");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ProjectServiceInvoice invoice)
        {
            if (ModelState.IsValid)
            {
                _context.Add(invoice);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(invoice);
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();
            var invoice = await _context.ProjectServiceInvoices.FindAsync(id);
            if (invoice == null) return NotFound();
            return View(invoice);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, ProjectServiceInvoice invoice)
        {
            if (id != invoice.Id) return NotFound();
            if (ModelState.IsValid)
            {
                _context.Update(invoice);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(invoice);
        }

        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();
            var invoice = await _context.ProjectServiceInvoices.FindAsync(id);
            if (invoice == null) return NotFound();
            return View(invoice);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var invoice = await _context.ProjectServiceInvoices.FindAsync(id);
            if (invoice != null)
                _context.ProjectServiceInvoices.Remove(invoice);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
    }
}