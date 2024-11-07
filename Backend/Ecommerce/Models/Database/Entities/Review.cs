using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Models.Database.Entities;


[Index(nameof(Id), IsUnique = true)]
public class Review
{
    public string Text { get; set; } = null!;

    public int Category { get; set; }

    public DateTime PublicationDate { get; set; }

    public int Id { get; set; }

    
    public int UserId { get; set; }

    public int ProductId { get; set; }

    [ForeignKey("ProductId")]
    public virtual Product Product { get; set; } = null!;

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
}
