# Weird Weather

台灣友善的手機優先天氣頁：針對日夜溫差給出分層穿搭建議（例如薄長袖 + 外套）。

## 執行

```bash
npm install
npm run dev
```

開啟 http://127.0.0.1:5173

建置：

```bash
npm run build
npm run preview
```

## 功能

- **穿搭建議**：依白天／夜間溫差給出台北風格分層穿著建議
- **地區選擇**：可搜尋台灣縣市行政區，或選用目前定位；最後選擇會存在 `localStorage`
- **彩色圖示**：天氣／穿搭／生活建議圖示使用 Twemoji 彩色透明 PNG

## 資料

- 天氣／預報：Open-Meteo Forecast API（免金鑰）
- 空氣品質：Open-Meteo Air Quality API（免金鑰）
- 地理搜尋：Open-Meteo Geocoding API（台灣優先）+ 內建縣市區清單
- 逆地理編碼：BigDataCloud reverse geocoding
- 定位拒絕或 API 失敗時自動改用臺北市大安區示範資料

## 圖示授權

Emoji 圖示來自 **[Twemoji](https://github.com/jdecked/twemoji)**（[CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)）。
依授權條款需標示來源；本專案透過 jsDelivr CDN 載入 `jdecked/twemoji` 72×72 PNG 資產。
