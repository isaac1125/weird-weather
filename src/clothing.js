/**
 * Clothing logic for Taiwan-style diurnal temperature swings.
 * Inspired by tenki.jp 服装指数 public bands (10–100), adapted for
 * Traditional Chinese layer labels — our own rules, not their assets.
 * Ref: https://tenki.jp/lite/indexes/dress/
 */

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Map period temps to a tenki-style dress band (10…100, steps of 10).
 * Uses a cool-biased feel temp so morning lows pull the band down
 * the way tenki morning/evening slots tend to.
 */
export function dressBandForTemps(low, high) {
  const feel = low * 0.45 + high * 0.55;
  if (feel < 3) return 10;
  if (feel < 7) return 20;
  if (feel < 11) return 30;
  if (feel < 15) return 40;
  if (feel < 18) return 50;
  if (feel < 22) return 60;
  if (feel < 26) return 70;
  if (feel < 29) return 80;
  if (feel < 32) return 90;
  return 100;
}

/** Short Traditional Chinese gloss for a dress band (legend-aligned). */
export function dressBandLabel(band) {
  if (band <= 10) return "極度禦寒";
  if (band <= 20) return "羽絨級防寒";
  if (band <= 30) return "厚外套防寒";
  if (band <= 40) return "建議穿外套";
  if (band <= 50) return "可穿薄外套";
  if (band <= 60) return "長袖舒適";
  if (band <= 70) return "短袖可加外套";
  if (band <= 80) return "短袖即可";
  if (band <= 90) return "輕薄透氣";
  return "注意防暑";
}

/**
 * Build layered outfit from period low/high (°C).
 * Order: optional 發熱衣 (inner) → mid top → optional outer.
 * Allows 1–3 layers so headlines like 「發熱衣＋厚長袖」or
 * 「發熱衣＋厚長袖＋羽絨外套」are possible.
 */
export function outfitForTemps(low, high) {
  const avg = (low + high) / 2;
  const swing = high - low;
  const band = dressBandForTemps(low, high);
  const layers = [];

  // Inner thermal — stackable under mid (tenki Heattech-style cue, generic label)
  const needThermal =
    band <= 30 || low <= 10 || (band <= 40 && low <= 13) || (avg <= 13 && low <= 12);

  if (needThermal) {
    layers.push({ key: "thermal", label: "發熱衣", tone: "cool", role: "inner" });
  }

  // Mid layer from band / avg
  if (band >= 90 || avg >= 28) {
    layers.push({ key: "tee", label: "短袖", tone: "warm", role: "mid" });
  } else if (band >= 70 || avg >= 23) {
    layers.push({ key: "tee", label: "短袖", tone: "warm", role: "mid" });
  } else if (band >= 50 || avg >= 17) {
    layers.push({
      key: "long",
      label: "薄長袖",
      tone: "cool",
      role: "mid",
    });
  } else if (band >= 40 || avg >= 14) {
    // With thermal already on, still show a mid so 「發熱衣＋厚長袖」stacks
    layers.push({
      key: needThermal ? "thick" : "long",
      label: needThermal ? "厚長袖" : "薄長袖",
      tone: "cool",
      role: "mid",
    });
  } else {
    layers.push({ key: "thick", label: "厚長袖", tone: "cool", role: "mid" });
  }

  // Outer — lite legend spirit: 20→羽絨, 30–40→棉/有裡外套, 50→薄外套, 70→可脫外套
  let outer = null;
  if (band <= 20 || low <= 4) {
    outer = { key: "down", label: "羽絨外套", tone: "cool", role: "outer" };
  } else if (band <= 40 || low <= 10) {
    outer = { key: "padded", label: "棉外套", tone: "cool", role: "outer" };
  } else if (
    band <= 50 ||
    low <= 16 ||
    (swing >= 8 && low <= 20) ||
    (avg < 22 && swing >= 6)
  ) {
    outer = { key: "jacket", label: "薄外套", tone: "cool", role: "outer" };
  } else if (band <= 70 || (layers.length === 1 && avg < 24)) {
    outer = { key: "cardigan", label: "薄外套", tone: "cool", role: "outer" };
  } else if (band >= 90 || (avg >= 26 && low >= 22)) {
    outer = { key: "breathable", label: "透氣衣", tone: "warm", role: "outer" };
  }

  if (outer) layers.push(outer);

  // Cap at 3 visible layers (inner + mid + outer); never collapse thermal away
  return layers.slice(0, 3);
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

/** Join layer labels for the hero headline, e.g. 發熱衣＋厚長袖＋羽絨外套. */
export function outfitHeadline(clothes) {
  return clothes.map((c) => c.label).join("＋");
}

/**
 * Short tip under the outfit icons.
 * Headline already lists the full stack — reason only names the *extra*
 * layer to add for cooler mornings/evenings (e.g. 建議多加薄外套).
 */
const COOL_OUTER_KEYS = new Set([
  "jacket",
  "light",
  "cardigan",
  "padded",
  "down",
]);

export function swingCopy({ swing, clothes, isNight = false, band }) {
  const delta = clamp(Math.round(swing), 0, 40);
  // Only name a removable cool outer — not 透氣衣 / mid tops (headline already lists the stack).
  const extra =
    [...clothes]
      .reverse()
      .find((c) => c.role === "outer" && COOL_OUTER_KEYS.has(c.key)) || null;
  const add = extra?.label;

  if (delta >= 8) {
    if (add) {
      return isNight
        ? `早晚差 ${delta}°，晚間偏涼，建議多加${add}`
        : `早晚差 ${delta}°，早晚較冷，建議多加${add}`;
    }
    return isNight
      ? `早晚差 ${delta}°，晚間偏涼`
      : `早晚差 ${delta}°，早晚較冷`;
  }
  if (delta >= 5) {
    if (add) {
      return isNight
        ? `日夜溫差約 ${delta}°，夜間偏涼，建議多加${add}`
        : `日夜溫差約 ${delta}°，早晚偏涼，建議多加${add}`;
    }
    return isNight
      ? `日夜溫差約 ${delta}°，夜間偏涼`
      : `日夜溫差約 ${delta}°，早晚偏涼`;
  }
  if (typeof band === "number" && band <= 40 && add) {
    return isNight
      ? `今晚偏涼，建議多加${add}`
      : `今天偏涼，建議多加${add}`;
  }
  return isNight ? `今晚穿著如上即可` : `今天穿著如上即可`;
}

/**
 * Build advice for a day or night period.
 */
export function buildAdviceRow(period, { isNight = false, daySwing } = {}) {
  const { low, high, popPct, windKmh, weatherCode, aqi } = period;
  const clothes = outfitForTemps(low, high);
  const band = dressBandForTemps(low, high);
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
    band,
    bandLabel: dressBandLabel(band),
    condition,
    laundry: laundryAdvice({ popPct, weatherCode, windKmh, high, isNight }),
    exercise: exerciseAdvice({ popPct, high, low, windKmh, aqi }),
    swing,
    headline: outfitHeadline(clothes),
    reason: swingCopy({ swing, clothes, isNight, band }),
  };
}
