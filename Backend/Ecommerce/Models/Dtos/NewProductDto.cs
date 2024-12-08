namespace Ecommerce.Models.Dtos
{
    public class NewProductDto
    {
        public string Name { get; set; }
        public int Stock { get; set; }
        public int Price { get; set; }
        public string Description { get; set; }
        public CreateUpdateImageRequest Image { get; set; }

    }
}
