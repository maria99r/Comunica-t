using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Services;

public class CartService
{
    private readonly UnitOfWork _unitOfWork;
    private readonly CartMapper _cartMapper;

    public CartService(UnitOfWork unitOfWork, CartMapper cartMapper)
    {
        _unitOfWork = unitOfWork;
        _cartMapper = cartMapper;
    }

    // obtener carrito por id de usuario
    public async Task<CartDto> GetByUserIdAsync(int id)
    {
        CartDto cartDto = await _unitOfWork.CartRepository.GetCartByUserId(id);

        if (cartDto == null)
        {
            return null;
        }

        return cartDto;
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
        Cart cart = await _unitOfWork.CartRepository.InsertCartAsync(userId);
        await _unitOfWork.SaveAsync();

        return cart;
    }


    // borra los productos del carrito
    public async Task<CartDto> DeleteAllProductCart(int id)
    {
        Cart cart = await _unitOfWork.CartRepository.GetCartByUserNoDto(id);

        if (cart == null)
        {
            return null;
        }

        foreach (var item in cart.ProductCarts)
        {
            await _unitOfWork.ProductCartRepository.Delete(item);
        }
        await _unitOfWork.SaveAsync();
        return _cartMapper.CartToDto(cart);
    }

    public async Task UpdateCart(Cart cart)
    {
        _unitOfWork.CartRepository.Update(cart);
        await _unitOfWork.SaveAsync();
    }
}
