import { buildAdviceRow } from "./clothing.js";
import {
  iconJacket,
  iconLaundry,
  iconRun,
  iconShirt,
  iconUmbrella,
  iconWind,
  weatherIcon,
  weatherLabel,
} from "./icons.js";
import {
  FALLBACK_PLACE,
  aqiLabel,
  fetchWeatherBundle,
  getPosition,
  reverseGeocode,
  sampleBundle,
} from "./weather.js";

const els = {
  place: document.getElementById("place-name"),
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
};

let state = {
  period: "day",
  bundle: sampleBundle(),
  placeName: FALLBACK_PLACE.name,
};

function clothingGlyph(key) {
  if (key === "padded" || key === "jacket" || key === "light" || key === "cardigan") {
    return iconJacket();
  }
  return iconShirt();
}

function conditionGlyph(key) {
  if (key === "wind" || key === "calm") return iconWind();
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

  // Ensure exactly 5 slots: pad with calm wind if needed
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
      const night = Number(h.time.slice(11, 13)) >= 18 || Number(h.time.slice(11, 13)) < 6;
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
  els.place.textContent = state.placeName;
  els.status.textContent =
    source === "sample" ? "示範資料（離線備援）" : "即時資料 · Open-Meteo";
}

function renderAll() {
  renderMetrics();
  renderAdvice(state.period);
  renderHourly();
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

async function boot() {
  renderAll();
  let lat = FALLBACK_PLACE.latitude;
  let lon = FALLBACK_PLACE.longitude;
  let place = FALLBACK_PLACE.name;
  let usedGeo = false;

  try {
    els.status.textContent = "取得定位…";
    const pos = await getPosition();
    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
    usedGeo = true;
    try {
      place = await reverseGeocode(lat, lon);
    } catch {
      place = `目前位置（${lat.toFixed(2)}, ${lon.toFixed(2)}）`;
    }
  } catch {
    place = FALLBACK_PLACE.name;
    els.status.textContent = "改用臺北大安";
  }

  state.placeName = place;
  els.place.textContent = place;

  try {
    els.status.textContent = "讀取天氣…";
    const bundle = await fetchWeatherBundle(lat, lon);
    state.bundle = bundle;
    renderAll();
  } catch (err) {
    console.warn("weather fallback", err);
    state.bundle = sampleBundle();
    state.placeName = usedGeo ? place : FALLBACK_PLACE.name;
    renderAll();
    els.status.textContent = "示範資料（API 備援）";
  }
}

boot();
