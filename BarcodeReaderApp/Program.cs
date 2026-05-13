using System.Drawing;
using ZXing;
using ZXing.Common;

if (args.Length == 0)
{
    Console.WriteLine("사용법: dotnet run --project BarcodeReaderApp -- <이미지 파일 경로>");
    return;
}

var imagePath = args[0];
if (!File.Exists(imagePath))
{
    Console.WriteLine($"파일을 찾을 수 없습니다: {imagePath}");
    return;
}

try
{
    using var bitmap = (Bitmap)Image.FromFile(imagePath);

    var reader = new BarcodeReaderGeneric
    {
        AutoRotate = true,
        Options = new DecodingOptions
        {
            TryHarder = true,
            PossibleFormats = new List<BarcodeFormat>
            {
                BarcodeFormat.CODE_39,
                BarcodeFormat.CODE_93,
                BarcodeFormat.CODE_128,
                BarcodeFormat.EAN_8,
                BarcodeFormat.EAN_13,
                BarcodeFormat.ITF,
                BarcodeFormat.UPC_A,
                BarcodeFormat.UPC_E,
                BarcodeFormat.CODABAR,
                BarcodeFormat.MSI,
                BarcodeFormat.PLESSEY,
            }
        }
    };

    var result = reader.Decode(bitmap);

    if (result is null)
    {
        Console.WriteLine("바코드를 읽지 못했습니다. 더 선명한 이미지로 시도해 보세요.");
        return;
    }

    Console.WriteLine("=== 바코드 인식 결과 ===");
    Console.WriteLine($"형식: {result.BarcodeFormat}");
    Console.WriteLine($"값: {result.Text}");
}
catch (Exception ex)
{
    Console.WriteLine("처리 중 오류가 발생했습니다.");
    Console.WriteLine(ex.Message);
}
