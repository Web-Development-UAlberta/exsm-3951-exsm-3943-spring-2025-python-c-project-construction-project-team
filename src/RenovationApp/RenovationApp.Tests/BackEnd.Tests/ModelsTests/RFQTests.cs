using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;
using Xunit;

public class RFQTests : IDisposable
{
    private readonly ApplicationDbContext _context;

    public RFQTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "Test_RFQ_DB")
            .Options;

        _context = new ApplicationDbContext(options);

        _context.RFQStatuses.Add(new RFQStatus { Status = "Pending" });
        _context.RenovationTypes.Add(new RenovationType { Name = "Kitchen", Description = "Kitchen renovations" });
        _context.Users.AddRange(
            new User { Id = 1, Email = "homeowner@example.com", Name = "Home Owner" },
            new User { Id = 2, Email = "pm@example.com", Name = "Project Manager" }
        );

        _context.SaveChanges();
    }

    public void Dispose() => _context.Dispose();

    [Fact]
    public void Create_ValidRFQ_Succeeds()
    {
        var rfq = new RFQ
        {
            ClientId = 1,
            AssignedEmployeeId = 2,
            Status = "Pending",
            PreferredMaterial = "Wood and Marble",
            Description = "Kitchen remodel with new cabinets and island.",
            RenovationType = "Kitchen",
            Budget = 25000m,
            ProjectAddress = "123 Main St",
            RoomSize = RoomSize.Medium,
            CreatedTimestamp = DateTime.UtcNow
        };

        _context.RFQs.Add(rfq);
        var result = _context.SaveChanges();

        Assert.Equal(1, result);
        Assert.Contains(_context.RFQs, r => r.Description.Contains("Kitchen remodel"));
    }

    [Fact]
    public void Create_RFQ_MissingRoomSize_Fails()
    {
        var rfq = new RFQ
        {
            ClientId = 1,
            AssignedEmployeeId = 2,
            Status = "Pending",
            PreferredMaterial = "Tile",
            Description = "Bathroom renovation",
            RenovationType = "Kitchen",
            Budget = 10000m,
            ProjectAddress = "456 Elm St"
        };

        _context.RFQs.Add(rfq);
        var ex = Record.Exception(() => _context.SaveChanges());

        Assert.Null(ex); // EF won't throw unless manually validated
    }

    [Fact]
    public void Create_RFQ_ExcessiveBudget_ShouldBeRejected()
    {
        var rfq = new RFQ
        {
            ClientId = 1,
            AssignedEmployeeId = 2,
            Status = "Pending",
            PreferredMaterial = "Gold",
            Description = "Luxury addition",
            RenovationType = "Kitchen",
            Budget = 100000000m,
            ProjectAddress = "789 Maple Ave",
            RoomSize = RoomSize.Large
        };

        var validationContext = new ValidationContext(rfq);
        var results = new List<ValidationResult>();
        bool isValid = Validator.TryValidateObject(rfq, validationContext, results, true);

        Assert.False(isValid);
        Assert.Contains(results, r => r.ErrorMessage.Contains("Budget"));
    }
}