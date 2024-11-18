using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
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
    public async Task<Cart> GetByUserIdAsync(int id)
    {
        var cart = await _unitOfWork.CartRepository.GetCartByUserId(id);

        if (cart == null)
        {
            return null;
        }
        return cart;
    }


    // crear un nuevo carrito
    public async Task<Cart> CreateCartAsync(Cart newCart)
    {
        // comprueba si el usuario con ese id existe
        var userExists = await _unitOfWork.UserRepository.GetQueryable()
            .AnyAsync(user => user.Id == newCart.UserId);

        if (!userExists)
        {
            throw new InvalidOperationException("El usuario no existe.");
        }

        // comprueba si el usuario ya tiene un carrito
        var existingCart = await _unitOfWork.CartRepository.GetCartByUserId(newCart.UserId);

        if (existingCart != null)
        {
            throw new InvalidOperationException("El usuario ya tiene un carrito asignado.");
        }

        await _unitOfWork.CartRepository.InsertCartAsync(newCart);
        await _unitOfWork.SaveAsync();
        return newCart;
    }


}
