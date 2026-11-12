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
- **天氣為輔**：氣溫、體感、降雨等數字縮小為輔助資訊；每小時走勢預設收合
- **地區選擇**：可搜尋台灣縣市行政區，或選用目前定位；最後選擇會存在 `localStorage`
- **彩色圖示**：天氣與部分外套用 Twemoji；發熱衣／長袖／薄外套用開放 SVG（混用）

## 穿搭圖示對應（混用）

| key | 標籤 | 圖示 | 來源 |
| --- | --- | --- | --- |
| `thermal` | 發熱衣 | 長袖上衣 SVG | [Hugeicons](https://hugeicons.com/) `long-sleeve-shirt`（MIT） |
| `tee` / `breathable` | 短袖／透氣衣 | 👕 | Twemoji `1f455` |
| `long` | 薄長袖 | 長袖 SVG | [Lucide Lab](https://github.com/lucide-icons/lucide-lab) `shirt-long-sleeve`（ISC） |
| `thick` | 厚長袖 | 毛衣 SVG | Lucide Lab `sweater`（ISC） |
| `jacket` / `light` / `cardigan` | 薄外套 | 夾克 SVG | [Tabler Icons](https://tabler.io/icons) `jacket`（MIT） |
| `padded` | 棉外套 | 🧥 | Twemoji `1f9e5` |
| `down` | 羽絨外套 | 🧥＋❄️ | Twemoji `1f9e5` + `2744` badge |

## 資料

- 天氣／預報：Open-Meteo Forecast API（免金鑰）
- 空氣品質：Open-Meteo Air Quality API（免金鑰）
- 地理搜尋：Open-Meteo Geocoding API（台灣優先）+ 內建縣市區清單
- 逆地理編碼：BigDataCloud reverse geocoding
- 定位拒絕或 API 失敗時自動改用臺北市大安區示範資料

## 圖示授權

- **[Twemoji](https://github.com/jdecked/twemoji)**（[CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)）— 天氣與棉／羽絨外套；jsDelivr `jdecked/twemoji` 72×72 PNG
- **Hugeicons** `long-sleeve-shirt`（MIT）— 發熱衣
- **Lucide Lab** `shirt-long-sleeve`、`sweater`（ISC）— 薄／厚長袖
- **Tabler Icons** `jacket`（MIT）— 薄外套
