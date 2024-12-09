using Ecommerce.Helpers;
using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;

namespace Ecommerce.Services
{
    public class ImageService
    {
        private const string IMAGES_FOLDER = "products";

        private readonly UnitOfWork _unitOfWork;

        public ImageService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<ICollection<Image>> GetAllAsync()
        {
            return _unitOfWork.ImageRepository.GetAllAsync();
        }

        public Task<Image> GetAsync(int id)
        {
            return _unitOfWork.ImageRepository.GetByIdAsync(id);
        }

        public async Task<Image> InsertImageAsync(CreateUpdateImageRequest image)
        {
            string relativePath = $"{IMAGES_FOLDER}/{Guid.NewGuid()}_{image.File.FileName}";

            Image newImage = new Image
            {
                Name = image.Name,
                Path = relativePath
            };

            await _unitOfWork.ImageRepository.InsertAsync(newImage);

            if (await _unitOfWork.SaveAsync())
            {
                await StoreImageAsync(relativePath, image.File);
            }

            return newImage;
        }

        public async Task<Image> UpdateAsync(int id, CreateUpdateImageRequest image)
        {
            Image entity = await _unitOfWork.ImageRepository.GetByIdAsync(id);
            entity.Name = image.Name;

            _unitOfWork.ImageRepository.Update(entity);

            if (await _unitOfWork.SaveAsync() && image.File != null)
            {
                await StoreImageAsync(entity.Path, image.File);
            }

            return entity;
        }

        public async Task DeleteAsync(int id)
        {
            Image image = await _unitOfWork.ImageRepository.GetByIdAsync(id);
            await _unitOfWork.ImageRepository.Delete(image);

            await _unitOfWork.SaveAsync();
        }

        private async Task StoreImageAsync(string relativePath, IFormFile file)
        {
            using Stream stream = file.OpenReadStream();

            await FileHelper.SaveAsync(stream, relativePath);
        }
    }
}