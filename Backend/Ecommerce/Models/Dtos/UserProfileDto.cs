namespace Ecommerce.Models.Dtos
{
    public class UserProfileDto
    {
        public int UserId { get; set; }

        public string Name { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Address { get; set; } = null!;

        public string Role { get; set; } = null!;

        public string Password { get; set; } = null!;
    }
}
