using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Controllers
{
    public class ProjectCommentsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProjectCommentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var comments = await _context.ProjectComments
                .Include(c => c.Project)
                .Include(c => c.Employee)
                .ToListAsync();
            return View(comments);
        }

        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();
            var comment = await _context.ProjectComments
                .Include(c => c.Project)
                .Include(c => c.Employee)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (comment == null) return NotFound();
            return View(comment);
        }

        public IActionResult Create()
        {
            ViewData["Projects"] = new SelectList(_context.Projects, "Id", "Id");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ProjectComment comment)
        {
            if (ModelState.IsValid)
            {
                _context.Add(comment);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(comment);
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();
            var comment = await _context.ProjectComments.FindAsync(id);
            if (comment == null) return NotFound();
            return View(comment);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, ProjectComment comment)
        {
            if (id != comment.Id) return NotFound();
            if (ModelState.IsValid)
            {
                _context.Update(comment);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(comment);
        }

        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();
            var comment = await _context.ProjectComments.FindAsync(id);
            if (comment == null) return NotFound();
            return View(comment);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var comment = await _context.ProjectComments.FindAsync(id);
            if (comment != null)
                _context.ProjectComments.Remove(comment);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
    }
}