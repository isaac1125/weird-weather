import { buildAdviceRow } from "./clothing.js";
import {
  clothingIcon,
  iconLaundry,
  iconPin,
  iconRun,
  iconStable,
  iconUmbrella,
  iconWind,
  weatherIcon,
} from "./icons.js";
import {
  defaultPlace,
  loadSavedPlace,
  savePlace,
  searchLocalPlaces,
  searchPlaces,
} from "./places.js";
import {
  fetchWeatherBundle,
  getPosition,
  resolveActivePeriod,
  reverseGeocode,
  sampleBundle,
} from "./weather.js";

const els = {
  place: document.getElementById("place-name"),
  locationBtn: document.getElementById("location-btn"),
  locationPin: document.getElementById("location-pin"),
  status: document.getElementById("data-status"),
  temp: document.getElementById("current-temp"),
  feels: document.getElementById("feels-like"),
  periodLabel: document.getElementById("period-label"),
  outfitStack: document.getElementById("outfit-stack"),
  outfitTitle: document.getElementById("outfit-title"),
  outfitReason: document.getElementById("outfit-reason"),
  periodPeek: document.getElementById("period-peek"),
  periodLow: document.getElementById("period-low"),
  periodHigh: document.getElementById("period-high"),
  periodRangeLabel: document.getElementById("period-range-label"),
  periodRain: document.getElementById("period-rain"),
  cues: document.getElementById("cue-row"),
  hourly: document.getElementById("hourly-list"),
  sheet: document.getElementById("place-sheet"),
  backdrop: document.getElementById("place-backdrop"),
  close: document.getElementById("place-close"),
  geo: document.getElementById("place-geo"),
  geoIcon: document.getElementById("place-geo-icon"),
  search: document.getElementById("place-search"),
  list: document.getElementById("place-list"),
};

let state = {
  period: "day",
  bundle: sampleBundle(),
  place: defaultPlace(),
};

let searchTimer = null;
let searchToken = 0;

function conditionGlyph(key) {
  if (key === "wind" || key === "calm") return iconWind();
  if (key === "stable" || key === "dry") return iconStable();
  return iconUmbrella();
}

function formatHourLabel(iso) {
  const h = Number(iso.slice(11, 13));
  const datePart = iso.slice(0, 10);
  const todayTaipei = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  if (datePart !== todayTaipei && h === 0) return "明天";
  if (datePart !== todayTaipei) return `明 ${h}:00`;
  return `${h}:00`;
}

function syncActivePeriod() {
  state.period = resolveActivePeriod(state.bundle.daily);
  document.body.dataset.period = state.period;
}

