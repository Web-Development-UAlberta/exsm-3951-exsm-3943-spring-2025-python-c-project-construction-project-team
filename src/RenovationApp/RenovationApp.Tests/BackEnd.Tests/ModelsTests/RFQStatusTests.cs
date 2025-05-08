using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;
using Xunit;

public class RFQStatusTests : IDisposable
{
    private readonly ApplicationDbContext _context;

    public RFQStatusTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase("Test_RFQStatus_DB")
            .Options;

        _context = new ApplicationDbContext(options);
    }

    public void Dispose() => _context.Dispose();

    [Fact]
    public void Create_ValidStatus_SavesSuccessfully()
    {
        var status = new RFQStatus { Status = "Pending" };

        _context.RFQStatuses.Add(status);
        var result = _context.SaveChanges();

        Assert.Equal(1, result);
        Assert.Single(_context.RFQStatuses);
    }

    [Fact]
    public void Create_Status_TooLong_FailsValidation()
    {
        var status = new RFQStatus { Status = new string('A', 31) }; // Exceed limit of 30 characters

        var context = new ValidationContext(status);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(status, context, results, true);

        Assert.False(isValid);
        Assert.Contains(results, r => r.ErrorMessage!.Contains("Status cannot exceed 30 characters"));
    }

    [Fact]
    public void Delete_ExistingStatus_RemovesFromDatabase()
    {
        var status = new RFQStatus { Status = "Cancelled" };
        _context.RFQStatuses.Add(status);
        _context.SaveChanges();

        _context.RFQStatuses.Remove(status);
        _context.SaveChanges();

        Assert.Empty(_context.RFQStatuses);
    }

    [Fact]
    public void Update_Status_ChangesPersist()
    {
        var status = new RFQStatus { Status = "New" };
        _context.RFQStatuses.Add(status);
        _context.SaveChanges();

        var entry = _context.RFQStatuses.Find("New");
        entry.Status = "Updated";
        _context.SaveChanges();

        Assert.True(_context.RFQStatuses.Any(s => s.Status == "Updated"));
    }
}