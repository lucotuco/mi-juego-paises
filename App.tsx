// App.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Punto de entrada. Configura:
//   · NavigationContainer  (React Navigation)
//   · Bottom Tab Navigator con 2 tabs: Juego y Estadísticas
//   · StatusBar oscura para el tema dark de la app
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, Platform, AppState, AppStateStatus } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { GameScreen } from "./src/screens/GameScreen";
import { StatsScreen } from "./src/screens/StatsScreen";
import { useGameStore } from "./src/store/useGameStore";

// ─── Navegación ───────────────────────────────────────────────────────────────

type RootTabParamList = {
  Juego: undefined;
  Estadísticas: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// ─── Componente raíz ──────────────────────────────────────────────────────────

export default function App() {
  const finishGame = useGameStore((s) => s.finishGame);

  // ── Guardar estadísticas cuando la app pasa a background ──────────────────
  // Esto es una red de seguridad: el usuario podría cerrar la app sin pasar
  // por resetGame(). Así persistimos el progreso actual antes de que el proceso muera.
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (nextState === "background" || nextState === "inactive") {
          finishGame();
        }
      }
    );
    return () => subscription.remove();
  }, [finishGame]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            // ── Tema general del Tab Bar ─────────────────────────────────
            tabBarStyle: {
              backgroundColor: "#0A0A0A",
              borderTopColor: "#1A1A1A",
              borderTopWidth: 1,
              height: Platform.OS === "ios" ? 84 : 64,
              paddingBottom: Platform.OS === "ios" ? 28 : 8,
              paddingTop: 8,
            },
            tabBarActiveTintColor: "#4CAF50",
            tabBarInactiveTintColor: "#444",
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: "600",
              letterSpacing: 0.5,
            },
            // Ocultamos el header de React Navigation (lo manejamos nosotros)
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Juego"
            component={GameScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: size - 4, color }}>🌍</Text>
              ),
              tabBarLabel: "Juego",
            }}
          />
          <Tab.Screen
            name="Estadísticas"
            component={StatsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: size - 4, color }}>📊</Text>
              ),
              tabBarLabel: "Stats",
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}