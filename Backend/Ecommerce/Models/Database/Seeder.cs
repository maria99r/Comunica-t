using Ecommerce.Helpers;
using Ecommerce.Models.Database.Entities;

namespace Ecommerce.Models.Database;

public class Seeder
{
    private readonly EcommerceContext _context;

    public Seeder(EcommerceContext context)
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
                    Role = "Admin"
                }
                ,
                new User {
                    Name = "Pepa" ,
                    Email = "pepa@gmail.com",
                    Password = PasswordHelper.Hash("123456"),
                    Address = "Su casa",
                    Role = "User"
                }
            ];

        await _context.User.AddRangeAsync(users);
    }

    private async Task SeedProductAsync()
    {
        Product[] products = [
                new Product {
                    Name = "Menú electrónico" ,
                    Price = 2500,
                    Stock = 0,
                    Description = "Carta de bar con selectores que, al pulsarlos, te indican por voz lo que estás eligiendo. Con el botón de enviar puedes comandar lo que hayas elegido.",
                    Image = "products/menu/menu-electronico.png"
                },
                new Product {
                    Name = "Menú electrónico - Modo Oscuro" ,
                    Price = 2500,
                    Stock = 47,
                    Description = "Carta de bar con selectores que, al pulsarlos, te indican por voz lo que estás eligiendo. Con el botón de enviar puedes comandar lo que hayas elegido.",
                    Image = "products/menu/menu-electronico-oscuro.png"
                },
                new Product {
                    Name = "LOTE DE 5 - Menú electrónico" ,
                    Price = 11500,
                    Stock = 120,
                    Description = "LOTE DE 5 - Carta de bar con selectores que, al pulsarlos, te indican por voz lo que estás eligiendo. Con el botón de enviar puedes comandar lo que hayas elegido.",
                    Image = "products/menu/menu-electronico.png"
                },
                new Product {
                    Name = "LOTE DE 10 - Menú electrónico - Colores mixtos" ,
                    Price = 20000,
                    Stock = 256,
                    Description = "LOTE DE 5 - Carta de bar con selectores que, al pulsarlos, te indican por voz lo que estás eligiendo. Con el botón de enviar puedes comandar lo que hayas elegido.",
                    Image = "products/menu/lote-menu.png"
                },
                new Product {
                    Name = "Selector de opciones" ,
                    Price = 1500,
                    Stock = 187,
                    Description = "Con este apoyo visual, la persona con problemas de comunicacion pueda elegir entre las dos opciones y comunicar lo que prefiere.",
                    Image = "products/selector/selector-opciones.png"
                },
                new Product {
                    Name = "Selector de opciones - Modo Oscuro" ,
                    Price = 1500,
                    Stock = 34,
                    Description = "Con este apoyo visual, la persona con problemas de comunicacion pueda elegir entre las dos opciones y comunicar lo que prefiere.",
                    Image = "products/selector/selector-opciones-oscuro.png"
                },
                new Product {
                    Name = "LOTE DE 10 - Selector de opciones" ,
                    Price = 13500,
                    Stock = 199,
                    Description = "LOTE DE 10 - Con este apoyo visual, la persona con problemas de comunicacion pueda elegir entre las dos opciones y comunicar lo que prefiere.",
                    Image = "products/selector/lote-selector.png"
                },
                new Product {
                    Name = "Calendario de rutinas" ,
                    Price = 1275,
                    Stock = 84,
                    Description = "Con una base de datos y una aplicación, a cada persona se le pondrían unas tareas durante la mañana y otras durante la noche.",
                    Image = "products/calendario/calendario-rutinas.png"
                },
                new Product {
                    Name = "LOTE DE 10 - Calendario de rutinas" ,
                    Price = 11500,
                    Stock = 234,
                    Description = "LOTE DE 10 - Con una base de datos y una aplicación, a cada persona se le pondrían unas tareas durante la mañana y otras durante la noche.",
                    Image = "products/calendario/calendario-rutinas.png"
                },
                new Product {
                    Name = "Localizador gps con Lora" ,
                    Price = 1000,
                    Stock = 67,
                    Description = "Localizador pequeño con tecnología LoRa. Permite el funcionamiento en condiciones donde no haya cobertura. " +
                    "El localizador del monitor avisa sonoramente si algún otro localizador se separa en un rádio de 2km. Además, el localizador tiene un detector de caída.",
                    Image = "products/localizador/localizador-lora.png"
                },
                new Product {
                    Name = "Localizador gps con Lora - Azul" ,
                    Price = 1000,
                    Stock = 0,
                    Description = "Localizador pequeño con tecnología LoRa. Permite el funcionamiento en condiciones donde no haya cobertura. " +
                    "El localizador del monitor avisa sonoramente si algún otro localizador se separa en un rádio de 2km. Además, el localizador tiene un detector de caída.",
                    Image = "products/localizador/localizador-lora-azul.png"
                },
                new Product {
                    Name = "Localizador gps con Lora - Morado" ,
                    Price = 1000,
                    Stock = 78,
                    Description = "Localizador pequeño con tecnología LoRa. Permite el funcionamiento en condiciones donde no haya cobertura. " +
                    "El localizador del monitor avisa sonoramente si algún otro localizador se separa en un rádio de 2km. Además, el localizador tiene un detector de caída.",
                    Image = "products/localizador/localizador-lora-morado.png"
                },
                new Product {
                    Name = "Localizador gps con Lora - Naranja" ,
                    Price = 1000,
                    Stock = 0,
                    Description = "Localizador pequeño con tecnología LoRa. Permite el funcionamiento en condiciones donde no haya cobertura. " +
                    "El localizador del monitor avisa sonoramente si algún otro localizador se separa en un rádio de 2km. Además, el localizador tiene un detector de caída.",
                    Image = "products/localizador/localizador-lora-naranja.png"
                },
                new Product {
                    Name = "Localizador gps con Lora - Verde" ,
                    Price = 1000,
                    Stock = 93,
                    Description = "Localizador pequeño con tecnología LoRa. Permite el funcionamiento en condiciones donde no haya cobertura. " +
                    "El localizador del monitor avisa sonoramente si algún otro localizador se separa en un rádio de 2km. Además, el localizador tiene un detector de caída.",
                    Image = "products/localizador/localizador-lora-verde.png"
                },
                new Product {
                    Name = "LOTE DE 10 - Localizador gps con Lora" ,
                    Price = 9000,
                    Stock = 189,
                    Description = "LOTE DE 10 - Localizador pequeño con tecnología LoRa. Permite el funcionamiento en condiciones donde no haya cobertura. " +
                    "El localizador del monitor avisa sonoramente si algún otro localizador se separa en un rádio de 2km. Además, el localizador tiene un detector de caída.",
                    Image = "products/localizador/lote-localizadores.png"
                },
                new Product {
                    Name = "LOTE DE 25 - Localizador gps con Lora" ,
                    Price = 22500,
                    Stock = 45,
                    Description = "LOTE DE 25 - Localizador pequeño con tecnología LoRa. Permite el funcionamiento en condiciones donde no haya cobertura. " +
                    "El localizador del monitor avisa sonoramente si algún otro localizador se separa en un rádio de 2km. Además, el localizador tiene un detector de caída.",
                    Image = "products/localizador/lote-localizadores.png"
                },
                new Product {
                    Name = "LOTE DE 50 - Localizador gps con Lora" ,
                    Price = 45000,
                    Stock = 110,
                    Description = "LOTE DE 50 - Localizador pequeño con tecnología LoRa. Permite el funcionamiento en condiciones donde no haya cobertura. " +
                    "El localizador del monitor avisa sonoramente si algún otro localizador se separa en un rádio de 2km. Además, el localizador tiene un detector de caída.",
                    Image = "products/localizador/lote-localizadores.png"
                },
                new Product {
                    Name = "Identificador de zonas" ,
                    Price = 3550,
                    Stock = 275,
                    Description = "Sistema auditivo pensado para ayudar a personas con autismo a identificar las diferentes áreas de su entorno mediante mensajes de audio simples.",
                    Image = "products/identificador/identificador-zonas.png"
                },
                new Product {
                    Name = "Identificador de zonas - Azul" ,
                    Price = 3550,
                    Stock = 3,
                    Description = "Sistema auditivo pensado para ayudar a personas con autismo a identificar las diferentes áreas de su entorno mediante mensajes de audio simples.",
                    Image = "products/identificador/identificador-zonas-azul.png"
                },
                new Product {
                    Name = "Identificador de zonas - Beige" ,
                    Price = 3550,
                    Stock = 176,
                    Description = "Sistema auditivo pensado para ayudar a personas con autismo a identificar las diferentes áreas de su entorno mediante mensajes de audio simples.",
                    Image = "products/identificador/identificador-zonas-beige.png"
                },
                new Product {
                    Name = "Identificador de zonas - Gris" ,
                    Price = 3550,
                    Stock = 0,
                    Description = "Sistema auditivo pensado para ayudar a personas con autismo a identificar las diferentes áreas de su entorno mediante mensajes de audio simples.",
                    Image = "products/identificador/identificador-zonas-gris.png"
                },
                new Product {
                    Name = "Identificador de zonas - Morado" ,
                    Price = 3550,
                    Stock = 0,
                    Description = "Sistema auditivo pensado para ayudar a personas con autismo a identificar las diferentes áreas de su entorno mediante mensajes de audio simples.",
                    Image = "products/identificador/identificador-zonas-morado.png"
                },
                new Product {
                    Name = "LOTE DE 5 - Identificador de zonas - Colores mixtos" ,
                    Price = 32500,
                    Stock = 29,
                    Description = "LOTE DE 5 - Sistema auditivo pensado para ayudar a personas con autismo a identificar las diferentes áreas de su entorno mediante mensajes de audio simples.",
                    Image = "products/identificador/lote-identificador.png"
                },
                new Product {
                    Name = "LOTE DE 10 - Identificador de zonas - Colores mixtos" ,
                    Price = 60000,
                    Stock = 145,
                    Description = "LOTE DE 10 - Sistema auditivo pensado para ayudar a personas con autismo a identificar las diferentes áreas de su entorno mediante mensajes de audio simples.",
                    Image = "products/identificador/lote-identificador.png"
                }
            ];

        await _context.Product.AddRangeAsync(products);
    }


}
