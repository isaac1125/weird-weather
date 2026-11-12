# Weird Weather

台灣友善的手機優先天氣頁：針對日夜溫差給出分層穿搭建議（例如發熱衣＋厚長袖＋外套）。

穿搭規則參考 [tenki.jp 服装指数](https://tenki.jp/lite/indexes/dress/) 公開分帶（10–100）精神，以自有邏輯與 Twemoji 實作，不複製其專有素材。

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

- **穿搭優先**：首屏以分層穿搭（可含發熱衣內層、羽絨／棉／薄外套）為主，並用一句話說明早晚溫差
- **自動日夜**：依目前本地時間（日出／日落，或約 06–18）自動顯示對應時段建議，無需手動切換
- **天氣為輔**：氣溫、體感、降雨等數字縮小為輔助資訊；小時走勢預設收合
- **地區選擇**：可搜尋台灣縣市行政區，或選用目前定位；最後選擇會存在 `localStorage`
- **彩色圖示**：天氣／穿搭／生活建議圖示使用 Twemoji 彩色透明 PNG

## 穿搭圖示對應（Twemoji）

| key | 標籤 | Twemoji | code |
| --- | --- | --- | --- |
| `thermal` | 發熱衣 | 🧣 | `1f9e3` |
| `tee` / `breathable` | 短袖／透氣衣 | 👕 | `1f455` |
| `long` | 薄長袖 | 👚 | `1f45a` |
| `thick` | 厚長袖 | 👔 | `1f454` |
| `jacket` / `light` / `cardigan` | 薄外套 | 🥼 | `1f97c` |
| `padded` | 棉外套 | 🧥 | `1f9e5` |
| `down` | 羽絨外套 | 🧥＋❄️ | `1f9e5` + `2744` badge |

## 資料

- 天氣／預報：Open-Meteo Forecast API（免金鑰）
- 空氣品質：Open-Meteo Air Quality API（免金鑰）
- 地理搜尋：Open-Meteo Geocoding API（台灣優先）+ 內建縣市區清單
- 逆地理編碼：BigDataCloud reverse geocoding
- 定位拒絕或 API 失敗時自動改用臺北市大安區示範資料

## 圖示授權

Emoji 圖示來自 **[Twemoji](https://github.com/jdecked/twemoji)**（[CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)）。
依授權條款需標示來源；本專案透過 jsDelivr CDN 載入 `jdecked/twemoji` 72×72 PNG 資產。
