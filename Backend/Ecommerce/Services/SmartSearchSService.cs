namespace Ecommerce.Services
{
    using Ecommerce.Models.Database;
    using Ecommerce.Models.Database.Entities;
    using F23.StringSimilarity;
    using F23.StringSimilarity.Interfaces;
    using System.Globalization;
    using System.Text;

    public class SmartSearchService
    {
        private const double THRESHOLD = 0.75;

        private static List<string> ITEMS = new List<string>();

        private readonly UnitOfWork _unitOfWork;

        private readonly INormalizedStringSimilarity _stringSimilarityComparer;

        public SmartSearchService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _stringSimilarityComparer = new JaroWinkler();
        }

        public async Task GetProductName()
        {
            List<Product> product = await _unitOfWork.ProductRepository.GetAllProductsAsync();
            foreach (var item in product)
            {
                ITEMS.Add(item.Name);
            }
        }

        public async Task<IEnumerable<string>> Search(string query)
        {
            IEnumerable<string> result;
            await GetProductName();

            if (string.IsNullOrWhiteSpace(query))
            {
                result = ITEMS;
            }

            else
            {
                string[] queryKeys = GetKeys(ClearText(query));

                List<string> matches = new List<string>();

                foreach (string item in ITEMS)
                {

                    string[] itemKeys = GetKeys(ClearText(item));

                    if (IsMatch(queryKeys, itemKeys))
                    {
                        matches.Add(item);
                    }
                }

                result = matches;
            }

            return result;
        }

        private bool IsMatch(string[] queryKeys, string[] itemKeys)
        {
            bool isMatch = false;

            for (int i = 0; !isMatch && i < itemKeys.Length; i++)
            {
                string itemKey = itemKeys[i];

                for (int j = 0; !isMatch && j < queryKeys.Length; j++)
                {
                    string queryKey = queryKeys[j];

                    isMatch = IsMatch(itemKey, queryKey);
                }
            }

            return isMatch;
        }
        private bool IsMatch(string itemKey, string queryKey)
        {
            return itemKey == queryKey
                || itemKey.Contains(queryKey)
                || _stringSimilarityComparer.Similarity(itemKey, queryKey) >= THRESHOLD;
        }

        private string[] GetKeys(string query)
        {
            return query.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        }

        private string ClearText(string text)
        {
            return RemoveDiacritics(text.ToLower());
        }


        private string RemoveDiacritics(string text)
        {
            string normalizedString = text.Normalize(NormalizationForm.FormD);
            StringBuilder stringBuilder = new StringBuilder(normalizedString.Length);

            for (int i = 0; i < normalizedString.Length; i++)
            {
                char c = normalizedString[i];
                UnicodeCategory unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }
    }
}
