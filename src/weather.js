/** Open-Meteo clients + Taipei/Da'an sample fallback. */

export const FALLBACK_PLACE = {
  name: "臺北市大安區",
  latitude: 25.0267,
  longitude: 121.5436,
};

const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const GEO_URL =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";

function round1(n) {
  return Math.round(n * 10) / 10;
}

function maxOf(values) {
  return Math.max(...values.filter((v) => typeof v === "number"));
}

function minOf(values) {
  return Math.min(...values.filter((v) => typeof v === "number"));
}

function modeCode(codes) {
  const counts = new Map();
  for (const c of codes) {
    if (c == null) continue;
    counts.set(c, (counts.get(c) || 0) + 1);
  }
  let best = 2;
  let bestN = -1;
  for (const [k, n] of counts) {
    if (n > bestN) {
      best = k;
      bestN = n;
    }
  }
  return best;
}

function slicePeriod(hourly, startHour, endHour) {
  const temps = [];
  const pops = [];
  const winds = [];
  const codes = [];
  hourly.time.forEach((iso, i) => {
    const h = Number(iso.slice(11, 13));
    if (h >= startHour && h < endHour) {
      temps.push(hourly.temperature_2m[i]);
      pops.push(hourly.precipitation_probability[i] ?? 0);
      winds.push(hourly.wind_speed_10m[i] ?? 0);
      codes.push(hourly.weather_code[i]);
    }
  });
  return {
    low: Math.round(minOf(temps)),
    high: Math.round(maxOf(temps)),
    popPct: Math.round(maxOf(pops)),
    windKmh: Math.round(maxOf(winds)),
    weatherCode: modeCode(codes),
  };
}

/** Open-Meteo returns timezone-local ISO without offset when timezone= is set. */
function parseTaipeiLocal(iso) {
  const normalized = iso.length === 16 ? `${iso}:00` : iso;
  return new Date(`${normalized}+08:00`);
}

function buildHourlyBrief(hourly, limit = 6) {
  const now = Date.now();
  const items = [];
  for (let i = 0; i < hourly.time.length; i++) {
    const hour = Number(hourly.time[i].slice(11, 13));
    if (hour % 3 !== 0) continue;
    const t = parseTaipeiLocal(hourly.time[i]).getTime();
    if (t + 60 * 60 * 1000 < now) continue;
    items.push({
      time: hourly.time[i],
      temp: Math.round(hourly.temperature_2m[i]),
      pop: Math.round(hourly.precipitation_probability[i] ?? 0),
      code: hourly.weather_code[i],
    });
    if (items.length >= limit) break;
  }
  return items;
}

export function aqiLabel(aqi) {
  if (aqi == null || Number.isNaN(aqi)) return { text: "暫無", level: "unknown" };
  if (aqi <= 50) return { text: "良好", level: "good" };
  if (aqi <= 100) return { text: "普通", level: "moderate" };
  if (aqi <= 150) return { text: "對敏感族群不健康", level: "unhealthy" };
  return { text: "不健康", level: "unhealthy" };
}

export async function reverseGeocode(lat, lon) {
  const url = new URL(GEO_URL);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("localityLanguage", "zh");
  const res = await fetch(url);
  if (!res.ok) throw new Error("reverse geocode failed");
  const data = await res.json();
  const city = data.city || data.locality || data.principalSubdivision || "";
  const district =
    data.locality && data.locality !== city
      ? data.locality
      : data.localityInfo?.administrative?.find((a) => a.adminLevel >= 6)?.name ||
        "";
  const parts = [city, district].filter(Boolean);
  const unique = [...new Set(parts)];
  const label = unique.join("");
  return label || FALLBACK_PLACE.name;
}

