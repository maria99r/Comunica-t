using Ecommerce.Helpers;
using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;


namespace Ecommerce.Services;

public class UserService
{
    private readonly UnitOfWork _unitOfWork;
    private readonly UserMapper _userMapper;

    public UserService(UnitOfWork unitOfWork, UserMapper userMapper)
    {
        _unitOfWork = unitOfWork;
        _userMapper = userMapper;
    }

    public async Task<List<UserDto>> GetAllUsersAsync()
    {
        var users = await _unitOfWork.UserRepository.GetAllAsync();
        return _userMapper.UsersToDto(users).ToList();
    }

    public async Task<UserDto> GetByEmail(string email)
    {
        var user = await _unitOfWork.UserRepository.GetByEmail(email);
        if (user == null)
        {
            return null; // o lanzar una excepción según tu lógica
        }
        return _userMapper.UserToDto(user);
    }

    public async Task<User> LoginAsync(string email, string password)
    {
        var user = await _unitOfWork.UserRepository.GetByEmail(email);

        if (user == null || user.Password != PasswordHelper.Hash(password))
        {
            return null;
        }

        return user;
    }


    public async Task<User> RegisterAsync(RegisterDto model)
    {
        // Verifica si el usuario ya existe
        var existingUser = await GetByEmail(model.Email);
        if (existingUser != null)
        {
            throw new Exception("El usuario ya existe.");
        }

        var newUser = new User
        {
            Email = model.Email,
            Name = model.Name,
            Address = model.Address,
            Role = "Client", // Rol por defecto
            Password = PasswordHelper.Hash(model.Password)
        };

        await _unitOfWork.UserRepository.InsertUserAsync(newUser);
        await _unitOfWork.SaveAsync();

        return newUser;
    }
}
