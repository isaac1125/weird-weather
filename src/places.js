/** Taiwan city / district catalog + last-place persistence. */

import { FALLBACK_PLACE } from "./weather.js";

export const STORAGE_KEY = "weird-weather:place";

/** Curated Taiwan locations (Traditional Chinese labels). */
export const TAIWAN_PLACES = [
  { name: "臺北市中正區", latitude: 25.0324, longitude: 121.5183 },
  { name: "臺北市大同區", latitude: 25.0634, longitude: 121.513 },
  { name: "臺北市中山區", latitude: 25.0685, longitude: 121.533 },
  { name: "臺北市松山區", latitude: 25.05, longitude: 121.577 },
  { name: "臺北市大安區", latitude: 25.0267, longitude: 121.5436 },
  { name: "臺北市萬華區", latitude: 25.033, longitude: 121.497 },
  { name: "臺北市信義區", latitude: 25.033, longitude: 121.5654 },
  { name: "臺北市士林區", latitude: 25.092, longitude: 121.524 },
  { name: "臺北市北投區", latitude: 25.132, longitude: 121.501 },
  { name: "臺北市內湖區", latitude: 25.083, longitude: 121.59 },
  { name: "臺北市南港區", latitude: 25.055, longitude: 121.606 },
  { name: "臺北市文山區", latitude: 24.989, longitude: 121.57 },
  { name: "新北市板橋區", latitude: 25.011, longitude: 121.462 },
  { name: "新北市三重區", latitude: 25.062, longitude: 121.487 },
  { name: "新北市中和區", latitude: 24.999, longitude: 121.499 },
  { name: "新北市永和區", latitude: 25.007, longitude: 121.515 },
  { name: "新北市新莊區", latitude: 25.036, longitude: 121.452 },
  { name: "新北市新店區", latitude: 24.967, longitude: 121.542 },
  { name: "新北市樹林區", latitude: 24.991, longitude: 121.425 },
  { name: "新北市鶯歌區", latitude: 24.955, longitude: 121.353 },
  { name: "新北市三峽區", latitude: 24.934, longitude: 121.369 },
  { name: "新北市淡水區", latitude: 25.169, longitude: 121.441 },
  { name: "新北市汐止區", latitude: 25.068, longitude: 121.658 },
  { name: "新北市瑞芳區", latitude: 25.109, longitude: 121.806 },
  { name: "新北市土城區", latitude: 24.973, longitude: 121.443 },
  { name: "新北市蘆洲區", latitude: 25.085, longitude: 121.474 },
  { name: "新北市五股區", latitude: 25.083, longitude: 121.438 },
  { name: "新北市泰山區", latitude: 25.06, longitude: 121.43 },
  { name: "新北市林口區", latitude: 25.077, longitude: 121.388 },
  { name: "新北市深坑區", latitude: 25.002, longitude: 121.616 },
  { name: "新北市石碇區", latitude: 24.991, longitude: 121.658 },
  { name: "新北市坪林區", latitude: 24.936, longitude: 121.711 },
  { name: "新北市烏來區", latitude: 24.866, longitude: 121.551 },
  { name: "基隆市中正區", latitude: 25.135, longitude: 121.774 },
  { name: "基隆市暖暖區", latitude: 25.101, longitude: 121.737 },
  { name: "桃園市桃園區", latitude: 24.993, longitude: 121.301 },
  { name: "桃園市中壢區", latitude: 24.954, longitude: 121.225 },
  { name: "桃園市平鎮區", latitude: 24.921, longitude: 121.216 },
  { name: "桃園市八德區", latitude: 24.95, longitude: 121.284 },
  { name: "桃園市楊梅區", latitude: 24.908, longitude: 121.146 },
  { name: "桃園市蘆竹區", latitude: 25.05, longitude: 121.292 },
  { name: "桃園市大溪區", latitude: 24.881, longitude: 121.287 },
  { name: "桃園市龍潭區", latitude: 24.864, longitude: 121.217 },
  { name: "桃園市龜山區", latitude: 25.02, longitude: 121.365 },
  { name: "桃園市大園區", latitude: 25.064, longitude: 121.199 },
  { name: "桃園市觀音區", latitude: 25.036, longitude: 121.082 },
  { name: "新竹市東區", latitude: 24.792, longitude: 120.994 },
  { name: "新竹市北區", latitude: 24.807, longitude: 120.968 },
  { name: "新竹市香山區", latitude: 24.771, longitude: 120.96 },
  { name: "新竹縣竹北市", latitude: 24.839, longitude: 121.01 },
  { name: "新竹縣湖口鄉", latitude: 24.902, longitude: 121.045 },
  { name: "新竹縣新埔鎮", latitude: 24.827, longitude: 121.072 },
  { name: "新竹縣關西鎮", latitude: 24.792, longitude: 121.177 },
  { name: "苗栗市", latitude: 24.56, longitude: 120.821 },
  { name: "苗栗縣竹南鎮", latitude: 24.687, longitude: 120.874 },
  { name: "苗栗縣頭份市", latitude: 24.689, longitude: 120.906 },
  { name: "臺中市中區", latitude: 24.142, longitude: 120.68 },
  { name: "臺中市東區", latitude: 24.137, longitude: 120.697 },
  { name: "臺中市西區", latitude: 24.143, longitude: 120.666 },
  { name: "臺中市南區", latitude: 24.121, longitude: 120.664 },
  { name: "臺中市北區", latitude: 24.158, longitude: 120.683 },
  { name: "臺中市西屯區", latitude: 24.183, longitude: 120.64 },
  { name: "臺中市南屯區", latitude: 24.141, longitude: 120.638 },
  { name: "臺中市北屯區", latitude: 24.182, longitude: 120.697 },
  { name: "臺中市豐原區", latitude: 24.252, longitude: 120.72 },
  { name: "臺中市大里區", latitude: 24.099, longitude: 120.678 },
  { name: "臺中市太平區", latitude: 24.125, longitude: 120.721 },
  { name: "臺中市清水區", latitude: 24.269, longitude: 120.571 },
  { name: "臺中市沙鹿區", latitude: 24.234, longitude: 120.564 },
  { name: "彰化市", latitude: 24.081, longitude: 120.538 },
  { name: "彰化縣員林市", latitude: 23.959, longitude: 120.575 },
  { name: "彰化縣鹿港鎮", latitude: 24.057, longitude: 120.435 },
  { name: "南投市", latitude: 23.906, longitude: 120.685 },
  { name: "南投縣埔里鎮", latitude: 23.967, longitude: 120.968 },
  { name: "南投縣魚池鄉", latitude: 23.896, longitude: 120.94 },
  { name: "雲林縣斗六市", latitude: 23.712, longitude: 120.544 },
  { name: "雲林縣虎尾鎮", latitude: 23.708, longitude: 120.433 },
  { name: "嘉義市東區", latitude: 23.482, longitude: 120.454 },
  { name: "嘉義市西區", latitude: 23.479, longitude: 120.425 },
  { name: "嘉義縣太保市", latitude: 23.459, longitude: 120.333 },
  { name: "臺南市中西區", latitude: 22.992, longitude: 120.205 },
  { name: "臺南市東區", latitude: 22.982, longitude: 120.225 },
  { name: "臺南市南區", latitude: 22.961, longitude: 120.188 },
  { name: "臺南市北區", latitude: 23.01, longitude: 120.207 },
  { name: "臺南市安平區", latitude: 22.999, longitude: 120.165 },
  { name: "臺南市安南區", latitude: 23.048, longitude: 120.186 },
  { name: "臺南市永康區", latitude: 23.026, longitude: 120.257 },
  { name: "臺南市新營區", latitude: 23.31, longitude: 120.317 },
  { name: "高雄市新興區", latitude: 22.63, longitude: 120.31 },
  { name: "高雄市前金區", latitude: 22.627, longitude: 120.295 },
  { name: "高雄市苓雅區", latitude: 22.622, longitude: 120.314 },
  { name: "高雄市鹽埕區", latitude: 22.625, longitude: 120.284 },
  { name: "高雄市鼓山區", latitude: 22.64, longitude: 120.28 },
  { name: "高雄市三民區", latitude: 22.65, longitude: 120.31 },
  { name: "高雄市左營區", latitude: 22.688, longitude: 120.295 },
  { name: "高雄市楠梓區", latitude: 22.727, longitude: 120.328 },
  { name: "高雄市前鎮區", latitude: 22.594, longitude: 120.315 },
  { name: "高雄市小港區", latitude: 22.565, longitude: 120.358 },
  { name: "高雄市鳳山區", latitude: 22.627, longitude: 120.357 },
  { name: "高雄市岡山區", latitude: 22.797, longitude: 120.296 },
  { name: "屏東市", latitude: 22.682, longitude: 120.488 },
  { name: "屏東縣恆春鎮", latitude: 22.004, longitude: 120.744 },
  { name: "宜蘭市", latitude: 24.75, longitude: 121.753 },
  { name: "宜蘭縣羅東鎮", latitude: 24.677, longitude: 121.77 },
  { name: "宜蘭縣頭城鎮", latitude: 24.859, longitude: 121.823 },
  { name: "花蓮市", latitude: 23.987, longitude: 121.601 },
  { name: "花蓮縣吉安鄉", latitude: 23.973, longitude: 121.568 },
  { name: "臺東市", latitude: 22.755, longitude: 121.145 },
  { name: "澎湖縣馬公市", latitude: 23.566, longitude: 119.579 },
  { name: "金門縣金城鎮", latitude: 24.434, longitude: 118.317 },
  { name: "連江縣南竿鄉", latitude: 26.16, longitude: 119.93 },
];

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";

