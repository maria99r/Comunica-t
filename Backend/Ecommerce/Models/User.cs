using System;
using System.Collections.Generic;

namespace Ecommerce.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string Role { get; set; } = null!;

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual ICollection<CustomerOrder> CustomerOrders { get; set; } = new List<CustomerOrder>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
