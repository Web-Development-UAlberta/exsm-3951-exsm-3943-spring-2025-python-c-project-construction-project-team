using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;
using Microsoft.AspNetCore.Authorization;

[Authorize]
public class RFQController : Controller
{
    private readonly ApplicationDbContext _context;

    public RFQController(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IActionResult> Index()
    {
        var rfqs = await _context.RFQs
            .Include(r => r.Client)
            .Include(r => r.AssignedEmployee)
            .Include(r => r.RFQStatus)
            .Include(r => r.RenovationTypeNavigation)
            .ToListAsync();
        return View(rfqs);
    }

    public async Task<IActionResult> Details(int? id)
    {
        if (id == null) return NotFound();

        var rfq = await _context.RFQs
            .Include(r => r.Client)
            .Include(r => r.AssignedEmployee)
            .Include(r => r.RFQStatus)
            .Include(r => r.RenovationTypeNavigation)
            .FirstOrDefaultAsync(m => m.Id == id);
        if (rfq == null) return NotFound();

        return View(rfq);
    }

    public IActionResult Create()
    {
        ViewData["ClientId"] = new SelectList(_context.Users, "Id", "Name");
        ViewData["AssignedEmployeeId"] = new SelectList(_context.Users, "Id", "Name");
        ViewData["Status"] = new SelectList(_context.RFQStatuses, "Status", "Status");
        ViewData["RenovationType"] = new SelectList(_context.RenovationTypes, "Name", "Name");
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(RFQ rfq)
    {
        if (ModelState.IsValid)
        {
            rfq.CreatedTimestamp = DateTime.Now;
            _context.Add(rfq);
            await _context.SaveChangesAsync();
            TempData["Success"] = "RFQ created successfully.";
            return RedirectToAction(nameof(Index));
        }
        return View(rfq);
    }

    public async Task<IActionResult> Edit(int? id)
    {
        if (id == null) return NotFound();

        var rfq = await _context.RFQs.FindAsync(id);
        if (rfq == null) return NotFound();

        ViewData["ClientId"] = new SelectList(_context.Users, "Id", "Name", rfq.ClientId);
        ViewData["AssignedEmployeeId"] = new SelectList(_context.Users, "Id", "Name", rfq.AssignedEmployeeId);
        ViewData["Status"] = new SelectList(_context.RFQStatuses, "Status", "Status", rfq.Status);
        ViewData["RenovationType"] = new SelectList(_context.RenovationTypes, "Name", "Name", rfq.RenovationType);
        return View(rfq);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, RFQ rfq)
    {
        if (id != rfq.Id) return NotFound();

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(rfq);
                await _context.SaveChangesAsync();
                TempData["Success"] = "RFQ updated successfully.";
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.RFQs.Any(e => e.Id == id))
                    return NotFound();
                else throw;
            }
            return RedirectToAction(nameof(Index));
        }
        return View(rfq);
    }

    public async Task<IActionResult> Delete(int? id)
    {
        if (id == null) return NotFound();

        var rfq = await _context.RFQs
            .Include(r => r.Client)
            .Include(r => r.AssignedEmployee)
            .Include(r => r.RFQStatus)
            .Include(r => r.RenovationTypeNavigation)
            .FirstOrDefaultAsync(m => m.Id == id);
        if (rfq == null) return NotFound();

        return View(rfq);
    }

    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var rfq = await _context.RFQs.FindAsync(id);
        if (rfq != null)
        {
            _context.RFQs.Remove(rfq);
            await _context.SaveChangesAsync();
            TempData["Success"] = "RFQ deleted successfully.";
        }
        return RedirectToAction(nameof(Index));
    }
}