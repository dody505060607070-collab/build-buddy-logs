(function () {
  if (window.__dmExtras) return;
  window.__dmExtras = true;

  var TRACKS = [
    { title: "Spill Your Time", artist: "KatzPascale", art: "/site/assets/art-syt.jpg", src: null },
    { title: "I Wanna Be Yours", artist: "Arctic Monkeys", art: "/site/assets/art-iwby.jpg", src: "/site/assets/track-i-wanna-be-yours.mp3" },
    { title: "Blinding Lights", artist: "The Weeknd", art: "/site/assets/art-bl.jpg", src: "/site/assets/track-blinding-lights.mp3" }
  ];
  var current = 0, muted = false, bypass = false;
  var alt = new Audio();
  alt.loop = true; alt.preload = "none"; alt.volume = 0.6;

  // Every extra song copies the built-in song's live sound: the same underwater
  // muffling and the same fades (View our work, Projects, Contact, World).
  // The built-in song keeps playing silently and acts as the "guide".
  var fx = null;
  function worldCap() { return /^\/world/.test(location.pathname) ? 4500 : 22000; }
  function ensureFx() {
    if (fx) return fx;
    var H = window.__dmHowler; if (!H || !H.ctx) return null;
    try {
      var ctx = H.ctx, src = ctx.createMediaElementSource(alt), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = "lowpass"; f.Q.value = 1; f.frequency.value = 160; g.gain.value = 1;
      src.connect(f); f.connect(g); g.connect(ctx.destination); // skips the site's own mute
      fx = window.__dmSongFx = { ctx: ctx, f: f, g: g };
    } catch (e) { window.__dmFxErr = String(e); return null; }
    return fx;
  }
  function guide() {
    var A = window.__dmAudio; if (!A || !A.sprites || !A.sprites.audio) return null;
    var id = A.activeSounds && A.activeSounds["audio.backing"]; if (id == null) return null;
    var spr = A.sprites.audio, s = spr._soundById ? spr._soundById(id) : null; if (!s) return null;
    return { freq: s.filter ? s.filter.frequency.value : 22000, vol: spr.volume(id) };
  }
  function keepGuidePlaying() {
    var A = window.__dmAudio;
    if (A && A.play && A.isPlaying && !A.isPlaying("audio.backing")) {
      try {
        A.play({ key: "audio.backing", fade: { from: 0, to: 1, duration: 1 } });
        // Same starting sound the site gives its own song on this page.
        var home = location.pathname === "/" || location.pathname === "";
        A.filterTo({ key: "audio.backing", duration: 1, type: "lowpass", from: { frequency: 14e3 }, to: { frequency: home ? 160 : 2e4 } });
      } catch (e) {}
    }
  }
  setInterval(function () {
    if (!fx || alt.paused) return;
    var gd = guide(); if (!gd) { keepGuidePlaying(); return; }
    var t = fx.ctx.currentTime;
    fx.f.frequency.setTargetAtTime(Math.max(40, Math.min(gd.freq, worldCap())), t, 0.08);
    fx.g.gain.setTargetAtTime(Math.max(0, Math.min(1, gd.vol)), t, 0.08);
  }, 60);

  function muteBtn() { return document.querySelector(".js-global-mute-btn"); }
  function siteMuted() { var h = window.__dmHowler; return h ? !!h._muted : false; }
  function setSiteMute(m) {
    var b = muteBtn();
    if (!b || siteMuted() === m) return;
    bypass = true; b.click(); bypass = false;
  }

  // Panel
  var panel = document.createElement("div");
  panel.className = "dm-music";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Choose music");
  panel.innerHTML =
    '<p class="dm-music__label">Now playing</p><ul class="dm-music__list">' +
    TRACKS.map(function (t, i) {
      return '<li><button type="button" class="dm-music__track" data-i="' + i + '">' +
        '<img src="' + t.art + '" alt="" width="40" height="40">' +
        '<span><b>' + t.title + '</b><small>' + t.artist + '</small></span>' +
        '<i class="dm-music__eq" aria-hidden="true"><em></em><em></em><em></em></i></button></li>';
    }).join("") +
    '</ul><button type="button" class="dm-music__mute"><span class="dm-music__mute-icon" aria-hidden="true"></span><span class="dm-music__mute-text">Mute</span></button>';
  document.body.appendChild(panel);

  function render() {
    panel.querySelectorAll(".dm-music__track").forEach(function (el) {
      el.classList.toggle("is-active", +el.dataset.i === current);
    });
    panel.classList.toggle("is-muted", muted);
    panel.querySelector(".dm-music__mute-text").textContent = muted ? "Unmute" : "Mute";
    var b = muteBtn();
    if (b) b.style.setProperty("--dm-art", "url('" + TRACKS[current].art + "')");
  }
  function play() {
    if (muted) return;
    if (current === 0) { alt.pause(); setSiteMute(false); }
    else {
      setSiteMute(true);
      if (alt.dataset.i !== String(current)) { alt.src = TRACKS[current].src; alt.dataset.i = String(current); alt.currentTime = 0; }
      if (ensureFx() && fx.ctx.state === "suspended") fx.ctx.resume();
      keepGuidePlaying();
      alt.play().catch(function () {});
    }
  }
  function open(v) {
    panel.classList.toggle("is-open", v);
    var b = muteBtn(); if (b) b.classList.toggle("dm-open", v);
  }

  document.addEventListener("click", function (e) {
    if (bypass) return;
    var b = e.target.closest && e.target.closest(".js-global-mute-btn");
    if (b) { e.preventDefault(); e.stopImmediatePropagation(); open(!panel.classList.contains("is-open")); render(); return; }
    var t = e.target.closest && e.target.closest(".dm-music__track");
    if (t) { current = +t.dataset.i; muted = false; play(); render(); return; }
    if (e.target.closest && e.target.closest(".dm-music__mute")) {
      muted = !muted;
      if (muted) { alt.pause(); setSiteMute(true); } else play();
      render(); return;
    }
    if (!e.target.closest || !e.target.closest(".dm-music")) open(false);
  }, true);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) alt.pause();
    else if (!muted && current !== 0) alt.play().catch(function () {});
  });

  // Contact: "Start a project" tab + form
  document.addEventListener("click", function (e) {
    var tb = e.target.closest && e.target.closest(".js-content-toggle-btn");
    if (!tb) return;
    var on = tb.dataset.togglecontent === "project";
    document.querySelectorAll(".dm-brief").forEach(function (f) { f.classList.toggle("is-visible", on); });
    if (on && innerWidth < 768) openSheet();
  });

  // Phones: the 3D contact card can't scroll, so show the form as a steady full-screen sheet.
  var sheet = null, home = null;
  function openSheet() {
    var f = document.querySelector(".dm-brief"); if (!f || sheet) return;
    home = { parent: f.parentNode, next: f.nextSibling, form: f };
    sheet = document.createElement("div"); sheet.className = "dm-sheet";
    sheet.innerHTML = '<button type="button" class="dm-sheet__close" aria-label="Close">&times;</button>';
    sheet.appendChild(f); document.body.appendChild(sheet);
    document.documentElement.classList.add("dm-sheet-open");
  }
  function closeSheet() {
    if (!sheet) return;
    home.parent.insertBefore(home.form, home.next); home.form.classList.remove("is-visible");
    sheet.remove(); sheet = null;
    document.documentElement.classList.remove("dm-sheet-open");
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(".dm-sheet__close")) closeSheet();
  });
  document.addEventListener("touchmove", function (e) { if (sheet) e.stopPropagation(); }, { capture: true, passive: true });
  document.addEventListener("wheel", function (e) { if (sheet) e.stopPropagation(); }, { capture: true, passive: true });
  setInterval(function () { if (sheet && !/^\/contact/.test(location.pathname)) closeSheet(); }, 500);

  document.addEventListener("submit", function (e) {
    var f = e.target;
    if (!f.classList || !f.classList.contains("dm-brief")) return;
    e.preventDefault();
    var err = f.querySelector(".dm-brief__error");
    var services = [].slice.call(f.querySelectorAll('input[name="service"]:checked')).map(function (x) { return x.value; });
    var v = function (n) { return f.querySelector("[name=" + n + "]").value.trim(); }; var name = v("name"), phone = v("phone"), email = v("email");
    var msg = "";
    if (!services.length) msg = "Please choose at least one service.";
    else if (!name) msg = "Please enter your name.";
    else if (!/^\+?[0-9\s-]{7,20}$/.test(phone)) msg = "Please enter a valid phone number.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) msg = "Please enter a valid email.";
    err.textContent = msg;
    if (msg) return;
    f.querySelector(".dm-brief__done").hidden = false;
    f.querySelector(".dm-brief__submit").disabled = true;
  });

  render();
})();

/* Copyright notice and light copy protection */
(function () {
  try { console.log("%c© 2026 Digitmask — All rights reserved. Unauthorized copying is prohibited.", "font-weight:bold"); } catch (e) {}
  document.addEventListener("contextmenu", function (e) {
    if (e.target && e.target.closest && e.target.closest("input, textarea")) return;
    e.preventDefault();
  });
  document.addEventListener("dragstart", function (e) {
    if (e.target && e.target.tagName === "IMG") e.preventDefault();
  });
})();