export async function fetchWeatherBundle(lat, lon) {
  const weatherUrl = new URL(WEATHER_URL);
  weatherUrl.searchParams.set("latitude", String(lat));
  weatherUrl.searchParams.set("longitude", String(lon));
  weatherUrl.searchParams.set("timezone", "Asia/Taipei");
  weatherUrl.searchParams.set("forecast_days", "2");
  weatherUrl.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation"
  );
  weatherUrl.searchParams.set(
    "hourly",
    "temperature_2m,precipitation_probability,weather_code,wind_speed_10m"
  );
  weatherUrl.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset"
  );

  const airUrl = new URL(AIR_URL);
  airUrl.searchParams.set("latitude", String(lat));
  airUrl.searchParams.set("longitude", String(lon));
  airUrl.searchParams.set("timezone", "Asia/Taipei");
  airUrl.searchParams.set("current", "us_aqi,pm2_5");

  const [weatherRes, airRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(airUrl).catch(() => null),
  ]);

  if (!weatherRes.ok) throw new Error("weather fetch failed");
  const weather = await weatherRes.json();
  let aqi = null;
  let pm25 = null;
  if (airRes && airRes.ok) {
    const air = await airRes.json();
    aqi = air.current?.us_aqi ?? null;
    pm25 = air.current?.pm2_5 != null ? Math.round(air.current.pm2_5) : null;
  }

  const hourly = weather.hourly;
  const day = slicePeriod(hourly, 6, 18);
  const night = slicePeriod(hourly, 18, 24);
  // Include late-night 0–5 from tomorrow-ish hours still in forecast
  const late = slicePeriod(hourly, 0, 6);
  const nightMerged = {
    low: Math.min(night.low, late.low),
    high: Math.max(night.high, late.high),
    popPct: Math.max(night.popPct, late.popPct),
    windKmh: Math.max(night.windKmh, late.windKmh),
    weatherCode: night.weatherCode,
  };

  const dailyHigh = Math.round(weather.daily?.temperature_2m_max?.[0] ?? day.high);
  const dailyLow = Math.round(
    weather.daily?.temperature_2m_min?.[0] ?? Math.min(day.low, nightMerged.low)
  );
  const sunrise = weather.daily?.sunrise?.[0] ?? null;
  const sunset = weather.daily?.sunset?.[0] ?? null;

  return {
    current: {
      temp: round1(weather.current.temperature_2m),
      feelsLike: Math.round(weather.current.apparent_temperature),
      code: weather.current.weather_code,
      windKmh: Math.round(weather.current.wind_speed_10m),
    },
    aqi,
    pm25,
    day: { ...day, aqi },
    night: { ...nightMerged, aqi },
    daily: {
      high: dailyHigh,
      low: dailyLow,
      swing: Math.max(0, dailyHigh - dailyLow),
      sunrise,
      sunset,
    },
    hourly: buildHourlyBrief(hourly),
    source: "live",
  };
}

/** Deterministic sample mimicking Taipei swing: cool night, mild day. */
export function sampleBundle() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const hours = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getTime() + i * 3 * 3600 * 1000);
    const h = d.getHours();
    const temp =
      h < 6 ? 15 : h < 10 ? 18 : h < 15 ? 23 : h < 19 ? 20 : 16;
    hours.push({
      time: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
        Math.floor(h / 3) * 3
      )}:00`,
      temp,
      pop: h >= 18 ? 40 : 10,
      code: h >= 18 ? 61 : 2,
    });
  }

  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1);
  const d = pad(now.getDate());
  return {
    current: { temp: 22.3, feelsLike: 21, code: 2, windKmh: 18 },
    aqi: 51,
    pm25: 9,
    day: {
      low: 14,
      high: 23,
      popPct: 10,
      windKmh: 32,
      weatherCode: 2,
      aqi: 51,
    },
    night: {
      low: 14,
      high: 18,
      popPct: 70,
      windKmh: 20,
      weatherCode: 61,
      aqi: 51,
    },
    daily: {
      high: 23,
      low: 14,
      swing: 9,
      sunrise: `${y}-${m}-${d}T06:05`,
      sunset: `${y}-${m}-${d}T17:28`,
    },
    hourly: hours,
    source: "sample",
  };
}

/**
 * Pick day vs night from local clock, preferring today's sunrise/sunset when present.
 * Fallback: ~06–18 day, otherwise night (Asia/Taipei).
 */
export function resolveActivePeriod(daily, now = new Date()) {
  const taipeiHour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Taipei",
      hour: "2-digit",
      hour12: false,
    }).format(now)
  );

  if (daily?.sunrise && daily?.sunset) {
    try {
      const sunriseMs = parseTaipeiLocal(daily.sunrise).getTime();
      const sunsetMs = parseTaipeiLocal(daily.sunset).getTime();
      const nowMs = now.getTime();
      if (Number.isFinite(sunriseMs) && Number.isFinite(sunsetMs)) {
        return nowMs >= sunriseMs && nowMs < sunsetMs ? "day" : "night";
      }
    } catch {
      /* fall through */
    }
  }

  return taipeiHour >= 6 && taipeiHour < 18 ? "day" : "night";
}

export function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("geolocation unavailable"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 10 * 60 * 1000,
    });
  });
}
