using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Services;

public class CartService
{
    private readonly UnitOfWork _unitOfWork;

    public CartService(UnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    // obtener carrito por id de usuario
    public async Task<CartDto> GetByUserIdAsync(int id)
    {
        var cart = await _unitOfWork.CartRepository.GetCartByUserId(id);

        if (cart == null)
        {
            await _unitOfWork.CartRepository.InsertCartAsync(id);
            await _unitOfWork.SaveAsync();
        }
        return new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
        };
    }


    // crear un nuevo carrito a partir de id de usuario
    public async Task<Cart> CreateCartAsync(int userId)
    {
        // comprueba si el usuario con ese id existe
        var userExists = await _unitOfWork.UserRepository.GetQueryable()
            .AnyAsync(user => user.Id == userId);

        if (!userExists)
        {
            throw new InvalidOperationException("El usuario no existe.");
        }

        // comprueba si el usuario ya tiene un carrito
        var cartExists = await _unitOfWork.CartRepository.GetQueryable()
            .AnyAsync(cart => cart.UserId == userId);

        if (cartExists) // Si el carrito existe, lanza una excepción
        {
            throw new InvalidOperationException("El usuario ya tiene un carrito asignado.");
        }
        // Se inserta el nuevo carrito
        return await _unitOfWork.CartRepository.InsertCartAsync(userId);

    }


}
