using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Services;

public class ProductCartService
{
    private readonly UnitOfWork _unitOfWork;
    private readonly ProductCartMapper _productCartMapper;

    public ProductCartService(UnitOfWork unitOfWork, ProductCartMapper productCartMapper)
    {
        _unitOfWork = unitOfWork;
        _productCartMapper = productCartMapper;
    }

    // añadir producto al carrito
    public async Task AddProductToCartAsync(ProductCartDto productCartDto)
    {
        // comprueba si existe el carrito
        var cartExists = await _unitOfWork.CartRepository.GetQueryable()
        .AnyAsync(c => c.Id == productCartDto.CartId);
        
        if (!cartExists)
        {
            throw new InvalidOperationException("El carrito no existe.");
        }

        var productCart = _productCartMapper.ProductCartDtoToEntity(productCartDto);

        await _unitOfWork.ProductCartRepository.AddProductToCartAsync(productCart);
        await _unitOfWork.SaveAsync();
    }

    // Eliminar producto del carrito
    public async Task DeleteProductFromCartAsync(int cartId, int productId)
    {
        var productCart = await _unitOfWork.ProductCartRepository.GetProductInCartAsync(cartId, productId);

        if (productCart == null)
        {
            throw new InvalidOperationException("El producto no se encuentra en el carrito.");
        }

        _unitOfWork.ProductCartRepository.DeleteProductFromCartAsync(productCart);
        await _unitOfWork.SaveAsync();
    }



    // modificar la cantidad de un producto en el carrito
    public async Task UpdateProductQuantityAsync(int userId, int productId, int newQuantity)
    {
        // comprueba que exista el carrito
        var existingCart = await _unitOfWork.CartRepository.GetCartDtoByUserId(userId)
            ?? throw new InvalidOperationException("El carrito no existe.");

        Console.WriteLine("ID del carrito: " + existingCart.Id);

        // comprueba si existe el producto
        var productCart = await _unitOfWork.ProductCartRepository.GetProductInCartAsync(existingCart.Id, productId)
            ?? throw new InvalidOperationException("Producto no encontrado en el carrito.");

        Console.WriteLine("Cantidad NO actualizada del producto: " + productCart.Quantity);

        // actualiza la cantidad
        productCart.Quantity = newQuantity;
        await UpdateProduct(productCart);

        // si al actualizar la cantidad es menor o igual a 0, se elimina
        if (productCart.Quantity <= 0)
        {
            _unitOfWork.ProductCartRepository.DeleteProductFromCartAsync(productCart);
        }

        await _unitOfWork.SaveAsync();
        Console.WriteLine("Cantidad actualizada del producto: " + productCart.Quantity);
    }


    // obtener productos de un carrito por su id
    public async Task<List<ProductCart>> GetProductByCartAsync(int id)
    {
        return await _unitOfWork.ProductCartRepository.GetProductsByCart(id);
    }

    public async Task UpdateProduct(ProductCart productCart)
    {
        _unitOfWork.ProductCartRepository.Update(productCart);
        await _unitOfWork.SaveAsync();
    }
}
