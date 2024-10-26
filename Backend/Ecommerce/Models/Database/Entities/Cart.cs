using System;
using System.Collections.Generic;

namespace Ecommerce.Models.Database.Entities;

public partial class Cart
{
    public int CartId { get; set; }

    public int UserId { get; set; }

    public virtual User User { get; set; } = null!;
}
