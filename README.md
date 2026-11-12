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

## 資料

- 天氣／預報：Open-Meteo Forecast API（免金鑰）
- 空氣品質：Open-Meteo Air Quality API（免金鑰）
- 逆地理編碼：Open-Meteo reverse geocoding
- 定位拒絕或 API 失敗時自動改用臺北市大安區示範資料
