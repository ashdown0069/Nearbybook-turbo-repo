import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMigrationHelper } from "@/db/drizzle";
import { DatabaseProvider } from "@/db/provider";
import { toast, Toaster } from "sonner-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  EnvVarConfig,
  FloatingDevTools,
  StorageKeyConfig,
} from "@react-buoy/core";
import { Platform, Pressable } from "react-native";
import * as ExpoDevice from "expo-device";
import { useSyncQueriesExternal } from "react-query-external-sync";
import Constants from "expo-constants";
import { storage } from "@/lib/mmkvStore";
import { useDoubleBackToExit } from "@/hooks/useDoubleBackToExit";
const queryClient = new QueryClient({});
const hostIP =
  Constants.expoGoConfig?.debuggerHost?.split(`:`)[0] ||
  Constants.expoConfig?.hostUri?.split(`:`)[0];
export default function RootLayout() {
  useMigrationHelper();
  useDoubleBackToExit();
  useSyncQueriesExternal({
    queryClient,
    socketURL: `http://${hostIP}:42831`, // Use local network IP
    deviceName: Platform?.OS || "web",
    platform: Platform?.OS || "web",
    deviceId: Platform?.OS || "web",
    extraDeviceInfo: {
      appVersion: "1.0.0",
    },
    enableLogs: false,
    envVariables: {
      NODE_ENV: process.env.NODE_ENV,
    },
    // Storage monitoring
    mmkvStorage: storage,
    // asyncStorage: AsyncStorage,
    // secureStorage: SecureStore,
    // secureStorageKeys: ["userToken", "refreshToken"],
  });

  // const requiredEnvVars: EnvVarConfig[] = [
  //   { key: "EXPO_PUBLIC_DEBUG_MODE", expectedType: "boolean" },
  // ];

  // const requiredStorageKeys: StorageKeyConfig[] = [
  //   {
  //     key: "@app/session",
  //     expectedType: "string",
  //     storageType: "async",
  //   },
  // ];

  return (
    <DatabaseProvider>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {/* <FloatingDevTools
            requiredEnvVars={requiredEnvVars}
            requiredStorageKeys={requiredStorageKeys}
            disableHints
            environment="local"
            userRole="admin"
          /> */}
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="(search)"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="(maps)/bookmap"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="(maps)/libsmap"
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack>
              <Toaster
                position="bottom-center"
                offset={100}
                swipeToDismissDirection="up"
              />
            </BottomSheetModalProvider>
            <StatusBar style="auto" />
          </GestureHandlerRootView>
        </QueryClientProvider>
      </SafeAreaProvider>
    </DatabaseProvider>
  );
}
