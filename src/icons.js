/** Lightweight inline SVG icons (Lucide-inspired). */

export function iconSun() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
}

export function iconCloudSun() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M19 12a5 5 0 0 0-9.9-1"/><path d="M16 16H7a4 4 0 1 1 0-8h.2"/><path d="M17.66 6.34l1.41-1.41"/></svg>`;
}

export function iconCloud() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a4.5 4.5 0 1 0-.3-9 7 7 0 1 0-13.5 2.1A4 4 0 0 0 6 19Z"/></svg>`;
}

export function iconCloudRain() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 0 9H4"/><path d="m8 19 1-2M12 19l1-2M16 19l1-2"/></svg>`;
}

export function iconMoon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
}

export function iconShirt() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z"/></svg>`;
}

export function iconJacket() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8l2 4 3 2v4l-3-1v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9l-3 1V8l3-2 2-4Z"/><path d="M12 8v13M9 2c0 2 1.5 3 3 3s3-1 3-3"/></svg>`;
}

export function iconUmbrella() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a9 9 0 0 0-9 9h18a9 9 0 0 0-9-9Z"/><path d="M12 11v9a2 2 0 0 0 4 0"/></svg>`;
}

export function iconWind() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>`;
}

export function iconLaundry() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16"/><path d="M6 6v2a2 2 0 0 0 2 2h1l2 10h2l2-10h1a2 2 0 0 0 2-2V6"/><path d="M9 3h6"/></svg>`;
}

export function iconRun() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="14" cy="4" r="2"/><path d="m13 8-2.5 3 3 2 2 6"/><path d="m7 12 3 2 1.5-2.5"/><path d="m5 20 4-5"/></svg>`;
}

export function weatherIcon(code, { night = false } = {}) {
  if ([0].includes(code)) return night ? iconMoon() : iconSun();
  if ([1, 2].includes(code)) return night ? iconCloud() : iconCloudSun();
  if ([3, 45, 48].includes(code)) return iconCloud();
  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(
      code
    )
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
