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
                    Name = "María" ,
                    Email = "maria@gmail.com",
                    Password = PasswordHelper.Hash("123456"),
                    Address = "Su casa",
                    Role = "Admin",
                    Cart = new Cart()
                },
                new User {
                    Name = "Rocío" ,
                    Email = "rocio@gmail.com",
                    Password = PasswordHelper.Hash("123456"),
                    Address = "Su casa",
                    Role = "Admin",
                    Cart = new Cart()
                },
                new User {
                    Name = "David" ,
                    Email = "david@gmail.com",
                    Password = PasswordHelper.Hash("123456"),
                    Address = "Su casa",
                    Role = "User",
                    Cart = new Cart()
                },
                new User {
                    Name = "Agustín" ,
                    Email = "agustin@gmail.com",
                    Password = PasswordHelper.Hash("123456"),
                    Address = "Su casa",
                    Role = "User",
                    Cart = new Cart()
                },
                new User {
                    Name = "Miguel" ,
                    Email = "miguel@gmail.com",
                    Password = PasswordHelper.Hash("123456"),
                    Address = "Su casa",
                    Role = "User",
                    Cart = new Cart()
                }
            ];

        await _context.User.AddRangeAsync(users);
    }

    private async Task SeedProductAsync()
    {
        Product[] products = [
                new Product {
                    Name = "Visualizador baño ocupado" ,
                    Price = 1999,
                    Stock = 24,
                    Description = "Colocación: Colocar el dispositivo con el sensor de ultrasonido pegado en la pared encima de la cisterna del WC. Colocar el dispositivo con la pantalla TFT en la puerta del baño por la parte exterior.\r\nFuncionamiento: cuando algún usuario está usando el WC, la pantalla exterior se ilumina en rojo, indicando que el baño esta ocupado, en cualquier otro momento la pantalla exterior está iluminada en verde, indicando que se puede entrar al baño.\r\nAlimentación: conector USB de carga. Posibilidad de enchufarlo o powerbank.\r\nPosibilidad de adquirir una parte por separado (debe ser programado por personal especialista)\r\n",
                    Image = "products/visualizadorbañoocupado.jpg"
                },
                new Product {
                    Name = "Organizador de tareas" ,
                    Price = 2499,
                    Stock = 47,
                    Description = "Dispositivo portátil de sobremesa. \r\nDisponible también en formato pared.\r\nFuncionamiento: el maestro y/o tutor dispone las tareas en orden en los soportes de tarjetas, para que el usuario las realice. El usuario cuando va a realizar la primera tarea la coge de su soporte y la pone en el dispositivo lector. El dispositivo emite un sonido \"leyendo la tarea\". En ese momento el usuario empieza a realizar la tarea. Cuando termina la misma, la coge y la introduce en el depósito de tareas. Así sucesivamente con las demás.\r\nAlimentación:4 pilas AA \r\nPosibilidad de ampliar tarjetas con pictogramas distintos bajo petición.\r\nPosibilidad de pedir soporte de tarjeta.\r\n",
                    Image = "products/organizador.jpg"
                },
                new Product {
                    Name = "Pantalla TFT - Repuesto" ,
                    Price = 499,
                    Stock = 120,
                    Description = "Pantalla TFT de repuesto para el visualizador de baño ocupado. Para su funcionamiento necesita dispositivo sensor ultrasonido.",
                    Image = "products/repuestos-visualizador/pantallatft.jpg"
                },
                new Product {
                    Name = "Sensor ultrasonido - Repuesto" ,
                    Price = 699,
                    Stock = 256,
                    Description = "Sensor ultrasonido de repuesto para el visualizador de baño ocupado. Para su funcionamiento necesita dispositivo pantalla TFT asociada.",
                    Image = "products/repuestos-visualizador/sensorultrasonido.jpg"
                },
                new Product {
                    Name = "Depósito tarjetas - Repuesto" ,
                    Price = 399,
                    Stock = 187,
                    Description = "Depósito de tarjetas de repuesto para el organizador de tareas. Cuando el usuario termine la tarea, puede introducir la tarjeta en el depósito.",
                    Image = "products/repuestos-organizador/deposito.jpg"
                },
                new Product {
                    Name = "Dispositivo lector - Repuesto" ,
                    Price = 599,
                    Stock = 0,
                    Description = "Dispositivo lector de repuesto para el organizador de tareas.",
                    Image = "products/repuestos-organizador/lector.jpg"
                },
                new Product {
                    Name = "MicroSD grabada - Repuesto" ,
                    Price = 899,
                    Stock = 199,
                    Description = "MicroSD de repuesto con audios para el organizador de tareas.",
                    Image = "products/repuestos-organizador/microsd.jpg"
                },
                new Product {
                    Name = "Soporte - Repuesto" ,
                    Price = 499,
                    Stock = 84,
                    Description = "Soporte de repuesto para el organizador de tareas.",
                    Image = "products/repuestos-organizador/soporte.jpg"
                },
                new Product {
                    Name = "Pictogramas - Repuesto" ,
                    Price = 999,
                    Stock = 234,
                    Description = "Lote de tarjetas con pictogramas de repuesto para el organizador de tareas.",
                    Image = "products/repuestos-organizador/tarjetas.jpg"
                }
            ];

        await _context.Product.AddRangeAsync(products);
    }


}
