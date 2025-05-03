using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;
using Microsoft.AspNetCore.Authorization;

[Authorize]
public class UserRolesController : Controller
{
    private readonly ApplicationDbContext _context;

    public UserRolesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IActionResult> Index()
    {
        return View(await _context.UserRoles.ToListAsync());
    }

    public async Task<IActionResult> Details(string id)
    {
        if (id == null) return NotFound();

        var role = await _context.UserRoles.FirstOrDefaultAsync(r => r.Name == id);
        if (role == null) return NotFound();

        return View(role);
    }

    public IActionResult Create() => View();

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(UserRole role)
    {
        if (ModelState.IsValid)
        {
            _context.Add(role);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Role created successfully.";
            return RedirectToAction(nameof(Index));
        }
        return View(role);
    }

    public async Task<IActionResult> Edit(string id)
    {
        if (id == null) return NotFound();

        var role = await _context.UserRoles.FindAsync(id);
        if (role == null) return NotFound();

        return View(role);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(string id, UserRole role)
    {
        if (id != role.Name) return NotFound();

        if (ModelState.IsValid)
        {
            _context.Update(role);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Role updated successfully.";
            return RedirectToAction(nameof(Index));
        }
        return View(role);
    }

    public async Task<IActionResult> Delete(string id)
    {
        if (id == null) return NotFound();

        var role = await _context.UserRoles.FirstOrDefaultAsync(r => r.Name == id);
        if (role == null) return NotFound();

        return View(role);
    }

    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(string id)
    {
        var role = await _context.UserRoles.FindAsync(id);
        if (role != null)
        {
            _context.UserRoles.Remove(role);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Role deleted successfully.";
        }
        return RedirectToAction(nameof(Index));
    }
}