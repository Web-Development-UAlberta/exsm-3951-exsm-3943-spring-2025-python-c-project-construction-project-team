using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;
using Microsoft.AspNetCore.Authorization;

[Authorize]
public class RFQStatusController : Controller
{
    private readonly ApplicationDbContext _context;

    public RFQStatusController(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IActionResult> Index()
    {
        return View(await _context.RFQStatuses.ToListAsync());
    }

    public async Task<IActionResult> Details(string id)
    {
        if (id == null) return NotFound();

        var status = await _context.RFQStatuses.FirstOrDefaultAsync(s => s.Status == id);
        if (status == null) return NotFound();

        return View(status);
    }

    public IActionResult Create() => View();

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(RFQStatus status)
    {
        if (ModelState.IsValid)
        {
            _context.Add(status);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Status created successfully.";
            return RedirectToAction(nameof(Index));
        }
        return View(status);
    }

    public async Task<IActionResult> Edit(string id)
    {
        if (id == null) return NotFound();

        var status = await _context.RFQStatuses.FindAsync(id);
        if (status == null) return NotFound();

        return View(status);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(string id, RFQStatus status)
    {
        if (id != status.Status) return NotFound();

        if (ModelState.IsValid)
        {
            _context.Update(status);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Status updated successfully.";
            return RedirectToAction(nameof(Index));
        }
        return View(status);
    }

    public async Task<IActionResult> Delete(string id)
    {
        if (id == null) return NotFound();

        var status = await _context.RFQStatuses.FirstOrDefaultAsync(s => s.Status == id);
        if (status == null) return NotFound();

        return View(status);
    }

    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(string id)
    {
        var status = await _context.RFQStatuses.FindAsync(id);
        if (status != null)
        {
            _context.RFQStatuses.Remove(status);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Status deleted successfully.";
        }
        return RedirectToAction(nameof(Index));
    }
}