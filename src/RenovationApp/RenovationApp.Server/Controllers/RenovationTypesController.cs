using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;
using Microsoft.AspNetCore.Authorization;

[Authorize]
public class RenovationTypesController : Controller
{
    private readonly ApplicationDbContext _context;

    public RenovationTypesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IActionResult> Index()
    {
        return View(await _context.RenovationTypes.ToListAsync());
    }

    public async Task<IActionResult> Details(string id)
    {
        if (id == null) return NotFound();

        var type = await _context.RenovationTypes.FirstOrDefaultAsync(m => m.Name == id);
        if (type == null) return NotFound();

        return View(type);
    }

    public IActionResult Create() => View();

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Name,Description")] RenovationType type)
    {
        if (ModelState.IsValid)
        {
            _context.Add(type);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Renovation type created successfully.";
            return RedirectToAction(nameof(Index));
        }
        return View(type);
    }

    public async Task<IActionResult> Edit(string id)
    {
        if (id == null) return NotFound();

        var type = await _context.RenovationTypes.FindAsync(id);
        if (type == null) return NotFound();

        return View(type);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(string id, [Bind("Name,Description")] RenovationType type)
    {
        if (id != type.Name) return NotFound();

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(type);
                await _context.SaveChangesAsync();
                TempData["Success"] = "Renovation type updated successfully.";
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.RenovationTypes.Any(e => e.Name == id))
                    return NotFound();
                else throw;
            }
            return RedirectToAction(nameof(Index));
        }
        return View(type);
    }

    public async Task<IActionResult> Delete(string id)
    {
        if (id == null) return NotFound();

        var type = await _context.RenovationTypes.FirstOrDefaultAsync(m => m.Name == id);
        if (type == null) return NotFound();

        return View(type);
    }

    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(string id)
    {
        var type = await _context.RenovationTypes.FindAsync(id);
        if (type != null)
        {
            _context.RenovationTypes.Remove(type);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Renovation type deleted successfully.";
        }
        return RedirectToAction(nameof(Index));
    }
}