using Ecommerce.Models.Database.Entities;

namespace Ecommerce.Models.Dtos;

// con el userDto

public class OrderDto
{
	public int Id { get; set; }

	public string PaymentMethod { get; set; } = null!;

	public decimal TotalPrice { get; set; }

	public DateTime PaymentDate { get; set; }

	public int UserId { get; set; }

	public ICollection<ProductOrder> ProductsOrder { get; set; } = new List<ProductOrder>();

	public UserDto User { get; set; } = null!;
}