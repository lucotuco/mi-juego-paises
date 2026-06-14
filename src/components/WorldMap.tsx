// src/components/WorldMap.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Mapa mundial interactivo renderizado con react-native-svg.
//
// CÓMO REEMPLAZAR LOS PATHS DE EJEMPLO POR EL MAPA REAL:
// ────────────────────────────────────────────────────────
// 1. Descarga el GeoJSON mundial (110m de resolución, ~200 KB, ideal para móvil):
//    https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson
//
// 2. Convierte los polígonos GeoJSON a paths SVG. Opciones:
//    a) Herramienta online: https://mapshaper.org  (Export → SVG)
//    b) Node script con la librería `d3-geo` + `d3-path` en Node.js
//
// 3. Del SVG generado extrae los <path d="..." id="XX"> donde XX = ISO A2.
//    Asegúrate de que el atributo id sea el código ISO 3166-1 alpha-2.
//
// 4. Reemplaza el array `WORLD_PATHS` de abajo con esos datos.
//    Formato: { id: "AR", d: "M ... Z" }
//
// Alternativa lista para usar (SVG ya preparado para React Native):
//    https://github.com/djaiss/mapsicon → contiene SVG individual por país
//    https://github.com/Vizzuality/growasia_calculator/tree/master/public  (world.svg)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface WorldPathData {
  id: string;   // ISO 3166-1 alpha-2
  d: string;    // SVG path data
  label?: { x: number; y: number }; // coordenadas opcionales para el nombre
}

interface WorldMapProps {
  discoveredIds: string[];          // IDs ya adivinados → se pintan de verde
  onCountryPress?: (id: string) => void; // callback opcional al tocar un país
}

// ─── Datos de paths de ejemplo ───────────────────────────────────────────────
// NOTA: Estos son polígonos MUY simplificados solo para demostrar la estructura.
// Reemplázalos con los paths reales del paso descrito arriba.
// El viewBox real del mapa mundial estándar suele ser "0 0 2000 1001".

const WORLD_PATHS: WorldPathData[] = [
  // España (ES) — polígono simplificado de la península ibérica
  {
    id: "ES",
    d: "M 480,180 L 530,175 L 545,190 L 540,215 L 510,225 L 480,215 Z",
    label: { x: 512, y: 200 },
  },
  // Argentina (AR) — cono sur simplificado
  {
    id: "AR",
    d: "M 340,560 L 370,555 L 380,600 L 370,660 L 350,700 L 335,660 L 330,610 Z",
    label: { x: 355, y: 625 },
  },
  // Japón (JP) — isla simplificada (Honshu)
  {
    id: "JP",
    d: "M 1480,220 L 1510,210 L 1525,230 L 1515,255 L 1490,260 L 1478,240 Z",
    label: { x: 1500, y: 235 },
  },
  // Nigeria (NG) — África occidental
  {
    id: "NG",
    d: "M 580,380 L 630,375 L 645,405 L 635,430 L 600,435 L 578,415 Z",
    label: { x: 611, y: 405 },
  },
  // Australia (AU)
  {
    id: "AU",
    d: "M 1420,500 L 1530,490 L 1560,520 L 1555,580 L 1510,600 L 1430,590 L 1400,555 Z",
    label: { x: 1480, y: 545 },
  },
  // Estados Unidos (US) — mainland simplificado
  {
    id: "US",
    d: "M 150,220 L 320,215 L 335,240 L 330,275 L 290,295 L 155,290 L 138,260 Z",
    label: { x: 235, y: 255 },
  },
];

// ─── Paleta de colores ────────────────────────────────────────────────────────
const COLORS = {
  discovered: "#4CAF50",      // verde brillante para países adivinados
  discoveredStroke: "#2E7D32",
  undiscovered: "#B0BEC5",    // gris neutro
  undiscoveredStroke: "#78909C",
  ocean: "#1A237E",           // azul marino profundo para el fondo
  labelColor: "#FFFFFF",
};

// ─── Componente ──────────────────────────────────────────────────────────────

export const WorldMap: React.FC<WorldMapProps> = ({
  discoveredIds,
  onCountryPress,
}) => {
  // Convertimos el array a Set para lookups O(1) al renderizar cada path
  const discoveredSet = useMemo(
    () => new Set(discoveredIds),
    [discoveredIds]
  );

  return (
    <View style={styles.container}>
      {/*
        viewBox "0 0 1800 900" es estándar para proyecciones de mapa mundial.
        Cuando uses los paths reales, ajusta este valor al viewBox del SVG fuente.
      */}
      <Svg
        viewBox="0 0 1800 900"
        style={styles.svg}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Fondo oceánico */}
        <Path d="M0 0 H1800 V900 H0 Z" fill={COLORS.ocean} />

        {/* Grupo de países */}
        <G>
          {WORLD_PATHS.map(({ id, d, label }) => {
            const isDiscovered = discoveredSet.has(id);

            return (
              <G key={id}>
                <Path
                  d={d}
                  fill={isDiscovered ? COLORS.discovered : COLORS.undiscovered}
                  stroke={
                    isDiscovered
                      ? COLORS.discoveredStroke
                      : COLORS.undiscoveredStroke
                  }
                  strokeWidth={1.5}
                  onPress={() => onCountryPress?.(id)}
                />
                {/*
                  Mostrar la etiqueta solo si el país fue descubierto.
                  En producción con ~195 países considera desactivar las etiquetas
                  o mostrarlas solo a cierto nivel de zoom.
                */}
                {isDiscovered && label && (
                  <SvgText
                    x={label.x}
                    y={label.y}
                    fontSize={10}
                    fill={COLORS.labelColor}
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {id}
                  </SvgText>
                )}
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 2,        // 2:1 es la proporción del mapa mundial estándar
    backgroundColor: COLORS.ocean,
    borderRadius: 12,
    overflow: "hidden",
  },
  svg: {
    flex: 1,
  },
});

export default WorldMap;