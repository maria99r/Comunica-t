using System;
using System.Collections.Generic;

namespace Ecommerce.Models.Database.Entities;

public class Review
{
    public string Text { get; set; } = null!;

    public int Category { get; set; }

    public DateTime PublicationDate { get; set; }

    public int Id { get; set; }

    public int UserId { get; set; }

    public int ProductId { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
