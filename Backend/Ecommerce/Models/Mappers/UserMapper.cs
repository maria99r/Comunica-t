using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;

namespace Ecommerce.Models.Mappers;

public class UserMapper
{
    public UserDto UserToDto(User user)
    {
        return new UserDto
        {
            UserId = user.UserId,
            Name = user.Name,
            Email = user.Email,
            Address = user.Address,
            Role = user.Role
        };
    }

    public IEnumerable<UserDto> UsersToDto(IEnumerable<User> users)
    {
        return users.Select(UserToDto);
    }

}
