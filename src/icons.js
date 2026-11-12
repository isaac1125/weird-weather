/**
 * Weather/cue icons: Twemoji (CC-BY 4.0).
 * Clothing layers: hybrid — Twemoji where the emoji fits, open SVG
 * (Lucide Lab / Hugeicons / Tabler, MIT/ISC) for thermal & long sleeves.
 * https://github.com/jdecked/twemoji
 */

import jacketUrl from "./assets/clothing/jacket.svg";
import longUrl from "./assets/clothing/long.svg";
import thermalUrl from "./assets/clothing/thermal.svg";
import thickUrl from "./assets/clothing/thick.svg";

const TWEMOJI_BASE =
  "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72";

function emojiImg(code, alt = "") {
  return `<img class="emoji-icon" src="${TWEMOJI_BASE}/${code}.png" alt="${alt}" width="72" height="72" decoding="async" draggable="false" />`;
}

function assetImg(url, alt = "") {
  return `<img class="emoji-icon clothing-svg" src="${url}" alt="${alt}" width="72" height="72" decoding="async" draggable="false" />`;
}

export function iconSun() {
  return emojiImg("2600", "晴朗");
}

export function iconCloudSun() {
  return emojiImg("26c5", "多雲時晴");
}

export function iconCloud() {
  return emojiImg("2601", "多雲");
}

export function iconCloudRain() {
  return emojiImg("1f327", "降雨");
}

export function iconMoon() {
  return emojiImg("1f319", "夜晚");
}

export function iconFog() {
  return emojiImg("1f32b", "有霧");
}

export function iconThunder() {
  return emojiImg("26c8", "雷雨");
}

export function iconShirt() {
  return emojiImg("1f455", "短袖");
}

/** 發熱衣 — Hugeicons long-sleeve shirt (MIT). */
export function iconThermal() {
  return assetImg(thermalUrl, "發熱衣");
}

/** 薄長袖 — Lucide Lab shirt-long-sleeve (ISC). */
export function iconLongSleeve() {
  return assetImg(longUrl, "薄長袖");
}

/** 厚長袖 — Lucide Lab sweater (ISC). */
export function iconThickTop() {
  return assetImg(thickUrl, "厚長袖");
}

/** 薄外套 — Tabler jacket (MIT). */
export function iconLightOuter() {
  return assetImg(jacketUrl, "薄外套");
}

export function iconJacket() {
  return emojiImg("1f9e5", "棉外套");
}

/** 羽絨外套 — Twemoji coat + frost badge. */
export function iconDown() {
  return `${emojiImg("1f9e5", "羽絨外套")}<span class="emoji-badge" aria-hidden="true">${emojiImg("2744", "")}</span>`;
}

/**
 * Map clothing engine keys → icons (hybrid).
 * thermal  發熱衣   → Hugeicons long-sleeve SVG
 * tee      短袖     → 👕 Twemoji 1f455
 * breathable 透氣衣 → 👕 Twemoji 1f455
 * long     薄長袖   → Lucide Lab shirt-long-sleeve SVG
 * thick    厚長袖   → Lucide Lab sweater SVG
 * jacket / light / cardigan 薄外套 → Tabler jacket SVG
 * padded   棉外套   → 🧥 Twemoji 1f9e5
 * down     羽絨外套 → 🧥 Twemoji 1f9e5 + ❄️ 2744 badge
 */
export function clothingIcon(key) {
  switch (key) {
    case "thermal":
      return iconThermal();
    case "long":
      return iconLongSleeve();
    case "thick":
      return iconThickTop();
    case "jacket":
    case "light":
    case "cardigan":
      return iconLightOuter();
    case "padded":
      return iconJacket();
    case "down":
      return iconDown();
    case "tee":
    case "breathable":
    default:
      return iconShirt();
  }
}

export function iconUmbrella() {
  return emojiImg("2602", "雨具");
}

export function iconWind() {
  return emojiImg("1f4a8", "風力");
}

export function iconLaundry() {
  return emojiImg("1f9fa", "曬衣");
}

export function iconRun() {
  return emojiImg("1f3c3", "運動");
}

export function iconPin() {
  return emojiImg("1f4cd", "地點");
}

export function iconStable() {
  return emojiImg("2600", "天氣穩定");
}

export function weatherIcon(code, { night = false } = {}) {
  if ([0].includes(code)) return night ? iconMoon() : iconSun();
  if ([1, 2].includes(code)) return night ? iconCloud() : iconCloudSun();
  if ([3].includes(code)) return iconCloud();
  if ([45, 48].includes(code)) return iconFog();
  if ([95, 96, 99].includes(code)) return iconThunder();
  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)
  ) {
    return iconCloudRain();
  }
  return night ? iconMoon() : iconCloudSun();
}

export function weatherLabel(code) {
  const map = {
    0: "晴朗",
    1: "大致晴朗",
    2: "局部多雲",
    3: "陰天",
    45: "有霧",
    48: "霧凇",
    51: "細雨",
    53: "中度毛毛雨",
    55: "強毛毛雨",
    61: "小雨",
    63: "中雨",
    65: "大雨",
    80: "陣雨",
    81: "強陣雨",
    82: "暴雨",
    95: "雷雨",
  };
  return map[code] ?? "多雲時陰";
}
