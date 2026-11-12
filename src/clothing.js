/**
 * Clothing logic for Taiwan-style diurnal temperature swings.
 * Maps day/night temp range + rain + wind into layered outfit tips.
 */

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/** Pick base layers from average and low temperatures (°C). */
export function outfitForTemps(low, high) {
  const avg = (low + high) / 2;
  const swing = high - low;
  const layers = [];

  if (avg >= 28) {
    layers.push({ key: "tee", label: "短袖", tone: "warm" });
  } else if (avg >= 23) {
    layers.push({ key: "tee", label: "短袖", tone: "warm" });
  } else if (avg >= 18) {
    layers.push({ key: "long", label: "薄長袖", tone: "cool" });
  } else if (avg >= 14) {
    layers.push({ key: "long", label: "薄長袖", tone: "cool" });
  } else {
    layers.push({ key: "thick", label: "厚長袖", tone: "cool" });
  }

  // Outer for cool lows or big swings (classic Taipei morning/evening)
  if (low <= 16 || (swing >= 8 && low <= 20)) {
    if (low <= 13) {
      layers.push({ key: "padded", label: "棉外套", tone: "cool" });
    } else {
      layers.push({ key: "jacket", label: "薄外套", tone: "cool" });
    }
  } else if (avg < 22 && swing >= 6) {
    layers.push({ key: "light", label: "薄外套", tone: "cool" });
  } else if (avg >= 26 || (avg >= 24 && low >= 22)) {
    layers.push({ key: "breathable", label: "透氣衣", tone: "warm" });
  } else if (layers.length === 1 && avg < 24) {
    layers.push({ key: "cardigan", label: "薄外套", tone: "cool" });
  }

  return layers.slice(0, 2);
}

export function rainAdvice(popPct) {
  if (popPct >= 60) {
    return { key: "umbrella", label: "攜帶雨具", tone: "bad", needed: true };
  }
  if (popPct >= 35) {
    return { key: "umbrella", label: "備傘較佳", tone: "warn", needed: true };
  }
  return { key: "dry", label: "雨具免帶", tone: "good", needed: false };
}

export function windAdvice(windKmh) {
  if (windKmh >= 40) {
    return { key: "wind", label: "注意強風", tone: "bad", strong: true };
  }
  if (windKmh >= 28) {
    return { key: "wind", label: "風偏大", tone: "warn", strong: true };
  }
  return { key: "calm", label: "風力平穩", tone: "good", strong: false };
}

export function laundryAdvice({ popPct, weatherCode, windKmh, high, isNight }) {
  if (isNight) {
    return { ok: false, label: "避免曬衣", tone: "bad" };
  }
  const rainy =
    popPct >= 40 ||
    [51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(weatherCode);
  const tooWindy = windKmh >= 45;
  const tooCold = high < 14;
  if (rainy || tooWindy || tooCold) {
    return { ok: false, label: "避免曬衣", tone: "bad" };
  }
  if (popPct <= 20 && high >= 18) {
    return { ok: true, label: "適合曬衣", tone: "good" };
  }
  return { ok: true, label: "可曬衣", tone: "good" };
}

export function exerciseAdvice({ popPct, high, low, windKmh, aqi }) {
  if (popPct >= 55) {
    return { ok: false, label: "減少運動", tone: "bad" };
  }
  if (aqi != null && aqi >= 100) {
    return { ok: false, label: "減少運動", tone: "bad" };
  }
  if (high >= 34 || low <= 10) {
    return { ok: false, label: "減少運動", tone: "bad" };
  }
  if (windKmh >= 45) {
    return { ok: false, label: "減少運動", tone: "bad" };
  }
  if (high >= 30) {
    return { ok: true, label: "注意補水", tone: "warn" };
  }
  return { ok: true, label: "適合運動", tone: "good" };
}

/** Join layer labels for the hero headline, e.g. 短袖＋棉外套. */
export function outfitHeadline(clothes) {
  return clothes.map((c) => c.label).join("＋");
}

/**
 * One short human line for diurnal swing + layering tip.
 * Prefer full-day swing when provided; else fall back to the active period.
 */
export function swingCopy({ swing, clothes, isNight = false }) {
  const delta = clamp(Math.round(swing), 0, 40);
  const outfit = outfitHeadline(clothes);
  if (delta >= 8) {
    return isNight
      ? `早晚差 ${delta}°，晚上記得加 ${clothes[clothes.length - 1]?.label || "外套"}`
      : `早晚差 ${delta}°，建議 ${outfit}，早晚好脫`;
  }
  if (delta >= 5) {
    return isNight
      ? `日夜溫差約 ${delta}°，夜間偏涼，維持 ${outfit}`
      : `日夜溫差約 ${delta}°，建議 ${outfit}`;
  }
  return isNight ? `今晚建議 ${outfit}` : `今天建議 ${outfit}`;
}

/**
 * Build advice for a day or night period.
 */
export function buildAdviceRow(period, { isNight = false, daySwing } = {}) {
  const { low, high, popPct, windKmh, weatherCode, aqi } = period;
  const clothes = outfitForTemps(low, high);
  const rain = rainAdvice(popPct);
  const wind = windAdvice(windKmh);
  const condition = rain.needed
    ? rain
    : wind.strong
      ? wind
      : { key: "stable", label: "天氣穩定", tone: "good" };
  const swing =
    typeof daySwing === "number" ? daySwing : clamp(high - low, 0, 40);

  return {
    clothes,
    condition,
    laundry: laundryAdvice({ popPct, weatherCode, windKmh, high, isNight }),
    exercise: exerciseAdvice({ popPct, high, low, windKmh, aqi }),
    swing,
    headline: outfitHeadline(clothes),
    reason: swingCopy({ swing, clothes, isNight }),
  };
}
