using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;


namespace Ecommerce.Models.Database.Entities;

[Index(nameof(Id), IsUnique = true)]
public class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int Price { get; set; }

    public int Stock { get; set; }

    public string Description { get; set; } = null!;

    public string Image { get; set; } = null!;

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
