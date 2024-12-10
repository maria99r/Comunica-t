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

    public async Task<UserDto> GetUserByEmailAsync(string email)
    {
        var user = await _unitOfWork.UserRepository.GetUserByEmail(email);
        if (user == null)
        {
            return null;
        }
        return _userMapper.UserToDto(user);
    }

    public async Task<UserDto> GetUserByIdAsync(int id)
    {
        var user = await _unitOfWork.UserRepository.GetUserById(id);

        if (user == null)
        {
            return null;
        }

        return _userMapper.UserToDto(user);
    }

    public async Task<User> GetUserByIdAsyncNoDto(int id)
    {
        var user = await _unitOfWork.UserRepository.GetUserById(id);

        if (user == null)
        {
            return null;
        }

        return user;
    }

    public async Task<User> LoginAsync(string email, string password)
    {
        var user = await _unitOfWork.UserRepository.GetUserByEmail(email);

        if (user == null || user.Password != PasswordHelper.Hash(password))
        {
            return null;
        }

        return user;
    }

    public async Task<User> RegisterAsync(RegisterDto model)
    {
        // Verifica si el usuario ya existe
        var existingUser = await GetUserByEmailAsync(model.Email);
        if (existingUser != null)
        {
            throw new Exception("El usuario ya existe.");
        }

        var newUser = new User
        {
            Email = model.Email,
            Name = model.Name,
            Address = model.Address,
            Role = "User", // Rol por defecto
            Password = PasswordHelper.Hash(model.Password)
        };

        await _unitOfWork.UserRepository.InsertUserAsync(newUser);
        await _unitOfWork.SaveAsync();
        // crea carrito para usuario
        await _unitOfWork.CartRepository.InsertCartAsync(newUser.Id);
        await _unitOfWork.SaveAsync();

        return newUser;
    }

    // Modificar los datos del usuario
    public async Task ModifyUserAsync(UserProfileDto userDto)
    {
        var existingUser = await _unitOfWork.UserRepository.GetUserById(userDto.UserId);

        if (existingUser != null)
        {
            Console.WriteLine("El usuario con ID ", userDto.UserId, " no existe.");
        }

        Console.WriteLine("ID del usuario: " + existingUser.Id);

        if (!string.IsNullOrEmpty(userDto.Name) && existingUser.Name != userDto.Name)
        {
            existingUser.Name = userDto.Name;
        }

        if (!string.IsNullOrEmpty(userDto.Email) && existingUser.Email != userDto.Email)
        {
            existingUser.Email = userDto.Email;
        }

        if (!string.IsNullOrEmpty(userDto.Password) && existingUser.Password != PasswordHelper.Hash(userDto.Password))
        {
            existingUser.Password = PasswordHelper.Hash(userDto.Password);
        }

        if (!string.IsNullOrEmpty(userDto.Address) && existingUser.Address != userDto.Address)
        {
            existingUser.Address = userDto.Address;
        }

        await UpdateUser(existingUser);
        Console.WriteLine("Usuario actualizado correctamente.", existingUser);
        await _unitOfWork.SaveAsync();
    }


    // Modificar el rol del usuario
    public async Task ModifyUserRoleAsync(int userId, string newRole)
    {
        var existingUser = await _unitOfWork.UserRepository.GetUserById(userId);

        if (existingUser != null)
        {
            Console.WriteLine("El usuario con ID ", userId, " no existe.");
        }

        Console.WriteLine("ID del usuario: " + existingUser.Id);

        if (!string.IsNullOrEmpty(newRole))
        {
            existingUser.Role = newRole;
        }

        await UpdateUser(existingUser);
        await _unitOfWork.SaveAsync();
    }

    // Modificar contraseña del usuario
    public async Task ModifyPasswordAsync(int userId, string newPassword)
    {
        var existingUser = await _unitOfWork.UserRepository.GetUserById(userId);

        if (existingUser != null)
        {
            Console.WriteLine("El usuario con ID ", userId, " no existe.");
        }

        if (!string.IsNullOrEmpty(newPassword) && existingUser.Password != PasswordHelper.Hash(newPassword))
        {
            existingUser.Password = PasswordHelper.Hash(newPassword);
        }
        else
        {
            Console.WriteLine("La contraseña es nula o similar a la anterior");
        }

        await UpdateUser(existingUser);
        Console.WriteLine("Usuario actualizado correctamente.", existingUser);
        await _unitOfWork.SaveAsync();
    }



    // Eliminar usuario
    public async Task DeleteUserAsync(int userId)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);

        if (user == null)
        {
            throw new InvalidOperationException("El usuario no existe.");
        }

        _unitOfWork.UserRepository.DeleteUser(user);
        await _unitOfWork.SaveAsync();
    }
    public async Task UpdateUser(User user)
    {
        _unitOfWork.UserRepository.Update(user);
        await _unitOfWork.SaveAsync();
    }
}
