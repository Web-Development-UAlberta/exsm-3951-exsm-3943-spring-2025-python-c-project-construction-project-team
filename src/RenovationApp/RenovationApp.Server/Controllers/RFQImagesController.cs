
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;
using Microsoft.AspNetCore.Authorization;

[Authorize]
public class RFQImagesController : Controller
{
    private readonly ApplicationDbContext _context;

    public RFQImagesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IActionResult> Index()
    {
        var images = await _context.RFQImages.Include(r => r.RFQ).ToListAsync();
        return View(images);
    }

    public async Task<IActionResult> Details(int? id)
    {
        if (id == null) return NotFound();

        var image = await _context.RFQImages.Include(r => r.RFQ)
                        .FirstOrDefaultAsync(m => m.Id == id);
        if (image == null) return NotFound();

        return View(image);
    }

    public IActionResult Create()
    {
        ViewData["RFQId"] = new SelectList(_context.RFQs, "Id", "Id");
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(RFQImage image)
    {
        if (ModelState.IsValid)
        {
            image.UploadedTimestamp = DateTime.Now;
            _context.Add(image);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Image uploaded successfully.";
            return RedirectToAction(nameof(Index));
        }
        return View(image);
    }

    public async Task<IActionResult> Edit(int? id)
    {
        if (id == null) return NotFound();

        var image = await _context.RFQImages.FindAsync(id);
        if (image == null) return NotFound();

        ViewData["RFQId"] = new SelectList(_context.RFQs, "Id", "Id", image.RFQId);
        return View(image);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, RFQImage image)
    {
        if (id != image.Id) return NotFound();

        if (ModelState.IsValid)
        {
            _context.Update(image);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Image updated successfully.";
            return RedirectToAction(nameof(Index));
        }
        return View(image);
    }

    public async Task<IActionResult> Delete(int? id)
    {
        if (id == null) return NotFound();

        var image = await _context.RFQImages.Include(r => r.RFQ)
                        .FirstOrDefaultAsync(m => m.Id == id);
        if (image == null) return NotFound();

        return View(image);
    }

    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var image = await _context.RFQImages.FindAsync(id);
        if (image != null)
        {
            _context.RFQImages.Remove(image);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Image deleted successfully.";
        }
        return RedirectToAction(nameof(Index));
    }
}