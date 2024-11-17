using Ecommerce.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database;


public class EcommerceContext : DbContext
{

    private const string DATABASE_PATH = "Ecommerce.db";

    // Tablas
    public DbSet<Cart> Cart { get; set; }

    public DbSet<CustomerOrder> CustomerOrder { get; set; }

    public DbSet<Product> Product { get; set; }

    public DbSet<ProductCart> ProductCart { get; set; }

    public DbSet<ProductOrder> ProductOrder { get; set; }

    public DbSet<Review> Review { get; set; }

    public DbSet<User> User { get; set; }

    // Crea archivo SQLite
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        string basedir = AppDomain.CurrentDomain.BaseDirectory;
        optionsBuilder.UseSqlite($"DataSource={basedir}{DATABASE_PATH}");
    }

}