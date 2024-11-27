using Ecommerce.Models.Database.Entities;

namespace Ecommerce.Models.Dtos;

public class UserDto
{
    public int UserId { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string Role { get; set; } = null!;

    //public Cart Cart { get; set; };

    //public ICollection<Order> Orders { get; set; } = new List<Order>();

    //public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
