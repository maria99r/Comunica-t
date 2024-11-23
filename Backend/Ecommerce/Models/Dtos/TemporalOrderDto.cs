using Ecommerce.Models.Database.Entities;

namespace Ecommerce.Models.Dtos;

// con el userDto

public class TemporalOrderDto
{
	public int Id { get; set; }

	public string PaymentMethod { get; set; } = null!;

	public decimal TotalPrice { get; set; }

	// tiempo de expiracion
	public DateTime ExpiresAt { get; set; }

	public int UserId { get; set; }

	public ICollection<TemporalProductOrder> TemporalProductOrder { get; set; } = new List<TemporalProductOrder>();

	public UserDto User { get; set; } = null!;
}