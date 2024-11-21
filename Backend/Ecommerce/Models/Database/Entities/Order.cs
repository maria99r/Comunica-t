using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Models.Database.Entities;

[Index(nameof(Id), IsUnique = true)]

public class Order
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public DateTime PaymentDate { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public decimal TotalPrice { get; set; }

    public int UserId { get; set; }

    public ICollection<ProductOrder> ProductOrder { get; set; } = new List<ProductOrder>();

    public virtual User User { get; set; } = null!;
}
