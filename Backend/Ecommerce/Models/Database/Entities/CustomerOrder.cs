using System;
using System.Collections.Generic;

namespace Ecommerce.Models.Database.Entities;

public class CustomerOrder
{
    public int Id { get; set; }

    public DateTime PaymentDate { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public decimal TotalPrice { get; set; }

    public string Status { get; set; } = null!;

    public int UserId { get; set; }

    public virtual User User { get; set; } = null!;
}
