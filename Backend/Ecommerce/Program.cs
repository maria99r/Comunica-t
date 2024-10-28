using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Database.Repositories.Interfaces;

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

// Permite CORS
app.UseCors("AllowAllOrigins");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
