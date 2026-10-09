import home from "./site-pages/home.html?raw";
import contact from "./site-pages/contact.html?raw";
import projects from "./site-pages/projects.html?raw";
import world from "./site-pages/world.html?raw";
import assetMap from "./site-asset-map.json";

const pages = { home, contact, projects, world } as const;

// Serves the exported site's original HTML at its original address, because the
// site's scripts choose the 3D scene from the current address.
export function sitePage(name: keyof typeof pages) {
  // Avoid a redirect for every bundled image, font, script and 3D asset.
  const html = pages[name]
    .replace(/\/wp-content\/[^\s"'<>?#)]+(?:\?[^\s"'<>)]*)?/g, (source) => {
      const path = source.split("?")[0];
      const filename = path?.split("/").pop() ?? "";
      const local = assetMap.files[filename as keyof typeof assetMap.files];
      if (!local) return source;
      const query = source.includes("?") ? source.slice(source.indexOf("?")) : "";
      return `/site/assets/${local}${query}`;
    })
    .replace("</head>", `<script>window.__dmAssetFiles=${JSON.stringify(assetMap.files)}</script></head>`);
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
