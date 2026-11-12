/**
 * Colored emoji icons via Twemoji (CC-BY 4.0) — transparent PNG CDN assets.
 * https://github.com/jdecked/twemoji
 */

const TWEMOJI_BASE =
  "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72";

function emojiImg(code, alt = "") {
  return `<img class="emoji-icon" src="${TWEMOJI_BASE}/${code}.png" alt="${alt}" width="72" height="72" decoding="async" draggable="false" />`;
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

/** Inline SVG clothing glyphs (no Unicode emoji for these garments). */
function clothingSvg(body, alt = "") {
  return `<svg class="emoji-icon clothing-svg" viewBox="0 0 72 72" width="72" height="72" role="img" aria-label="${alt}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}

export function iconShirt() {
  return emojiImg("1f455", "短袖");
}

export function iconBlouse() {
  return emojiImg("1f45a", "薄長袖");
}

/** 厚長袖 — bulky crewneck sweater with clear long sleeves. */
export function iconThickTop() {
  return clothingSvg(
    `
    <path fill="#5B7C99" d="M22 24 L8 32 L11 52 L22 48 Z"/>
    <path fill="#5B7C99" d="M50 24 L64 32 L61 52 L50 48 Z"/>
    <path fill="#6E8FA8" d="M22 22 C22 14 28 10 36 10 C44 10 50 14 50 22 L50 58 C50 60.2 48.2 62 46 62 L26 62 C23.8 62 22 60.2 22 58 Z"/>
    <ellipse cx="36" cy="16" rx="7" ry="4.5" fill="#E8EEF4"/>
    <path fill="#4F6F88" d="M29 16 C30.5 20 41.5 20 43 16 C41 19.5 31 19.5 29 16 Z"/>
    <rect x="8" y="48" width="8" height="5" rx="1.5" fill="#4A6780"/>
    <rect x="56" y="48" width="8" height="5" rx="1.5" fill="#4A6780"/>
    `,
    "厚長袖"
  );
}

/** 發熱衣 — slim long-sleeve thermal base layer. */
export function iconThermal() {
  return clothingSvg(
    `
    <path fill="#C47A5A" d="M24 23 L12 30 L14 50 L24 46 Z"/>
    <path fill="#C47A5A" d="M48 23 L60 30 L58 50 L48 46 Z"/>
    <path fill="#D48968" d="M24 21 C24 14.5 29 11 36 11 C43 11 48 14.5 48 21 L48 58 C48 59.7 46.7 61 45 61 L27 61 C25.3 61 24 59.7 24 58 Z"/>
    <ellipse cx="36" cy="16.5" rx="6" ry="3.8" fill="#F6E4D8"/>
    <path fill="#B56A4C" d="M30 16.5 C31.2 19.8 40.8 19.8 42 16.5 C40.2 19.2 31.8 19.2 30 16.5 Z"/>
    <rect x="12" y="47" width="5" height="4" rx="1.2" fill="#A86248"/>
    <rect x="55" y="47" width="5" height="4" rx="1.2" fill="#A86248"/>
    `,
    "發熱衣"
  );
}

/** Light outer / 薄外套 — lab coat Twemoji as a distinct light layer. */
export function iconLightOuter() {
  return emojiImg("1f97c", "薄外套");
}

export function iconJacket() {
  return emojiImg("1f9e5", "棉外套");
}

/** 羽絨外套 — coat glyph with frost badge for visual distinction. */
export function iconDown() {
  return `${emojiImg("1f9e5", "羽絨外套")}<span class="emoji-badge" aria-hidden="true">${emojiImg("2744", "")}</span>`;
}

/**
 * Map clothing engine keys → icons.
 * thermal  發熱衣   → custom SVG (fitted thermal)
 * tee      短袖     → 👕 Twemoji 1f455
 * breathable 透氣衣 → 👕 Twemoji 1f455
 * long     薄長袖   → 👚 Twemoji 1f45a
 * thick    厚長袖   → custom SVG (crewneck sweater)
 * jacket / light / cardigan 薄外套 → 🥼 Twemoji 1f97c
 * padded   棉外套   → 🧥 Twemoji 1f9e5
 * down     羽絨外套 → 🧥 Twemoji 1f9e5 + ❄️ 2744 badge
 */
export function clothingIcon(key) {
  switch (key) {
    case "thermal":
      return iconThermal();
    case "long":
      return iconBlouse();
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