function renderOutfit(periodKey) {
  const period = state.bundle[periodKey];
  const otherKey = periodKey === "day" ? "night" : "day";
  const night = periodKey === "night";
  const daySwing = state.bundle.daily?.swing;
  const advice = buildAdviceRow(period, { isNight: night, daySwing });
  const otherAdvice = buildAdviceRow(state.bundle[otherKey], {
    isNight: otherKey === "night",
    daySwing,
  });

  els.periodLabel.textContent = night ? "現在 · 晚上" : "現在 · 白天";
  els.periodRangeLabel.textContent = night ? "夜間" : "白天";
  els.periodLow.textContent = String(period.low);
  els.periodHigh.textContent = String(period.high);
  els.periodRain.textContent = String(period.popPct);

  // Headline lives under icons only; keep a11y text on the hidden h1.
  els.outfitTitle.textContent = advice.headline;
  els.outfitReason.textContent = advice.reason;

  const layers = advice.clothes
    .map(
      (c, index) => `
      <div class="outfit-layer" data-tone="${c.tone}" data-role="${c.role || ""}" style="--i:${index}">
        <div class="outfit-layer__glyph">${clothingIcon(c.key)}</div>
        <p class="outfit-layer__label">${c.label}</p>
      </div>
      ${
        index < advice.clothes.length - 1
          ? '<span class="outfit-plus" aria-hidden="true">＋</span>'
          : ""
      }`
    )
    .join("");

  els.outfitStack.innerHTML = `
    <div class="outfit-stack__weather" aria-hidden="true">
      ${weatherIcon(period.weatherCode, { night })}
    </div>
    <div class="outfit-stack__layers" data-count="${advice.clothes.length}">${layers}</div>
  `;

  els.periodPeek.textContent = night
    ? `白天建議：${otherAdvice.headline}`
    : `晚上建議：${otherAdvice.headline}`;

  const cues = [
    {
      label: advice.condition.label,
      tone: advice.condition.tone === "warn" ? "cool" : advice.condition.tone,
      svg: conditionGlyph(advice.condition.key),
    },
    night
      ? {
          label: advice.exercise.label,
          tone: advice.exercise.tone === "warn" ? "warm" : advice.exercise.tone,
          svg: iconRun(),
          badge: advice.exercise.ok ? "✓" : "!",
          badgeNo: !advice.exercise.ok,
        }
      : {
          label: advice.laundry.label,
          tone: advice.laundry.tone,
          svg: iconLaundry(),
          badge: advice.laundry.ok ? "✓" : "!",
          badgeNo: !advice.laundry.ok,
        },
  ];

  els.cues.innerHTML = cues
    .slice(0, 2)
    .map(
      (item) => `
      <div class="cue">
        <div class="cue__glyph" data-tone="${item.tone}">
          ${item.svg}
          ${
            item.badge
              ? `<span class="cue__badge${item.badgeNo ? " is-no" : ""}">${item.badge}</span>`
              : ""
          }
        </div>
        <p class="cue__label">${item.label}</p>
      </div>`
    )
    .join("");
}

function renderHourly() {
  els.hourly.innerHTML = state.bundle.hourly
    .map((h) => {
      const hour = Number(h.time.slice(11, 13));
      const night = hour >= 18 || hour < 6;
      return `
      <div class="hour">
        <span class="hour__time">${formatHourLabel(h.time)}</span>
        <span class="hour__icon">${weatherIcon(h.code, { night })}</span>
        <span class="hour__rain">${h.pop}%</span>
        <span class="hour__temp">${h.temp}°</span>
      </div>`;
    })
    .join("");
}

function renderMetrics() {
  const { current, source } = state.bundle;
  els.temp.textContent = String(current.temp);
  els.feels.textContent = String(current.feelsLike);
  els.place.textContent = state.place.name;
  els.status.textContent =
    source === "sample" ? "示範資料（離線備援）" : "即時資料 · Open-Meteo";
}

function renderAll() {
  syncActivePeriod();
  renderMetrics();
  renderOutfit(state.period);
  renderHourly();
}

function openPlaceSheet() {
  els.sheet.hidden = false;
  els.locationBtn.setAttribute("aria-expanded", "true");
  document.body.classList.add("sheet-open");
  els.search.value = "";
  renderPlaceList(searchLocalPlaces("", 14));
  queueMicrotask(() => els.search.focus());
}

