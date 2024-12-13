﻿using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Repositories.Implementations;

public class TemporalOrderRepository : Repository<TemporalOrder, int>
{
    private readonly TemporalOrderMapper _temporalOrderMapper;


    public TemporalOrderRepository(EcommerceContext context) : base(context)
    {
        _temporalOrderMapper = new TemporalOrderMapper();
    }

    public async Task<List<TemporalOrder>> GetTemporalOrderByUser(int id)
    {
        return await GetQueryable()
            .Where(TemporalOrder => TemporalOrder.UserId == id).ToListAsync();
    }


    // obtener orden temporal segun id
    public async Task<TemporalOrder> GetTemporalOrderById(int id)
    {
        var temporalOrder = await GetQueryable()
            .Include(t => t.User)
            .Include(t => t.TemporalProductOrder)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (temporalOrder == null)
        {
            throw new InvalidOperationException("La orden temporal no se encontró para esta id.");
        }


        return temporalOrder;
    }

    public async Task<TemporalOrder> GetTemporalOrderByIdWithoutUser(int id)
    {
        var temporalOrder = await GetQueryable()
            .Include(t => t.TemporalProductOrder)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (temporalOrder == null)
        {
            throw new InvalidOperationException("La orden temporal no se encontró para esta id.");
        }


        return temporalOrder;
    }

    public async Task<IEnumerable<TemporalOrder>> GetAllOrdersAsync()
    {
        var temporalOrder = await GetQueryable()
            .Include(t => t.TemporalProductOrder)
            .ToListAsync();

        return temporalOrder;
    }

    // Crear una orden temporal DESDE EL LOCAL
    public async Task<TemporalOrder> InsertTemporalOrderLocalAsync(ProductCartDto[] cart, string paymentMethod)
    {

        // precio total
        var total = cart.Sum(pc => pc.Quantity * pc.Product.Price);


        var newTemporalOrder = new TemporalOrder
        {
            UserId = null,
            PaymentMethod = paymentMethod,
            TotalPrice = total,
            TemporalProductOrder = new List<TemporalProductOrder>(),
            ExpiresAt = DateTime.UtcNow.AddMinutes(2), // expira en 2 minutos
            Express = true
        };

        
        _context.TemporalOrder.Add(newTemporalOrder);
        await _context.SaveChangesAsync();

        // se asignan los productos
        foreach (var cartItem in cart)
        {
            var temporalProductOrder = new TemporalProductOrder
            {
                Quantity = cartItem.Quantity,
                ProductId = cartItem.Product.Id,
                TemporalOrderId = newTemporalOrder.Id 
            };
            newTemporalOrder.TemporalProductOrder.Add(temporalProductOrder);
        }

        // actualizar la orden con los productos
        _context.TemporalOrder.Update(newTemporalOrder);
        await _context.SaveChangesAsync();

        return newTemporalOrder;
    }



    // Crear una orden temporal DESDE LA BASE DE DATOS
    public async Task<TemporalOrder> InsertTemporalOrderBBDDAsync(CartDto cart, String paymentMethod)
    {
        // precio total
        var total = cart.Products.Sum(pc => pc.Quantity * pc.Product.Price);

        var newTemporalOrder = new TemporalOrder
        {
            UserId = cart.UserId,
            PaymentMethod = paymentMethod,
            TotalPrice = total,
            // pasamos los productos del carrito a la orden
            TemporalProductOrder = cart.Products.Select(pc => new TemporalProductOrder
            {
                Quantity = pc.Quantity,
                ProductId = pc.Product.Id,
                Product = null 
            }).ToList(),
            User = null,

            ExpiresAt = DateTime.UtcNow.AddMinutes(2), // expira en 2 minutos
            Express = false
        };

        var insertedTemporalOrder = await InsertAsync(newTemporalOrder);

        if (insertedTemporalOrder == null)
        {
            throw new Exception("No se pudo crear la orden temporal.");
        }

        return newTemporalOrder;
    }

}

