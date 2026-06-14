// src/store/useGameStore.ts
// ─────────────────────────────────────────────────────────────────────────────
// Store central con Zustand + middleware de persistencia en AsyncStorage.
// Responsabilidades:
//   1. Guardar los países descubiertos en la sesión actual.
//   2. Validar la entrada del usuario (normalización + aliases).
//   3. Persistir el progreso para que sobreviva al background de la app.
//   4. Acumular estadísticas entre partidas.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COUNTRIES, COUNTRIES_BY_ID, Country } from "../data/countriesData";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface GameStats {
  gamesPlayed: number;
  bestPercentage: number;   // 0–100
  lastPlayedDate: string | null; // ISO string
}

export interface GameState {
  // Estado de la partida actual
  discoveredIds: string[];        // ISO ids de los países ya adivinados
  inputValue: string;             // valor del TextInput ligado al store
  lastGuessCorrect: boolean | null; // feedback inmediato al usuario

  // Estadísticas persistidas
  stats: GameStats;

  // Acciones
  setInput: (text: string) => void;
  submitGuess: () => void;
  resetGame: () => void;
  finishGame: () => void; // llamar al cerrar la sesión para guardar stats
}

// ─── Utilidades de normalización ─────────────────────────────────────────────

/**
 * Convierte un string a su forma "canónica" para comparar:
 *  - minúsculas
 *  - sin tildes / diacríticos (NFD + quitar combining marks)
 *  - sin espacios al inicio/fin ni múltiples espacios internos
 *
 * Ejemplos:
 *   "ESTADOS UNIDOS" → "estados unidos"
 *   "  Japón  "     → "japon"
 *   "EE.UU."        → "ee.uu."   (puntos se conservan, los aliases los contemplan)
 */
export function normalize(text: string): string {
  return text
    .normalize("NFD")                        // descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "")         // elimina combining diacritics
    .toLowerCase()
    .replace(/\s+/g, " ")                    // colapsa espacios múltiples
    .trim();
}

/**
 * Dado un texto de entrada ya normalizado, busca qué país coincide.
 * Busca primero por nombre canónico, luego recorre aliases.
 * Retorna el Country encontrado o undefined.
 */
function findCountryByInput(normalizedInput: string): Country | undefined {
  // Comparación directa por nombre canónico normalizado
  const byName = COUNTRIES.find(
    (c) => normalize(c.name) === normalizedInput
  );
  if (byName) return byName;

  // Búsqueda por aliases (ya están en minúsculas sin tildes en countriesData,
  // pero normalizamos igual para ser robustos)
  return COUNTRIES.find((c) =>
    c.aliases.some((alias) => normalize(alias) === normalizedInput)
  );
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // ── Estado inicial ──────────────────────────────────────────────────────
      discoveredIds: [],
      inputValue: "",
      lastGuessCorrect: null,
      stats: {
        gamesPlayed: 0,
        bestPercentage: 0,
        lastPlayedDate: null,
      },

      // ── Sincronizar el TextInput con el store ───────────────────────────────
      setInput: (text) => set({ inputValue: text }),

      // ── Lógica principal: validar el guess del usuario ──────────────────────
      submitGuess: () => {
        const { inputValue, discoveredIds } = get();

        const normalized = normalize(inputValue);
        if (!normalized) return; // ignorar envíos vacíos

        const match = findCountryByInput(normalized);

        if (!match) {
          // No encontramos el país → feedback negativo, limpiamos input
          set({ lastGuessCorrect: false, inputValue: "" });
          return;
        }

        if (discoveredIds.includes(match.id)) {
          // País ya descubierto → feedback neutral (no contamos como error)
          set({ lastGuessCorrect: null, inputValue: "" });
          return;
        }

        // ¡País nuevo descubierto! → añadir a la lista y feedback positivo
        set({
          discoveredIds: [...discoveredIds, match.id],
          lastGuessCorrect: true,
          inputValue: "",
        });
      },

      // ── Reiniciar partida (nueva sesión) ────────────────────────────────────
      resetGame: () => {
        // Antes de resetear, guardamos estadísticas de la partida que termina
        get().finishGame();
        set({
          discoveredIds: [],
          inputValue: "",
          lastGuessCorrect: null,
        });
      },

      // ── Guardar estadísticas de la partida actual ───────────────────────────
      // Se llama al finalizar o reiniciar. No limpia el estado de la partida.
      finishGame: () => {
        const { discoveredIds, stats } = get();
        if (discoveredIds.length === 0) return; // nada que guardar

        const percentage = Math.round(
          (discoveredIds.length / COUNTRIES.length) * 100
        );

        set({
          stats: {
            gamesPlayed: stats.gamesPlayed + 1,
            bestPercentage: Math.max(stats.bestPercentage, percentage),
            lastPlayedDate: new Date().toISOString(),
          },
        });
      },
    }),

    // ── Configuración de persistencia ─────────────────────────────────────────
    {
      name: "geoquiz-storage",           // clave en AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),

      // Solo persistimos lo que necesita sobrevivir entre sesiones.
      // `inputValue` y `lastGuessCorrect` son estado UI efímero → no persistir.
      partialize: (state) => ({
        discoveredIds: state.discoveredIds,
        stats: state.stats,
      }),
    }
  )
);

// ─── Selectores derivados (fuera del store para no re-suscribir innecesario) ──

/** Países descubiertos como objetos Country completos */
export const selectDiscoveredCountries = (state: GameState) =>
  state.discoveredIds.map((id) => COUNTRIES_BY_ID[id]).filter(Boolean);

/** Porcentaje de completitud de la partida actual */
export const selectProgressPercentage = (state: GameState) =>
  COUNTRIES.length > 0
    ? Math.round((state.discoveredIds.length / COUNTRIES.length) * 100)
    : 0;