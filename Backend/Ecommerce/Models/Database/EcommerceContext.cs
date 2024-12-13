using Ecommerce.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database;


public class EcommerceContext : DbContext
{

    private const string DATABASE_PATH = "Ecommerce.db";

    // Tablas
    public DbSet<Image> Images { get; set; }
    public DbSet<Cart> Cart { get; set; }

    public DbSet<Order> Order { get; set; }

    public DbSet<TemporalOrder> TemporalOrder { get; set; }

    public DbSet<Product> Product { get; set; }

    public DbSet<ProductCart> ProductCart { get; set; }

    public DbSet<TemporalProductOrder> TemporalProductOrder { get; set; }

    public DbSet<ProductOrder> ProductOrder { get; set; }

    public DbSet<Review> Review { get; set; }

    public DbSet<User> User { get; set; }


    // Crea archivo SQLite
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        string basedir = AppDomain.CurrentDomain.BaseDirectory;

        // aqui especifica si usa sqlite o mysql en produccion
#if DEBUG
        optionsBuilder.UseSqlite($"DataSource={basedir}{DATABASE_PATH}");

#else
        string connection = Environment.GetEnvironmentVariable("DATABASE");
        optionsBuilder.UseMySql(connection, ServerVersion.AutoDetect(connection));

#endif

    }
}