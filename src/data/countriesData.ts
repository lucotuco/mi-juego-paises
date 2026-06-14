// src/data/countriesData.ts
// ─────────────────────────────────────────────────────────────────────────────
// Fuente de verdad de países. En producción este array tendría los ~195 países.
// Cada entrada incluye:
//   id        → código ISO 3166-1 alpha-2 (debe coincidir con el path ID del SVG)
//   name      → nombre canónico que se muestra al usuario
//   continent → para agrupar el listado
//   aliases   → variantes aceptadas como respuesta válida (sin tildes, sin case)
// ─────────────────────────────────────────────────────────────────────────────

export type Continent =
  | "África"
  | "América del Norte"
  | "América del Sur"
  | "Asia"
  | "Europa"
  | "Oceanía"
  | "Antártida";

export interface Country {
  id: string;          // ISO 3166-1 alpha-2, ej. "AR"
  name: string;        // Nombre oficial en español
  continent: Continent;
  aliases: string[];   // Alternativas y abreviaturas aceptadas
}

// ─── 5 países de ejemplo — uno por continente (excepto Antártida) ─────────────
// NOTA: Para el mapa SVG completo descarga:
//   https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson
// o la versión SVG lista para React-Native:
//   https://github.com/djaiss/mapsicon   (SVG por país)
//   https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json
// ─────────────────────────────────────────────────────────────────────────────

export const COUNTRIES: Country[] = [
  // ── EUROPA ─────────────────────────────────────────────────────────────────
  {
    id: "ES",
    name: "España",
    continent: "Europa",
    aliases: ["espana", "spain", "reino de espana", "reino de españa"],
  },

  // ── AMÉRICA DEL SUR ────────────────────────────────────────────────────────
  {
    id: "AR",
    name: "Argentina",
    continent: "América del Sur",
    aliases: [
      "argentina",
      "republica argentina",
      "república argentina",
      "arg",
    ],
  },

  // ── ASIA ───────────────────────────────────────────────────────────────────
  {
    id: "JP",
    name: "Japón",
    continent: "Asia",
    aliases: ["japon", "japan", "nippon", "nihon"],
  },

  // ── ÁFRICA ─────────────────────────────────────────────────────────────────
  {
    id: "NG",
    name: "Nigeria",
    continent: "África",
    aliases: ["nigeria", "federal republic of nigeria", "republica federal de nigeria"],
  },

  // ── OCEANÍA ────────────────────────────────────────────────────────────────
  {
    id: "AU",
    name: "Australia",
    continent: "Oceanía",
    aliases: [
      "australia",
      "commonwealth of australia",
      "mancomunidad de australia",
      "aus",
    ],
  },

  // ── AMÉRICA DEL NORTE ──────────────────────────────────────────────────────
  {
    id: "US",
    name: "Estados Unidos",
    continent: "América del Norte",
    aliases: [
      "estados unidos",
      "united states",
      "usa",
      "eeuu",
      "ee uu",
      "ee.uu",
      "ee.uu.",
      "united states of america",
      "estados unidos de america",
      "estados unidos de américa",
      "norteamerica",   // coloquial
    ],
  },

  // ─── AGREGA AQUÍ EL RESTO DE LOS ~189 PAÍSES ───────────────────────────────
  // Sigue el mismo patrón. El id DEBE coincidir con el atributo `id` de los
  // paths en tu SVG/GeoJSON para que el coloreado funcione automáticamente.
];

// ─── Índice rápido por id para lookups O(1) ──────────────────────────────────
export const COUNTRIES_BY_ID: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.id, c])
);