using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Entities;

[Index(nameof(Email), IsUnique=true)]
[Index(nameof(Id), IsUnique = true)]
public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string Role { get; set; } = null!;

    // Reseñas del usuario
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

    // Pedidos del usuario
    public ICollection<CustomerOrder> CustomerOrders { get; set; } = new List<CustomerOrder>();

    // Carrito del usuario
    public Cart Cart { get; set; } = null!;

}
