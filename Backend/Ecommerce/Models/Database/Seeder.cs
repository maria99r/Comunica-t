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
                    Name = "Menú electrónico" ,
                    Price = 25M,
                    Stock = 300,
                    Description = "Carta de bar con selectores que, al pulsarlos, te indican por voz lo que estás eligiendo. Con el botón de enviar puedes comandar lo que hayas elegido.",
                    Image = "products/menu-electronico.png"
                },
                new Product {
                    Name = "LOTE DE 5 - Menú electrónico" ,
                    Price = 115M,
                    Stock = 300,
                    Description = "LOTE DE 5 - Carta de bar con selectores que, al pulsarlos, te indican por voz lo que estás eligiendo. Con el botón de enviar puedes comandar lo que hayas elegido.",
                    Image = "products/menu-electronico.png"
                },
                new Product {
                    Name = "Selector de opciones" ,
                    Price = 15M,
                    Stock = 300,
                    Description = "Con este apoyo visual, la persona con problemas de comunicacion pueda elegir entre las dos opciones y comunicar lo que prefiere.",
                    Image = "products/selector-opciones.png"
                },
                new Product {
                    Name = "LOTE DE 10 - Selector de opciones" ,
                    Price = 135M,
                    Stock = 300,
                    Description = "LOTE DE 10 - Con este apoyo visual, la persona con problemas de comunicacion pueda elegir entre las dos opciones y comunicar lo que prefiere.",
                    Image = "products/selector-opciones.png"
                },
                new Product {
                    Name = "Calendario de rutinas" ,
                    Price = 12.75M, // los decimales llevan el sufijo M
                    Stock = 300,
                    Description = "Con una base de datos y una aplicación, a cada persona se le pondrían unas tareas durante la mañana y otras durante la noche.",
                    Image = "products/calendario-rutinas.png"
                },
                new Product {
                    Name = "LOTE DE 10 - Calendario de rutinas" ,
                    Price = 115M, 
                    Stock = 300,
                    Description = "LOTE DE 10 - Con una base de datos y una aplicación, a cada persona se le pondrían unas tareas durante la mañana y otras durante la noche.",
                    Image = "products/calendario-rutinas.png"
                },
                new Product {
                    Name = "Localizador gps con Lora" ,
                    Price = 10M,
                    Stock = 300,
                    Description = "Localizador pequeño con tecnología LoRa. Permite el funcionamiento en condiciones donde no haya cobertura. " +
                    "El localizador del monitor avisa sonoramente si algún otro localizador se separa en un rádio de 2km. Además, el localizador tiene un detector de caída.",
                    Image = "products/localizador-lora.png"
                },
                new Product {
                    Name = "LOTE DE 10 - Localizador gps con Lora" ,
                    Price = 90M,
                    Stock = 300,
                    Description = "LOTE DE 10 - Localizador pequeño con tecnología LoRa. Permite el funcionamiento en condiciones donde no haya cobertura. " +
                    "El localizador del monitor avisa sonoramente si algún otro localizador se separa en un rádio de 2km. Además, el localizador tiene un detector de caída.",
                    Image = "products/localizador-lora.png"
                },
                new Product {
                    Name = "LOTE DE 25 - Localizador gps con Lora" ,
                    Price = 225M,
                    Stock = 300,
                    Description = "LOTE DE 25 - Localizador pequeño con tecnología LoRa. Permite el funcionamiento en condiciones donde no haya cobertura. " +
                    "El localizador del monitor avisa sonoramente si algún otro localizador se separa en un rádio de 2km. Además, el localizador tiene un detector de caída.",
                    Image = "products/localizador-lora.png"
                },
                new Product {
                    Name = "LOTE DE 50 - Localizador gps con Lora" ,
                    Price = 450M,
                    Stock = 300,
                    Description = "LOTE DE 50 - Localizador pequeño con tecnología LoRa. Permite el funcionamiento en condiciones donde no haya cobertura. " +
                    "El localizador del monitor avisa sonoramente si algún otro localizador se separa en un rádio de 2km. Además, el localizador tiene un detector de caída.",
                    Image = "products/localizador-lora.png"
                },
                new Product {
                    Name = "Identificador de zonas" ,
                    Price = 35.50M, 
                    Stock = 300,
                    Description = "Sistema auditivo pensado para ayudar a personas con autismo a identificar las diferentes áreas de su entorno mediante mensajes de audio simples.",
                    Image = "products/identificador-zonas.png"
                },
                new Product {
                    Name = "LOTE DE 10 - Identificador de zonas" ,
                    Price = 325M,
                    Stock = 300,
                    Description = "LOTE DE 10 - Sistema auditivo pensado para ayudar a personas con autismo a identificar las diferentes áreas de su entorno mediante mensajes de audio simples.",
                    Image = "products/identificador-zonas.png"
                }
            ];

        await _context.Products.AddRangeAsync(products);
    }


}
