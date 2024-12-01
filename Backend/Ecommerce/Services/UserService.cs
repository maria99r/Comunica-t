﻿using Ecommerce.Controllers;
using Ecommerce.Helpers;
using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Microsoft.AspNetCore.Mvc;


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
            Role = "Client", // Rol por defecto
            Password = PasswordHelper.Hash(model.Password)
        };

        await _unitOfWork.UserRepository.InsertUserAsync(newUser);
        await _unitOfWork.SaveAsync();

        return newUser;
    }
    
    // Modificar los datos del usuario
    public async Task ModifyUserAsync(int userId, string newName, string newEmail, string newPassword, string newAddress, string newRole)
    {
        var existingUser = await _unitOfWork.UserRepository.GetUserById(userId);

        if (existingUser != null)
        {
            Console.WriteLine("El usuario con ID ", userId, " no existe.");
        }

        Console.WriteLine("ID del usuario: " + existingUser.Id);

        // Evitar que usuarios no administradores cambien su propio rol
        if (existingUser.Role != "Admin" && existingUser.Id == userId && newRole != existingUser.Role)
        {
            throw new UnauthorizedAccessException("No tienes permiso para cambiar tu propio rol.");
        }

        if (!string.IsNullOrEmpty(newName))
        {
            existingUser.Name = newName;
        }

        if (!string.IsNullOrEmpty(newEmail))
        {
            existingUser.Email = newEmail;
        }

        if (!string.IsNullOrEmpty(newPassword))
        {
            existingUser.Password = newPassword;
        }

        if (!string.IsNullOrEmpty(newRole))
        {
            existingUser.Address = newAddress;
        }

        if (!string.IsNullOrEmpty(newRole) && existingUser.Role == "Admin")
        {
            existingUser.Role = newRole;
        }

        await UpdateUser(existingUser);
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
