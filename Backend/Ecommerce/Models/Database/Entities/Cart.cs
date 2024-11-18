using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Models.Database.Entities;

[Index(nameof(Id), IsUnique = true)]
public class Cart
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int UserId { get; set; }

    public  User User { get; set; } = null!;
    public ICollection<ProductCart> ProductCarts { get; set; } = new List<ProductCart>();

}
