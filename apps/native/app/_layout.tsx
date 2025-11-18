import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { useMigrationHelper } from "@/db/drizzle";
import { DatabaseProvider } from "@/db/provider";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/Toast/ToastConfig";
const queryClient = new QueryClient({});

export default function RootLayout() {
  useReactQueryDevTools(queryClient);
  useMigrationHelper(); // DB 마이그레이션 훅은 여기에 두는 것이 좋습니다.

  return (
    <DatabaseProvider>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
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
          </Stack>
          <Toast config={toastConfig} />
          <StatusBar style="auto" />
        </QueryClientProvider>
      </SafeAreaProvider>
    </DatabaseProvider>
  );
}
