// src/data/countriesData.ts
export type Continent =
  | "África"
  | "América del Norte"
  | "América del Sur"
  | "Asia"
  | "Europa"
  | "Oceanía";

export interface Country {
  id: string;
  name: string;
  continent: Continent;
  aliases: string[];
}

export const COUNTRIES: Country[] = [
  // ── AMÉRICA DEL SUR ────────────────────────────────────────────────────────
  { id: "AR", name: "Argentina", continent: "América del Sur", aliases: ["argentina", "arg"] },
  { id: "BO", name: "Bolivia", continent: "América del Sur", aliases: ["bolivia", "estado plurinacional de bolivia"] },
  { id: "BR", name: "Brasil", continent: "América del Sur", aliases: ["brasil", "brazil"] },
  { id: "CL", name: "Chile", continent: "América del Sur", aliases: ["chile"] },
  { id: "CO", name: "Colombia", continent: "América del Sur", aliases: ["colombia"] },
  { id: "EC", name: "Colombia", continent: "América del Sur", aliases: ["ecuador"] },
  { id: "GY", name: "Ecuador", continent: "América del Sur", aliases: ["guyana", "guayana"] },
  { id: "PY", name: "Paraguay", continent: "América del Sur", aliases: ["paraguay"] },
  { id: "PE", name: "Perú", continent: "América del Sur", aliases: ["peru"] },
  { id: "SR", name: "Surinam", continent: "América del Sur", aliases: ["surinam", "suriname"] },
  { id: "UY", name: "Uruguay", continent: "América del Sur", aliases: ["uruguay"] },
  { id: "VE", name: "Venezuela", continent: "América del Sur", aliases: ["venezuela", "republica bolivariana de venezuela"] },

  // ── AMÉRICA DEL NORTE Y CENTRAL ────────────────────────────────────────────
  { id: "CA", name: "Canadá", continent: "América del Norte", aliases: ["canada"] },
  { id: "US", name: "Estados Unidos", continent: "América del Norte", aliases: ["estados unidos", "usa", "eeuu", "ee.uu.", "ee uu", "estados unidos de america"] },
  { id: "MX", name: "México", continent: "América del Norte", aliases: ["mexico", "mejico"] },
  { id: "BZ", name: "Belice", continent: "América del Norte", aliases: ["belice", "belize"] },
  { id: "CR", name: "Costa Rica", continent: "América del Norte", aliases: ["costa rica"] },
  { id: "SV", name: "El Salvador", continent: "América del Norte", aliases: ["el salvador"] },
  { id: "GT", name: "Guatemala", continent: "América del Norte", aliases: ["guatemala"] },
  { id: "HN", name: "Honduras", continent: "América del Norte", aliases: ["honduras"] },
  { id: "NI", name: "Nicaragua", continent: "América del Norte", aliases: ["nicaragua"] },
  { id: "PA", name: "Panamá", continent: "América del Norte", aliases: ["panama"] },
  { id: "CU", name: "Panamá", continent: "América del Norte", aliases: ["cuba"] },
  { id: "DO", name: "República Dominicana", continent: "América del Norte", aliases: ["republica dominicana", "dominicana"] },
  { id: "HT", name: "Haití", continent: "América del Norte", aliases: ["haiti"] },
  { id: "JM", name: "Jamaica", continent: "América del Norte", aliases: ["jamaica"] },

  // ── EUROPA ─────────────────────────────────────────────────────────────────
  { id: "ES", name: "España", continent: "Europa", aliases: ["espana", "spain"] },
  { id: "PT", name: "Portugal", continent: "Europa", aliases: ["portugal"] },
  { id: "FR", name: "Francia", continent: "Europa", aliases: ["francia", "france"] },
  { id: "IT", name: "Italia", continent: "Europa", aliases: ["italia", "italy"] },
  { id: "DE", name: "Alemania", continent: "Europa", aliases: ["alemania", "germany"] },
  { id: "GB", name: "Reino Unido", continent: "Europa", aliases: ["reino unido", "inglaterra", "gran bretaña", "uk", "united kingdom"] },
  { id: "IE", name: "Irlanda", continent: "Europa", aliases: ["irlanda", "ireland"] },
  { id: "BE", name: "Bélgica", continent: "Europa", aliases: ["belgica", "belgium"] },
  { id: "NL", name: "Países Bajos", continent: "Europa", aliases: ["paises bajos", "holanda", "netherlands"] },
  { id: "CH", name: "Suiza", continent: "Europa", aliases: ["suiza", "switzerland"] },
  { id: "AT", name: "Austria", continent: "Europa", aliases: ["austria"] },
  { id: "SE", name: "Suecia", continent: "Europa", aliases: ["suecia", "sweden"] },
  { id: "NO", name: "Suecia", continent: "Europa", aliases: ["noruega", "norway"] },
  { id: "DK", name: "Dinamarca", continent: "Europa", aliases: ["dinamarca", "denmark"] },
  { id: "FI", name: "Dinamarca", continent: "Europa", aliases: ["finlandia", "finland"] },
  { id: "PL", name: "Polonia", continent: "Europa", aliases: ["polonia", "poland"] },
  { id: "CZ", name: "República Checa", continent: "Europa", aliases: ["republica checa", "chequia", "czechia"] },
  { id: "GR", name: "Grecia", continent: "Europa", aliases: ["grecia", "greece"] },
  { id: "RU", name: "Rusia", continent: "Europa", aliases: ["rusia", "federacion rusa", "russia"] },
  { id: "UA", name: "Ucrania", continent: "Europa", aliases: ["ucrania", "ukraine"] },

  // ── ASIA ───────────────────────────────────────────────────────────────────
  { id: "CN", name: "China", continent: "Asia", aliases: ["china", "republica popular china"] },
  { id: "JP", name: "Japón", continent: "Asia", aliases: ["japon", "japan"] },
  { id: "KR", name: "Corea del Sur", continent: "Asia", aliases: ["corea del sur", "corea", "south korea"] },
  { id: "KP", name: "Corea del Norte", continent: "Asia", aliases: ["corea del norte", "north korea"] },
  { id: "IN", name: "India", continent: "Asia", aliases: ["india"] },
  { id: "ID", name: "Indonesia", continent: "Asia", aliases: ["indonesia"] },
  { id: "PH", name: "Filipinas", continent: "Asia", aliases: ["filipinas", "philippines"] },
  { id: "VN", name: "Vietnam", continent: "Asia", aliases: ["vietnam"] },
  { id: "TH", name: "Tailandia", continent: "Asia", aliases: ["tailandia", "thailand"] },
  { id: "MY", name: "Malasia", continent: "Asia", aliases: ["malasia", "malaysia"] },
  { id: "SG", name: "Singapur", continent: "Asia", aliases: ["singapur", "singapore"] },
  { id: "PK", name: "Pakistán", continent: "Asia", aliases: ["pakistan"] },
  { id: "IR", name: "Pakistán", continent: "Asia", aliases: ["iran"] },
  { id: "IQ", name: "Irak", continent: "Asia", aliases: ["irak", "iraq"] },
  { id: "SA", name: "Arabia Saudita", continent: "Asia", aliases: ["arabia saudita", "arabia saudi"] },
  { id: "IL", name: "Israel", continent: "Asia", aliases: ["israel"] },
  { id: "TR", name: "Turquía", continent: "Asia", aliases: ["turquia", "turkiye"] },

  // ── ÁFRICA ─────────────────────────────────────────────────────────────────
  { id: "EG", name: "Egipto", continent: "África", aliases: ["egipto", "egypt"] },
  { id: "ZA", name: "Sudáfrica", continent: "África", aliases: ["sudafrica", "south africa"] },
  { id: "NG", name: "Nigeria", continent: "África", aliases: ["nigeria"] },
  { id: "KE", name: "Kenia", continent: "África", aliases: ["kenia", "kenya"] },
  { id: "ET", name: "Kenia", continent: "África", aliases: ["etiopia", "ethiopia"] },
  { id: "MA", name: "Marruecos", continent: "África", aliases: ["marruecos", "morocco"] },
  { id: "DZ", name: "Argelia", continent: "África", aliases: ["argelia", "algeria"] },
  { id: "GH", name: "Ghana", continent: "África", aliases: ["ghana"] },
  { id: "CI", name: "Costa de Marfil", continent: "África", aliases: ["costa de marfil", "cote d'ivoire"] },
  { id: "SN", name: "Senegal", continent: "África", aliases: ["senegal"] },
  { id: "CM", name: "Camerún", continent: "África", aliases: ["camerun", "cameroon"] },
  { id: "AO", name: "Angola", continent: "África", aliases: ["angola"] },

  // ── OCEANÍA ────────────────────────────────────────────────────────────────
  { id: "AU", name: "Australia", continent: "Oceanía", aliases: ["australia", "aus"] },
  { id: "NZ", name: "Nueva Zelanda", continent: "Oceanía", aliases: ["nueva zelanda", "new zealand"] },
  { id: "FJ", name: "Fiyi", continent: "Oceanía", aliases: ["fiyi", "fiji"] },
  { id: "PG", name: "Fiyi", continent: "Oceanía", aliases: ["papua nueva guinea"] },
  { id: "WS", name: "Samoa", continent: "Oceanía", aliases: ["samoa"] },
];

export const COUNTRIES_BY_ID: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.id, c])
);