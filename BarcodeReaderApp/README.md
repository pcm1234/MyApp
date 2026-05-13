# C# 1D 바코드 리더

이미지 파일에서 1D 바코드를 읽는 콘솔 프로그램입니다.

## 지원 형식
- CODE_39
- CODE_93
- CODE_128
- EAN_8
- EAN_13
- ITF
- UPC_A
- UPC_E
- CODABAR
- MSI
- PLESSEY

## 실행 방법
```bash
dotnet restore BarcodeReaderApp
dotnet run --project BarcodeReaderApp -- ./sample-barcode.png
```

## 참고
- 저해상도/흐린 이미지에서는 인식률이 낮아질 수 있습니다.
