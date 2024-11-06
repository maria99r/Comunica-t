using Microsoft.ML.Data;

namespace Ecommerce.Models.ReviewModels
{
    public class ModelInput
    {
        [LoadColumn(0)]
        [ColumnName(@"text")]

        public string Text { get; set; }

        [LoadColumn(1)]
        [ColumnName(@"category")]

        public int Category {  get; set; }

    }
}