function closePlaceSheet() {
  els.sheet.hidden = true;
  els.locationBtn.setAttribute("aria-expanded", "false");
  document.body.classList.remove("sheet-open");
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderPlaceList(places) {
  if (!places.length) {
    els.list.innerHTML =
      '<li class="place-list__empty">找不到符合的地區，試試其他關鍵字</li>';
    return;
  }
  els.list.innerHTML = places
    .map((place) => {
      const name = escapeHtml(place.name);
      return `
      <li>
        <button
          type="button"
          class="place-list__item"
          role="option"
          data-name="${name}"
          data-lat="${Number(place.latitude)}"
          data-lon="${Number(place.longitude)}"
        >
          ${name}
        </button>
      </li>`;
    })
    .join("");
}

async function refreshPlaceList(query) {
  const token = ++searchToken;
  const places = await searchPlaces(query, 14);
  if (token !== searchToken) return;
  renderPlaceList(places);
}

async function loadWeatherForPlace(place, { persist = true } = {}) {
  state.place = place;
  els.place.textContent = place.name;
  if (persist) savePlace(place);

  try {
    els.status.textContent = "讀取天氣…";
    const bundle = await fetchWeatherBundle(place.latitude, place.longitude);
    state.bundle = bundle;
    renderAll();
  } catch (err) {
    console.warn("weather fallback", err);
    state.bundle = sampleBundle();
    renderAll();
    els.status.textContent = "示範資料（API 備援）";
  }
}

async function useGeolocation() {
  els.status.textContent = "取得定位…";
  els.geo.disabled = true;
  try {
    const pos = await getPosition();
    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;
    let name;
    try {
      name = await reverseGeocode(latitude, longitude);
    } catch {
      name = `目前位置（${latitude.toFixed(2)}, ${longitude.toFixed(2)}）`;
    }
    closePlaceSheet();
    await loadWeatherForPlace({ name, latitude, longitude });
  } catch {
    els.status.textContent = "無法取得定位，請手動選地區";
  } finally {
    els.geo.disabled = false;
  }
}

els.locationBtn.addEventListener("click", openPlaceSheet);
els.backdrop.addEventListener("click", closePlaceSheet);
els.close.addEventListener("click", closePlaceSheet);
els.geo.addEventListener("click", () => {
  useGeolocation();
});

els.search.addEventListener("input", () => {
  const query = els.search.value.trim();
  clearTimeout(searchTimer);
  if (query.length < 2) {
    renderPlaceList(searchLocalPlaces(query, 14));
    return;
  }
  renderPlaceList(searchLocalPlaces(query, 14));
  searchTimer = setTimeout(() => refreshPlaceList(query), 220);
});

els.list.addEventListener("click", (event) => {
  const btn = event.target.closest(".place-list__item");
  if (!btn) return;
  const place = {
    name: btn.dataset.name,
    latitude: Number(btn.dataset.lat),
    longitude: Number(btn.dataset.lon),
  };
  closePlaceSheet();
  loadWeatherForPlace(place);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !els.sheet.hidden) {
    closePlaceSheet();
  }
});

async function boot() {
  els.locationPin.innerHTML = iconPin();
  els.geoIcon.innerHTML = iconPin();

  // Dev/demo: ?demo=cold forces sample cold night stack (發熱衣＋厚長袖＋棉外套)
  const demo = new URLSearchParams(location.search).get("demo");
  if (demo === "cold") {
    state.bundle = sampleBundle();
    state.period = "night";
    document.body.dataset.period = "night";
    renderMetrics();
    renderOutfit("night");
    renderHourly();
    els.status.textContent = "示範資料（冷天預覽）";
    return;
  }
  if (demo === "freezing") {
    state.bundle = sampleBundle();
    state.bundle.day = {
      low: 2,
      high: 8,
      popPct: 10,
      windKmh: 25,
      weatherCode: 2,
      aqi: 40,
    };
    state.bundle.night = {
      low: 1,
      high: 5,
      popPct: 20,
      windKmh: 28,
      weatherCode: 3,
      aqi: 40,
    };
    state.bundle.daily = { ...state.bundle.daily, high: 8, low: 1, swing: 7 };
    state.period = "night";
    document.body.dataset.period = "night";
    renderMetrics();
    renderOutfit("night");
    renderHourly();
    els.status.textContent = "示範資料（羽絨預覽）";
    return;
  }

  renderAll();

  const saved = loadSavedPlace();
  if (saved) {
    await loadWeatherForPlace(saved, { persist: false });
    return;
  }

  // First visit: default Taipei Da'an; geolocation is opt-in via the picker.
  await loadWeatherForPlace(defaultPlace());
}

boot();
