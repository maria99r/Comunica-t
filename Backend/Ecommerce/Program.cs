using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Database.Repositories.Interfaces;
using Ecommerce.Models.Mappers;
using Ecommerce.Models.ReviewModels;
using Ecommerce.Services;
using Microsoft.Extensions.ML;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Inyectamos el DbContext
builder.Services.AddScoped<EcommerceContext>();
builder.Services.AddScoped<UnitOfWork>();

// Inyección de todos los repositorios
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<ReviewRepository>();
builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<ProductOrderRepository>();
builder.Services.AddScoped<ProductCartRepository>();
builder.Services.AddScoped<CustomerOrderRepository>();
builder.Services.AddScoped<CartRepository>();
builder.Services.AddScoped<UserMapper>();

// Inyección de UserService
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<SmartSearchService>();

// Inyeccion de la IA
builder.Services.AddPredictionEnginePool<ModelInput, ModelOutput>()
    .FromFile("ReviewAI.mlnet");


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder.AllowAnyOrigin() // Permitir cualquier origen
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

// Configuración de autenticación
builder.Services.AddAuthentication()
    .AddJwtBearer(options =>
    {
        string key = "A8$wX#pQ3dZ7v&kB1nY!rT@9mL%j6sHf4^g2Uc5*o";

        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// wwwroot
app.UseStaticFiles();

// Permite CORS
app.UseCors("AllowAllOrigins");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// metodo para el seeder
static void SeedDataBaseAsync(IServiceProvider serviceProvider)
{
    using IServiceScope scope = serviceProvider.CreateScope();
    using EcommerceContext dbContext = scope.ServiceProvider.GetService<EcommerceContext>();

    // Si no existe la base de datos, la creamos y ejecutamos el seeder
    if (dbContext.Database.EnsureCreated())
    {
        Seeder seeder = new Seeder(dbContext);
        Task task = seeder.SeedAsync();
    }
}

SeedDataBaseAsync(app.Services);

app.Run();
