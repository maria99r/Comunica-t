using System;
using System.Collections.Generic;
using Ecommerce.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database;

public partial class EcommerceContext : DbContext
{

    private const string DATABASE_PATH = "Ecommerce.db";

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        string basedir = AppDomain.CurrentDomain.BaseDirectory;
        optionsBuilder.UseSqlite($"DataSource={basedir}{DATABASE_PATH}");
    }


    public EcommerceContext()
    {
    }

    public EcommerceContext(DbContextOptions<EcommerceContext> options) : base(options)
    {
    }

    public virtual DbSet<Cart> Carts { get; set; }

    public virtual DbSet<CustomerOrder> CustomerOrders { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductCart> ProductCarts { get; set; }

    public virtual DbSet<ProductOrder> ProductOrders { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<User> Users { get; set; }




    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cart>(entity =>
        {
            entity.ToTable("Cart");

            entity.Property(e => e.CartId)
                .ValueGeneratedOnAdd()
                .HasColumnType("INTEGER")
                .HasColumnName("cart_id");
            entity.Property(e => e.UserId)
                .HasColumnType("INTEGER")
                .HasColumnName("user_id");

            entity.HasOne(d => d.User)
                .WithOne(p => p.Cart)
                .HasForeignKey<Cart>(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<CustomerOrder>(entity =>
        {
            entity.HasKey(e => e.OrderId);

            entity.ToTable("Customer_order");

            entity.Property(e => e.OrderId)
                .ValueGeneratedOnAdd()
                .HasColumnType("INTEGER")
                .HasColumnName("order_id");
            entity.Property(e => e.PaymentDate)
                .HasColumnType("DATE")
                .HasColumnName("payment_date");
            entity.Property(e => e.PaymentMethod)
                .HasColumnType("VARCHAR(50)")
                .HasColumnName("payment_method");
            entity.Property(e => e.Status)
                .HasColumnType("VARCHAR(50)")
                .HasColumnName("status");
            entity.Property(e => e.TotalPrice)
                .HasColumnType("INTEGER")
                .HasColumnName("total_price");
            entity.Property(e => e.UserId)
                .HasColumnType("INTEGER")
                .HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.CustomerOrders)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("Product");

            entity.Property(e => e.ProductId)
                .ValueGeneratedOnAdd()
                .HasColumnType("INTEGER")
                .HasColumnName("product_id");
            entity.Property(e => e.Description)
                .HasColumnType("VARCHAR(255)")
                .HasColumnName("description");
            entity.Property(e => e.Image)
                .HasColumnType("VARCHAR(100)")
                .HasColumnName("image");
            entity.Property(e => e.Name)
                .HasColumnType("VARCHAR(100)")
                .HasColumnName("name");
            entity.Property(e => e.Price)
                .HasColumnType("INTEGER")
                .HasColumnName("price");
            entity.Property(e => e.Stock)
                .HasColumnType("INTEGER")
                .HasColumnName("stock");
        });

        modelBuilder.Entity<ProductCart>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Product_cart");

            entity.Property(e => e.CartId)
                .HasColumnType("INTEGER")
                .HasColumnName("cart_id");
            entity.Property(e => e.ProductId)
                .HasColumnType("INTEGER")
                .HasColumnName("product_id");
            entity.Property(e => e.Quantity)
                .HasColumnType("INT")
                .HasColumnName("quantity");

            entity.HasOne(d => d.Cart).WithMany()
                .HasForeignKey(d => d.CartId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Product).WithMany()
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<ProductOrder>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Product_order");

            entity.Property(e => e.OrderId)
                .HasColumnType("INTEGER")
                .HasColumnName("order_id");
            entity.Property(e => e.ProductId)
                .HasColumnType("INTEGER")
                .HasColumnName("product_id");
            entity.Property(e => e.Quantity)
                .HasColumnType("INT")
                .HasColumnName("quantity");

            entity.HasOne(d => d.Order).WithMany()
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Product).WithMany()
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.ToTable("Review");

            entity.Property(e => e.ReviewId)
                .ValueGeneratedOnAdd()
                .HasColumnType("INTEGER")
                .HasColumnName("review_id");
            entity.Property(e => e.Category)
                .HasColumnType("INTEGER")
                .HasColumnName("category");
            entity.Property(e => e.ProductId)
                .HasColumnType("INTEGER")
                .HasColumnName("product_id");
            entity.Property(e => e.PublicationDate)
                .HasColumnType("DATE")
                .HasColumnName("publication_date");
            entity.Property(e => e.Text)
                .HasColumnType("VARCHAR(255)")
                .HasColumnName("text");
            entity.Property(e => e.UserId)
                .HasColumnType("INTEGER")
                .HasColumnName("user_id");

            entity.HasOne(d => d.Product).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.User).WithMany(p => p.Reviews)
               .HasForeignKey(d => d.UserId)
               .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("User");

            entity.HasIndex(e => e.Email, "IX_User_email").IsUnique();

            entity.HasKey(e => e.UserId);

            entity.Property(e => e.UserId)
                .ValueGeneratedOnAdd()
                .HasColumnType("INTEGER")
                .HasColumnName("user_id")
                .IsRequired();
                
            entity.Property(e => e.Address)
                .HasColumnType("VARCHAR(255)")
                .HasColumnName("address");
            entity.Property(e => e.Email)
                .HasColumnType("VARCHAR(100)")
                .HasColumnName("email");
            entity.Property(e => e.Name)
                .HasColumnType("VARCHAR(50)")
                .HasColumnName("name");
            entity.Property(e => e.Password)
                .HasColumnType("VARCHAR(100)")
                .HasColumnName("password");
            entity.Property(e => e.Role)
                .HasColumnType("VARCHAR(25)")
                .HasColumnName("role");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
