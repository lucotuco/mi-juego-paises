// src/screens/StatsScreen.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Pantalla de estadísticas. Lee del store persistido y muestra:
//   · Progreso de la sesión actual
//   · Partidas jugadas
//   · Mejor porcentaje histórico
//   · Fecha de la última partida
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useGameStore,
  selectProgressPercentage,
  selectDiscoveredCountries,
} from "../store/useGameStore";
import { COUNTRIES } from "../data/countriesData";

// ─── Componente de tarjeta de stat ───────────────────────────────────────────

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subtitle,
  accent = false,
}) => (
  <View style={[styles.card, accent && styles.cardAccent]}>
    <Text style={styles.cardIcon}>{icon}</Text>
    <Text style={[styles.cardValue, accent && styles.cardValueAccent]}>
      {value}
    </Text>
    <Text style={styles.cardLabel}>{label}</Text>
    {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
  </View>
);

// ─── Formatear fecha ISO a string legible ─────────────────────────────────────

function formatDate(isoString: string | null): string {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Pantalla ─────────────────────────────────────────────────────────────────

export const StatsScreen: React.FC = () => {
  const { discoveredIds, stats } = useGameStore();
  const progress = useGameStore(selectProgressPercentage);
  const discovered = useGameStore(selectDiscoveredCountries);

  // Países descubiertos agrupados por continente para el resumen
  const byContinent = React.useMemo(() => {
    const map = new Map<string, number>();
    discovered.forEach((c) => {
      map.set(c.continent, (map.get(c.continent) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) =>
      a[0].localeCompare(b[0], "es")
    );
  }, [discovered]);

  const totalCountries = COUNTRIES.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Título ───────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.title}>📊 Estadísticas</Text>
          <Text style={styles.subtitle}>Tu rendimiento en GeoQuiz</Text>
        </View>

        {/* ── Progreso de sesión actual ─────────────────────────────────── */}
        <View style={styles.currentSession}>
          <Text style={styles.sectionLabel}>SESIÓN ACTUAL</Text>
          <View style={styles.bigProgress}>
            <Text style={styles.bigProgressNumber}>{progress}%</Text>
            <Text style={styles.bigProgressSub}>
              {discoveredIds.length} de {totalCountries} países
            </Text>
          </View>

          {/* Barra de progreso grande */}
          <View style={styles.progressBarLarge}>
            <View
              style={[styles.progressFillLarge, { width: `${progress}%` }]}
            />
          </View>

          {/* Detalle por continente */}
          {byContinent.length > 0 && (
            <View style={styles.continentBreakdown}>
              {byContinent.map(([continent, count]) => {
                const total = COUNTRIES.filter(
                  (c) => c.continent === continent
                ).length;
                const pct = Math.round((count / total) * 100);
                return (
                  <View key={continent} style={styles.continentRow}>
                    <Text style={styles.continentName}>{continent}</Text>
                    <View style={styles.continentBarWrap}>
                      <View
                        style={[
                          styles.continentBarFill,
                          { width: `${pct}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.continentCount}>
                      {count}/{total}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* ── Tarjetas de estadísticas históricas ──────────────────────── */}
        <Text style={styles.sectionLabel}>HISTORIAL</Text>
        <View style={styles.cardsGrid}>
          <StatCard
            icon="🎮"
            label="Partidas jugadas"
            value={stats.gamesPlayed}
          />
          <StatCard
            icon="🏆"
            label="Mejor porcentaje"
            value={`${stats.bestPercentage}%`}
            accent={stats.bestPercentage > 0}
          />
        </View>
        <StatCard
          icon="📅"
          label="Última partida"
          value={formatDate(stats.lastPlayedDate)}
        />

        {/* ── Logros desbloqueados ──────────────────────────────────────── */}
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>LOGROS</Text>
        <AchievementsPanel
          discovered={discoveredIds.length}
          total={totalCountries}
          bestPct={stats.bestPercentage}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Panel de logros ──────────────────────────────────────────────────────────

interface Achievement {
  id: string;
  icon: string;
  label: string;
  description: string;
  unlocked: boolean;
}

interface AchievementsPanelProps {
  discovered: number;
  total: number;
  bestPct: number;
}

const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  discovered,
  total,
  bestPct,
}) => {
  const achievements: Achievement[] = [
    {
      id: "first",
      icon: "🌱",
      label: "Primer país",
      description: "Adivina tu primer país",
      unlocked: discovered >= 1,
    },
    {
      id: "ten",
      icon: "🔟",
      label: "Explorador",
      description: "Adivina 10 países en una partida",
      unlocked: discovered >= 10,
    },
    {
      id: "half",
      icon: "🌗",
      label: "Mitad del mundo",
      description: "Llega al 50% en una partida",
      unlocked: bestPct >= 50,
    },
    {
      id: "all",
      icon: "🌍",
      label: "Geógrafo supremo",
      description: "Adivina todos los países",
      unlocked: discovered >= total && total > 0,
    },
  ];

  return (
    <View style={styles.achievementsGrid}>
      {achievements.map((a) => (
        <View
          key={a.id}
          style={[styles.achievement, !a.unlocked && styles.achievementLocked]}
        >
          <Text
            style={[
              styles.achievementIcon,
              !a.unlocked && styles.achievementIconLocked,
            ]}
          >
            {a.unlocked ? a.icon : "🔒"}
          </Text>
          <Text
            style={[
              styles.achievementLabel,
              !a.unlocked && styles.achievementTextLocked,
            ]}
          >
            {a.label}
          </Text>
          <Text
            style={[
              styles.achievementDesc,
              !a.unlocked && styles.achievementTextLocked,
            ]}
          >
            {a.description}
          </Text>
        </View>
      ))}
    </View>
  );
};

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },

  // ── Header
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  subtitle: {
    color: "#666",
    fontSize: 14,
    marginTop: 2,
  },

  // ── Sesión actual
  currentSession: {
    backgroundColor: "#141414",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#222",
  },
  sectionLabel: {
    color: "#555",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  bigProgress: {
    alignItems: "center",
    marginBottom: 16,
  },
  bigProgressNumber: {
    fontSize: 56,
    fontWeight: "900",
    color: "#4CAF50",
    lineHeight: 60,
  },
  bigProgressSub: {
    color: "#777",
    fontSize: 14,
    marginTop: 4,
  },
  progressBarLarge: {
    height: 8,
    backgroundColor: "#222",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFillLarge: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },

  // ── Continentes
  continentBreakdown: {
    gap: 8,
  },
  continentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  continentName: {
    color: "#B0BEC5",
    fontSize: 11,
    width: 130,
  },
  continentBarWrap: {
    flex: 1,
    height: 4,
    backgroundColor: "#222",
    borderRadius: 2,
    overflow: "hidden",
  },
  continentBarFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  continentCount: {
    color: "#555",
    fontSize: 11,
    width: 40,
    textAlign: "right",
  },

  // ── Tarjetas
  cardsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#141414",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  cardAccent: {
    borderColor: "#2E7D32",
    backgroundColor: "rgba(76,175,80,0.06)",
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  cardValueAccent: {
    color: "#4CAF50",
  },
  cardLabel: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  cardSubtitle: {
    color: "#444",
    fontSize: 11,
    marginTop: 2,
    textAlign: "center",
  },

  // ── Logros
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  achievement: {
    width: "47%",
    backgroundColor: "#141414",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  achievementLocked: {
    borderColor: "#1E1E1E",
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  achievementIconLocked: {
    opacity: 0.4,
  },
  achievementLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  achievementDesc: {
    color: "#666",
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
  },
  achievementTextLocked: {
    color: "#333",
  },
});

export default StatsScreen;