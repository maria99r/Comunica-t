using Ecommerce.Helpers;
using Ecommerce.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database;

public class Seeder
{
    private readonly EcommerceContext _context;

    public Seeder (EcommerceContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        await SeedUsersAsync();
        await SeedProductAsync();

        await _context.SaveChangesAsync();
    }

    private async Task SeedUsersAsync()
    {
        User[] users = [
                new User {
                    Name = "Manolo" ,
                    Email = "manolo@gmail.com",
                    Password = PasswordHelper.Hash("123456"),
                    Address = "Su casa",
                    Role = "admin"
                }
                ,
                new User {
                    Name = "Pepa" ,
                    Email = "pepa@gmail.com",
                    Password = PasswordHelper.Hash("123456"),
                    Address = "Su casa",
                    Role = "client"
                }
            ];

        await _context.Users.AddRangeAsync(users);
    }



    private async Task SeedProductAsync()
    {
        Product[] products = [
                new Product {
                    Name = "Botones - Cuerpo Humano" ,
                    Price = 10,
                    Stock = 500,
                    Description = "Tabla con botones con vocabulario del cuerpo humano.",
                    Image = "products/botones-cuerpo.png"
                }
                ,
                new Product {
                    Name = "Tarjetas - Organizador tiempo" ,
                    Price = 15,
                    Stock = 350,
                    Description = "Tarjetas para organizar las tareas diarias.",
                    Image = "products/tarjetas-tiempo.png"
                },
                new Product {
                    Name = "LOTE 20 Tarjetas - Organizador tiempo" ,
                    Price = 350,
                    Stock = 100,
                    Description = "LOTE DE 20 - Tarjetas para organizar las tareas diarias.",
                    Image = "products/tarjetas-tiempo.png"
                },
                new Product {
                    Name = "LOTE 50 Tarjetas - Organizador tiempo" ,
                    Price = 500,
                    Stock = 100,
                    Description = "Tarjetas para organizar las tareas diarias.",
                    Image = "products/tarjetas-tiempo.png"
                },
                new Product {
                    Name = "Tarjetas - Temática" ,
                    Price = 12,
                    Stock = 250,
                    Description = "Tarjetas de tematica para niños.",
                    Image = "products/tarjetas-tematica.png"
                }
            ];

        await _context.Products.AddRangeAsync(products);
    }


}
