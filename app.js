(() => {
  const sky = document.getElementById("sky");
  const cloudRoot = document.getElementById("clouds");
  const modeTitle = document.getElementById("modeTitle");
  const speedInput = document.getElementById("speedInput");
  const scaleInput = document.getElementById("scaleInput");
  const params = new URLSearchParams(window.location.search);

  const presets = {
    morning: {
      title: "Morning",
      tone: "morning",
      skyColor: 0x75b7df,
      cloudColor: 0xb9ccdf,
      cloudShadowColor: 0x4b6f90,
      sunColor: 0xffbc6d,
      sunGlareColor: 0xffd0a2,
      sunlightColor: 0xffd19a,
      speed: 0.7,
      scale: 2.8
    },
    sunset: {
      title: "Sunset",
      tone: "sunset",
      skyColor: 0x6d8fb4,
      cloudColor: 0xf0c5a4,
      cloudShadowColor: 0x6c5266,
      sunColor: 0xff7d35,
      sunGlareColor: 0xff5b2a,
      sunlightColor: 0xffad62,
      speed: 0.62,
      scale: 3.05
    },
    night: {
      title: "Night",
      tone: "night",
      skyColor: 0x1f314d,
      cloudColor: 0x6f7f9d,
      cloudShadowColor: 0x111a2b,
      sunColor: 0x9eb5dc,
      sunGlareColor: 0x5f75a5,
      sunlightColor: 0x627da7,
      speed: 0.48,
      scale: 3.2
    },
    sleep: {
      title: "Sleep",
      tone: "sleep",
      skyColor: 0x111827,
      cloudColor: 0x38445e,
      cloudShadowColor: 0x070b14,
      sunColor: 0x43516f,
      sunGlareColor: 0x28344e,
      sunlightColor: 0x30405f,
      speed: 0.3,
      scale: 3.5
    }
  };

  const state = {
    mode: params.get("mode") || "auto",
    visibleMode: "morning",
    ui: params.get("ui") === "0" ? "hidden" : "visible",
    speedOverride: readNumber("speed", 0.05, 2),
    scaleOverride: readNumber("scale", 0.5, 5),
    effect: null
  };

  function readNumber(name, min, max) {
    if (!params.has(name)) return null;
    const value = Number(params.get(name));
    if (!Number.isFinite(value)) return null;
    return Math.min(max, Math.max(min, value));
  }

  function autoMode() {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;
    if (hour >= 23.5 || hour < 5) return "sleep";
    if (hour >= 19.5 || hour < 7) return "night";
    if (hour >= 16.5) return "sunset";
    return "morning";
  }

  function currentPreset() {
    const mode = state.mode === "auto" ? autoMode() : state.mode;
    state.visibleMode = presets[mode] ? mode : "morning";
    const preset = { ...presets[state.visibleMode] };
    if (state.speedOverride !== null) preset.speed = state.speedOverride;
    if (state.scaleOverride !== null) preset.scale = state.scaleOverride;
    return preset;
  }

  function vantaOptions(preset) {
    return {
      el: cloudRoot,
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      skyColor: preset.skyColor,
      cloudColor: preset.cloudColor,
      cloudShadowColor: preset.cloudShadowColor,
      sunColor: preset.sunColor,
      sunGlareColor: preset.sunGlareColor,
      sunlightColor: preset.sunlightColor,
      speed: preset.speed,
      scale: preset.scale,
      scaleMobile: preset.scale
    };
  }

  function syncUrl() {
    const next = new URLSearchParams();
    next.set("mode", state.mode);
    if (state.ui === "hidden") next.set("ui", "0");
    if (state.speedOverride !== null) next.set("speed", String(state.speedOverride));
    if (state.scaleOverride !== null) next.set("scale", String(state.scaleOverride));
    window.history.replaceState(null, "", `${window.location.pathname}?${next.toString()}`);
  }

  function syncControls() {
    document.querySelectorAll("[data-mode]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.mode === state.mode));
    });
    const preset = currentPreset();
    speedInput.value = String(preset.speed);
    scaleInput.value = String(preset.scale);
  }

  function applyPreset() {
    const preset = currentPreset();
    sky.dataset.ui = state.ui;
    sky.dataset.tone = preset.tone;
    modeTitle.textContent = state.mode === "auto" ? `Auto: ${preset.title}` : preset.title;

    if (state.effect) {
      state.effect.setOptions(vantaOptions(preset));
    }
    syncControls();
    syncUrl();
  }

  function setMode(mode) {
    state.mode = presets[mode] || mode === "auto" ? mode : "morning";
    state.speedOverride = null;
    state.scaleOverride = null;
    applyPreset();
  }

  function boot() {
    if (!window.VANTA || !window.VANTA.CLOUDS) {
      modeTitle.textContent = "Clouds unavailable";
      sky.dataset.tone = "night";
      return;
    }

    state.effect = window.VANTA.CLOUDS(vantaOptions(currentPreset()));
    applyPreset();

    document.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => setMode(button.dataset.mode));
    });

    speedInput.addEventListener("input", () => {
      state.speedOverride = Number(speedInput.value);
      applyPreset();
    });

    scaleInput.addEventListener("input", () => {
      state.scaleOverride = Number(scaleInput.value);
      applyPreset();
    });

    window.addEventListener("resize", () => {
      if (state.effect && state.effect.resize) state.effect.resize();
    });

    window.setInterval(() => {
      if (state.mode === "auto") applyPreset();
    }, 60 * 1000);
  }

  window.addEventListener("load", boot);
})();