function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/台/g, "臺")
    .replace(/\s+/g, "");
}

/** Map occasional English admin2 from Open-Meteo to Traditional Chinese. */
const EN_ADMIN2 = {
  changhua: "彰化縣",
  nantou: "南投縣",
  yunlin: "雲林縣",
  chiayi: "嘉義縣",
  pingtung: "屏東縣",
  yilan: "宜蘭縣",
  hualien: "花蓮縣",
  taitung: "臺東縣",
  miaoli: "苗栗縣",
  hsinchu: "新竹縣",
  penghu: "澎湖縣",
  kinmen: "金門縣",
  lienchiang: "連江縣",
  taipei: "臺北市",
  "new taipei": "新北市",
  taoyuan: "桃園市",
  taichung: "臺中市",
  tainan: "臺南市",
  kaohsiung: "高雄市",
  keelung: "基隆市",
};

/** Open-Meteo often labels counties under "臺灣省 or 台湾省" / "中国台北" — drop those. */
function isNoiseAdminLabel(text) {
  const t = String(text || "").trim();
  if (!t) return true;
  if (/\bor\b/i.test(t)) return true;
  if (/[台臺]灣省/.test(t)) return true;
  if (/中國?台[北灣]|中国台[北湾]/.test(t)) return true;
  return false;
}

