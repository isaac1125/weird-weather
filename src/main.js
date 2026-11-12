import { buildAdviceRow } from "./clothing.js";
import {
  iconJacket,
  iconLaundry,
  iconPin,
  iconRun,
  iconShirt,
  iconStable,
  iconUmbrella,
  iconWind,
  weatherIcon,
  weatherLabel,
} from "./icons.js";
import {
  defaultPlace,
  loadSavedPlace,
  savePlace,
  searchLocalPlaces,
  searchPlaces,
} from "./places.js";
import {
  aqiLabel,
  fetchWeatherBundle,
  getPosition,
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
  aqi: document.getElementById("aqi-value"),
  aqiLabel: document.getElementById("aqi-label"),
  pm25: document.getElementById("pm25-value"),
  periodIcon: document.getElementById("period-icon"),
  periodLow: document.getElementById("period-low"),
  periodHigh: document.getElementById("period-high"),
  periodDesc: document.getElementById("period-desc"),
  periodRain: document.getElementById("period-rain"),
  advice: document.getElementById("advice-row"),
  hourly: document.getElementById("hourly-list"),
  tabs: document.querySelectorAll(".period__tab"),
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

function clothingGlyph(key) {
  if (key === "padded" || key === "jacket" || key === "light" || key === "cardigan") {
    return iconJacket();
  }
  return iconShirt();
}

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

function renderAdvice(periodKey) {
  const period = state.bundle[periodKey];
  const night = periodKey === "night";
  const advice = buildAdviceRow(period, { isNight: night });

  els.periodIcon.innerHTML = weatherIcon(period.weatherCode, { night });
  els.periodLow.textContent = String(period.low);
  els.periodHigh.textContent = String(period.high);
  els.periodDesc.textContent = weatherLabel(period.weatherCode);
  els.periodRain.textContent = String(period.popPct);

  const items = [
    ...advice.clothes.map((c) => ({
      label: c.label,
      tone: c.tone,
      svg: clothingGlyph(c.key),
      badge: null,
    })),
    {
      label: advice.condition.label,
      tone: advice.condition.tone === "warn" ? "cool" : advice.condition.tone,
      svg: conditionGlyph(advice.condition.key),
      badge: null,
    },
    {
      label: advice.laundry.label,
      tone: advice.laundry.tone,
      svg: iconLaundry(),
      badge: advice.laundry.ok ? "✓" : "!",
      badgeNo: !advice.laundry.ok,
    },
    {
      label: advice.exercise.label,
      tone: advice.exercise.tone === "warn" ? "warm" : advice.exercise.tone,
      svg: iconRun(),
      badge: advice.exercise.ok ? "✓" : "!",
      badgeNo: !advice.exercise.ok,
    },
  ].slice(0, 5);

  while (items.length < 5) {
    items.splice(2, 0, {
      label: "風力平穩",
      tone: "good",
      svg: iconWind(),
      badge: null,
    });
  }

  els.advice.innerHTML = items
    .map(
      (item) => `
      <div class="advice__item">
        <div class="advice__glyph" data-tone="${item.tone}">
          ${item.svg}
          ${
            item.badge
              ? `<span class="advice__badge${item.badgeNo ? " is-no" : ""}">${item.badge}</span>`
              : ""
          }
        </div>
        <p class="advice__label">${item.label}</p>
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
  const { current, aqi, pm25, source } = state.bundle;
  els.temp.textContent = String(current.temp);
  els.feels.textContent = String(current.feelsLike);
  els.aqi.textContent = aqi == null ? "--" : String(aqi);
  els.pm25.textContent = pm25 == null ? "--" : String(pm25);
  const label = aqiLabel(aqi);
  els.aqiLabel.textContent = label.text;
  els.aqiLabel.dataset.level = label.level === "good" ? "" : label.level;
  els.place.textContent = state.place.name;
  els.status.textContent =
    source === "sample" ? "示範資料（離線備援）" : "即時資料 · Open-Meteo";
}

function renderAll() {
  renderMetrics();
  renderAdvice(state.period);
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

function renderPlaceList(places) {
  if (!places.length) {
    els.list.innerHTML =
      '<li class="place-list__empty">找不到符合的地區，試試其他關鍵字</li>';
    return;
  }
  els.list.innerHTML = places
    .map(
      (place, index) => `
      <li>
        <button
          type="button"
          class="place-list__item"
          role="option"
          data-index="${index}"
          data-name="${place.name}"
          data-lat="${place.latitude}"
          data-lon="${place.longitude}"
        >
          ${place.name}
        </button>
      </li>`
    )
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

els.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const period = tab.dataset.period;
    state.period = period;
    els.tabs.forEach((t) => {
      const active = t.dataset.period === period;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });
    renderAdvice(period);
  });
});

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
