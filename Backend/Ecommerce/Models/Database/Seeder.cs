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

        await SeedReviewAsync();

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
                    Image = "products/visualizadorbañoocupado.webp"
                },
                new Product {
                    Name = "Organizador de tareas" ,
                    Price = 2499,
                    Stock = 47,
                    Description = "Dispositivo portátil de sobremesa. \r\nDisponible también en formato pared.\r\nFuncionamiento: el maestro y/o tutor dispone las tareas en orden en los soportes de tarjetas, para que el usuario las realice. El usuario cuando va a realizar la primera tarea la coge de su soporte y la pone en el dispositivo lector. El dispositivo emite un sonido \"leyendo la tarea\". En ese momento el usuario empieza a realizar la tarea. Cuando termina la misma, la coge y la introduce en el depósito de tareas. Así sucesivamente con las demás.\r\nAlimentación:4 pilas AA \r\nPosibilidad de ampliar tarjetas con pictogramas distintos bajo petición.\r\nPosibilidad de pedir soporte de tarjeta.\r\n",
                    Image = "products/organizador.webp"
                },
                new Product {
                    Name = "Pantalla TFT - Repuesto" ,
                    Price = 499,
                    Stock = 120,
                    Description = "Pantalla TFT de repuesto para el visualizador de baño ocupado. Para su funcionamiento necesita dispositivo sensor ultrasonido.",
                    Image = "products/repuestos-visualizador/pantallatft.webp"
                },
                new Product {
                    Name = "Sensor ultrasonido - Repuesto" ,
                    Price = 699,
                    Stock = 256,
                    Description = "Sensor ultrasonido de repuesto para el visualizador de baño ocupado. Para su funcionamiento necesita dispositivo pantalla TFT asociada.",
                    Image = "products/repuestos-visualizador/sensorultrasonido.webp"
                },
                new Product {
                    Name = "Depósito tarjetas - Repuesto" ,
                    Price = 399,
                    Stock = 187,
                    Description = "Depósito de tarjetas de repuesto para el organizador de tareas. Cuando el usuario termine la tarea, puede introducir la tarjeta en el depósito.",
                    Image = "products/repuestos-organizador/deposito.webp"
                },
                new Product {
                    Name = "Dispositivo lector - Repuesto" ,
                    Price = 599,
                    Stock = 0,
                    Description = "Dispositivo lector de repuesto para el organizador de tareas.",
                    Image = "products/repuestos-organizador/lector.webp"
                },
                new Product {
                    Name = "MicroSD grabada - Repuesto" ,
                    Price = 899,
                    Stock = 199,
                    Description = "MicroSD de repuesto con audios para el organizador de tareas.",
                    Image = "products/repuestos-organizador/microsd.webp"
                },
                new Product {
                    Name = "Soporte - Repuesto" ,
                    Price = 499,
                    Stock = 84,
                    Description = "Soporte de repuesto para el organizador de tareas.",
                    Image = "products/repuestos-organizador/soporte.webp"
                },
                new Product {
                    Name = "Pictogramas - Repuesto" ,
                    Price = 999,
                    Stock = 234,
                    Description = "Lote de tarjetas con pictogramas de repuesto para el organizador de tareas.",
                    Image = "products/repuestos-organizador/tarjetas.webp"
                }
            ];

        await _context.Product.AddRangeAsync(products);
    }


    private async Task SeedReviewAsync()
    {
        Review[] reviews = [
               new Review {
                    Text = "Un producto fantástico para fomentar la autonomía de los niños. El detector de baño ha sido una gran ayuda para mi hijo. Ahora puede usar el baño de forma independiente, y nosotros sabemos si está ocupado o no sin invadir su privacidad. El sistema es muy intuitivo y no intrusivo. Además, el diseño espequeño y encaja perfectamente en cualquier baño. ¡Altamente recomendado!",
                    Label = 1,
                    PublicationDate = DateTime.UtcNow,
                    UserId = 1,
                    ProductId = 1
                },
                new Review {
                    Text = "¡Un cambio de vida para nuestro centro! Este detector ha eliminado muchas de las preocupaciones que teníamos al monitorear la seguridad de nuestros alumnos mientras usan el baño. La señal clara en el exterior nos da tranquilidad y también les enseña sobre límites personales y autonomía. Muy fácil de instalar y usar.",
                    Label = 1,
                    PublicationDate = DateTime.UtcNow.AddDays(-6).AddHours(-3).AddMinutes(5),
                    UserId = 3,
                    ProductId = 1
                },
                new Review {
                    Text = "¡Increíble herramienta para organizar el día a día! Mi hija se siente mucho más segura al saber qué tareas tiene que realizar y en qué orden. Las tarjetas con audio le dan instrucciones claras y el sonido que celebra cuando completa una tarea la motiva muchísimo. Este panel ha sido fundamental para ayudarnos a estructurar las rutinas diarias. ¡Lo recomendamos al 100%!",
                    Label = 1,
                    PublicationDate = DateTime.UtcNow.AddDays(-15).AddHours(4).AddMinutes(12),
                    UserId = 2,
                    ProductId = 1
                },
                new Review {
                    Text = "Un producto innovador que entiende las necesidades de los niños autistas. El panel organizador ha ayudado a mi hijo a ser más independiente y a entender mejor el concepto de inicio y finalización de tareas. Los sonidos que reproducen las tarjetas lo mantienen motivado y concentrado. Estamos encantados.",
                    Label = 1,
                    PublicationDate = DateTime.UtcNow.AddDays(-30).AddHours(-7).AddMinutes(20),
                    UserId = 5,
                    ProductId = 1
                },
                new Review {
                    Text = "Nuestro equipo docente está impresionado con los resultados del panel organizador de tareas y los pictogramas. Los estudiantes han demostrado mayor autonomía y una mejor comprensión de sus rutinas diarias gracias a las tarjetas interactivas. Es increíble ver cómo se motivan al escuchar el sonido al completar una tarea. Además, el diseño permite que cada alumno personalice su panel, lo que refuerza su sentido de logro y organización.",
                    Label = 1,
                    PublicationDate = DateTime.UtcNow.AddDays(-20).AddHours(-10).AddMinutes(32),
                    UserId = 1,
                    ProductId = 9
                },
                new Review {
                    Text = "La instalación del detector de baño en nuestras instalaciones ha marcado una gran diferencia. Antes, era difícil monitorear a los estudiantes sin invadir su espacio personal, pero ahora contamos con un sistema claro y confiable que indica si el baño está ocupado. Los alumnos con autismo se han adaptado rápidamente a este dispositivo, y el diseño accesible facilita su uso para todos. Es una inversión que realmente mejora la experiencia escolar.",
                    Label = 1,
                    PublicationDate = DateTime.UtcNow.AddDays(-18).AddMinutes(-5),
                    UserId = 4,
                    ProductId = 3
                },
                new Review {
                    Text = "En nuestro colegio, este detector de baño ha sido una gran solución para mejorar la autonomía de nuestros alumnos y fomentar el respeto por su privacidad. Ahora, los niños pueden usar el baño de forma más independiente y los profesores saben cuándo está ocupado sin interrumpir. Es una herramienta sencilla pero muy efectiva, y ha sido muy bien aceptada tanto por los alumnos como por el personal. ¡Definitivamente vamos a instalar más unidades!",
                    Label = 1,
                    PublicationDate = DateTime.UtcNow.AddDays(-1).AddHours(-4).AddMinutes(8),
                    UserId = 2,
                    ProductId = 3
                },
                new Review {
                    Text = "Hemos incorporado varios paneles organizadores en nuestras aulas de apoyo y los resultados han sido excepcionales. Los estudiantes, especialmente aquellos con autismo, ahora tienen una herramienta clara y estructurada para gestionar sus actividades. El audio y los sonidos son muy efectivos para mantener su atención y motivación. Tanto los niños como los profesores han notado un gran avance en la independencia y la facilidad para completar tareas. ¡Es un recurso indispensable para cualquier centro educativo inclusivo!",
                    Label = 1,
                    PublicationDate = DateTime.UtcNow.AddDays(-3).AddHours(-4).AddMinutes(16),
                    UserId = 1,
                    ProductId = 8
                }
           ];

        await _context.Review.AddRangeAsync(reviews);
    }

}
