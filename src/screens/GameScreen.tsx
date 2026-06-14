// src/screens/GameScreen.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Pantalla principal del juego. Contiene:
//   · Header con contador de progreso
//   · TextInput de respuestas con feedback visual
//   · Mapa SVG interactivo
//   · FlatList de países agrupados por continente (censura los no descubiertos)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SectionList,
  Keyboard,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGameStore, selectProgressPercentage } from "../store/useGameStore";
import { COUNTRIES, Country, Continent } from "../data/countriesData";
import { WorldMap } from "../components/WorldMap";

// ─── Utilidad: censurar nombre ────────────────────────────────────────────────
/**
 * Convierte "Argentina" → "A _ _ _ _ _ _ _ A"
 * Muestra la primera y última letra, el resto como "_".
 * Los espacios del nombre original se preservan como separadores.
 */
function censorName(name: string): string {
  return name
    .split("")
    .map((char, i) => {
      if (char === " ") return "  "; // doble espacio para separar palabras
      if (i === 0 || i === name.length - 1) return char;
      return "_";
    })
    .join(" ");
}

// ─── Tipos para la SectionList ────────────────────────────────────────────────

interface Section {
  title: Continent;
  data: Country[];
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

interface CountryRowProps {
  country: Country;
  isDiscovered: boolean;
}

const CountryRow: React.FC<CountryRowProps> = React.memo(
  ({ country, isDiscovered }) => (
    <View style={[styles.countryRow, isDiscovered && styles.countryRowFound]}>
      {isDiscovered ? (
        <>
          <Text style={styles.countryFlag}>✓</Text>
          <Text style={styles.countryNameFound}>{country.name}</Text>
        </>
      ) : (
        <>
          <Text style={styles.countryFlag}>?</Text>
          <Text style={styles.countryNameHidden}>
            {censorName(country.name)}
          </Text>
        </>
      )}
    </View>
  )
);

const SectionHeader: React.FC<{ title: string; found: number; total: number }> =
  ({ title, found, total }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionCount}>
        {found}/{total}
      </Text>
    </View>
  );

// ─── Pantalla principal ───────────────────────────────────────────────────────

export const GameScreen: React.FC = () => {
  const {
    discoveredIds,
    inputValue,
    lastGuessCorrect,
    setInput,
    submitGuess,
    resetGame,
  } = useGameStore();

  const progress = useGameStore(selectProgressPercentage);
  const discoveredSet = useMemo(() => new Set(discoveredIds), [discoveredIds]);

  // ── Animación de shake para respuesta incorrecta ───────────────────────────
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  // ── Manejar envío de respuesta ─────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    submitGuess();
    // Leer el resultado DESPUÉS de submitGuess
    setTimeout(() => {
      const { lastGuessCorrect: result } = useGameStore.getState();
      if (result === false) triggerShake();
    }, 0);
  }, [submitGuess, triggerShake]);

  // ── Secciones para SectionList, agrupadas y ordenadas ─────────────────────
  const sections = useMemo<Section[]>(() => {
    const continentMap = new Map<Continent, Country[]>();

    // Agrupar por continente
    COUNTRIES.forEach((country) => {
      const existing = continentMap.get(country.continent) ?? [];
      continentMap.set(country.continent, [...existing, country]);
    });

    // Ordenar países dentro de cada continente alfabéticamente
    const sorted: Section[] = [];
    continentMap.forEach((countries, continent) => {
      sorted.push({
        title: continent,
        data: [...countries].sort((a, b) => a.name.localeCompare(b.name, "es")),
      });
    });

    // Ordenar continentes alfabéticamente también
    return sorted.sort((a, b) => a.title.localeCompare(b.title, "es"));
  }, []);

  // ── Color del borde del input según último resultado ──────────────────────
  const inputBorderColor =
    lastGuessCorrect === true
      ? "#4CAF50"
      : lastGuessCorrect === false
      ? "#F44336"
      : "#444";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.title}>🌍 GeoQuiz</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {discoveredIds.length}/{COUNTRIES.length} · {progress}%
            </Text>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={resetGame}
              accessibilityLabel="Reiniciar partida"
            >
              <Text style={styles.resetBtnText}>↺ Nueva</Text>
            </TouchableOpacity>
          </View>

          {/* Barra de progreso */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* ── Input de respuesta ─────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.inputWrapper,
            { transform: [{ translateX: shakeAnim }] },
          ]}
        >
          <TextInput
            style={[styles.input, { borderColor: inputBorderColor }]}
            value={inputValue}
            onChangeText={setInput}
            onSubmitEditing={handleSubmit}
            placeholder="Escribe un país..."
            placeholderTextColor="#666"
            returnKeyType="send"
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel="Campo para escribir el nombre del país"
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleSubmit}
            accessibilityLabel="Enviar respuesta"
          >
            <Text style={styles.sendBtnText}>→</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Contenido scrollable: mapa + lista ────────────────────────── */}
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          // Mapa al tope de la lista como ListHeaderComponent
          ListHeaderComponent={
            <View style={styles.mapContainer}>
              <WorldMap discoveredIds={discoveredIds} />
            </View>
          }
          renderSectionHeader={({ section }) => {
            const found = section.data.filter((c) =>
              discoveredSet.has(c.id)
            ).length;
            return (
              <SectionHeader
                title={section.title}
                found={found}
                total={section.data.length}
              />
            );
          }}
          renderItem={({ item }) => (
            <CountryRow
              country={item}
              isDiscovered={discoveredSet.has(item.id)}
            />
          )}
          stickySectionHeadersEnabled
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  flex: {
    flex: 1,
  },

  // ── Header
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#0D0D0D",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  progressText: {
    color: "#B0BEC5",
    fontSize: 13,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#2C2C2C",
    borderRadius: 2,
    marginTop: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  resetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  resetBtnText: {
    color: "#B0BEC5",
    fontSize: 12,
    fontWeight: "600",
  },

  // ── Input
  inputWrapper: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  sendBtn: {
    width: 48,
    height: 48,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

  // ── Mapa
  mapContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },

  // ── Lista
  listContent: {
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111111",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#4CAF50",
  },
  sectionTitle: {
    color: "#E0E0E0",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  sectionCount: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "600",
  },
  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  countryRowFound: {
    backgroundColor: "rgba(76,175,80,0.06)",
  },
  countryFlag: {
    width: 28,
    fontSize: 14,
    color: "#555",
  },
  countryNameFound: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  countryNameHidden: {
    color: "#444",
    fontSize: 14,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    letterSpacing: 2,
  },
});

export default GameScreen;