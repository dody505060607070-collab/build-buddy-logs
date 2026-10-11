/* Digitmask "other example" strip shown on every example page.
   Add <script src="/examples/dm-next.js" defer></script> to any new example page. */
(function () {
  var EXAMPLES = [
    { href: "/examples/feather-atlas.html", label: "Feather Atlas" },
    { href: "/examples/planet-jumping.html", label: "Planet Jumping" },
    { href: "/examples/world-model.html", label: "World Model" }
  ];
  function pick() {
    var here = location.pathname.replace(/\/$/, "");
    var others = [];
    for (var i = 0; i < EXAMPLES.length; i++) {
      if (EXAMPLES[i].href.replace(/\/$/, "") !== here) others.push(EXAMPLES[i]);
    }
    if (!others.length) return null;
    return others[Math.floor(Math.random() * others.length)];
  }
  var css = ".dmn{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:2147483500;" +
    "display:flex;align-items:center;gap:10px;height:56px;padding:0 20px;border-radius:999px;" +
    "background:rgba(10,10,16,.45);border:1px solid rgba(255,255,255,.22);-webkit-backdrop-filter:blur(14px) saturate(1.3);" +
    "backdrop-filter:blur(14px) saturate(1.3);box-shadow:0 8px 30px rgba(0,0,0,.3);color:#fff;" +
    "font:500 13px/1.2 system-ui,-apple-system,Segoe UI,sans-serif;text-decoration:none;cursor:pointer!important;" +
    "animation:dmn-in .8s cubic-bezier(.22,1,.36,1) 1.4s both;transition:transform .3s}" +
    ".dmn:hover{transform:translateX(-50%) translateY(-3px)}" +
    ".dmn small{opacity:.7;font-weight:400}.dmn b{font-weight:700}" +
    "@keyframes dmn-in{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}" +
    "@media(max-width:700px){.dmn{bottom:70px;height:48px;padding:0 16px;font-size:12px}}";
  function add() {
    var next = pick();
    if (!next) return;
    var s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
    var a = document.createElement("a"); a.className = "dmn"; a.href = next.href; a.target = "_top";
    a.innerHTML = '<small>Other example</small><b>' + next.label + ' →</b>';
    document.body.appendChild(a);
  }
  if (document.body) add(); else document.addEventListener("DOMContentLoaded", add);
})();
