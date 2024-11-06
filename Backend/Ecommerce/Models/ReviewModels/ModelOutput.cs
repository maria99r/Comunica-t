using Microsoft.ML.Data;

namespace Ecommerce.Models.ReviewModels
{
    public class ModelOutput
    {
        [ColumnName(@"text")]
        public string Text { get; set; }

        [ColumnName(@"category")]
        public string Category { get; set; }

        [ColumnName(@"PredictedCategory")]
        public string PredictedCategory { get; set; }

        [ColumnName(@"Score")]
        public float[] Score { get; set; }
    }
}