function localizeAdminLabel(text) {
  const t = String(text || "").trim();
  if (!t) return "";
  if (/^[\x00-\x7F]+$/.test(t)) {
    return EN_ADMIN2[t.toLowerCase()] || "";
  }
  return t;
}

function toTraditionalLabel(text) {
  return String(text || "")
    .replace(/台/g, "臺")
    .replace(/湾/g, "灣")
    .replace(/\s+/g, "");
}

/**
 * Build a Taiwan place label without province noise.
 * Prefer 縣市 + 鄉鎮市區 (admin2 + admin3).
 */
export function formatTaiwanPlaceName(result) {
  const candidates = [];
  for (const key of ["admin1", "admin2", "admin3"]) {
    const raw = result?.[key];
    if (!raw || isNoiseAdminLabel(raw)) continue;
    const localized = localizeAdminLabel(raw);
    if (!localized) continue;
    candidates.push(toTraditionalLabel(localized));
  }
  const placeName = toTraditionalLabel(result?.name || "");
  if (
    placeName &&
    !candidates.some(
      (p) => p === placeName || p.includes(placeName) || placeName.includes(p)
    )
  ) {
    candidates.push(placeName);
  }

  const unique = [];
  for (const part of candidates) {
    if (!part || unique.includes(part)) continue;
    // Skip if this part is already fully contained in a previous part
    if (unique.some((u) => u.includes(part))) continue;
    unique.push(part);
  }

  let label = unique.join("");
  label = label
    .replace(/[台臺]灣省/g, "")
    .replace(/中國?臺[北灣]/g, "");
  return label || placeName || "臺灣";
}

export function loadSavedPlace() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const place = JSON.parse(raw);
    if (
      place &&
      typeof place.name === "string" &&
      typeof place.latitude === "number" &&
      typeof place.longitude === "number"
    ) {
      // Clean older saves that still contain Open-Meteo province noise
      place.name = toTraditionalLabel(place.name)
        .replace(/[台臺]灣省(?:\s*or\s*[台臺]湾省)?/gi, "")
        .replace(/[台臺]湾省/g, "")
        .replace(/中國?臺[北灣]/g, "");
      return place;
    }
  } catch {
    /* ignore corrupt storage */
  }
  return null;
}

export function savePlace(place) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
    })
  );
}

export function searchLocalPlaces(query, limit = 12) {
  const q = normalize(query);
  if (!q) {
    return TAIWAN_PLACES.slice(0, limit);
  }
  const scored = [];
  for (const place of TAIWAN_PLACES) {
    const name = normalize(place.name);
    if (!name.includes(q) && !q.includes(name)) continue;
    const score = name.startsWith(q) ? 0 : name.indexOf(q);
    scored.push({ place, score });
  }
  scored.sort((a, b) => a.score - b.score || a.place.name.localeCompare(b.place.name, "zh-Hant"));
  return scored.slice(0, limit).map((s) => s.place);
}

/** Open-Meteo geocoding, Taiwan-first; falls back to local list. */
export async function searchPlaces(query, limit = 12) {
  const local = searchLocalPlaces(query, limit);
  const q = String(query || "").trim();
  if (q.length < 2) return local;

  try {
    const url = new URL(GEOCODE_URL);
    url.searchParams.set("name", q);
    url.searchParams.set("count", String(limit));
    url.searchParams.set("language", "zh");
    url.searchParams.set("format", "json");
    const res = await fetch(url);
    if (!res.ok) return local;
    const data = await res.json();
    const remote = (data.results || [])
      .filter((r) => r.country_code === "TW" || r.country === "Taiwan")
      .map((r) => ({
        name: formatTaiwanPlaceName(r),
        latitude: r.latitude,
        longitude: r.longitude,
      }));

    const seen = new Set();
    const merged = [];
    for (const place of [...local, ...remote]) {
      const key = `${normalize(place.name)}|${place.latitude.toFixed(3)}|${place.longitude.toFixed(3)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(place);
      if (merged.length >= limit) break;
    }
    return merged.length ? merged : local;
  } catch {
    return local;
  }
}

export function defaultPlace() {
  return { ...FALLBACK_PLACE };
}
