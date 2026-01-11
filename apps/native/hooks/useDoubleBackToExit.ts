import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { BackHandler, Platform } from "react-native";
import { useToast } from "@/features/Toast/useToast";

export const useDoubleBackToExit = () => {
  const router = useRouter();
  const { showExitToast } = useToast();
  const lastBackPress = useRef<number>(0);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const onBackPress = () => {
      // If we can go back in the navigation stack, let the default behavior happen
      // router.canGoBack() works for nested navigators as well
      if (router.canGoBack()) {
        return false; // Propagate the event
      }

      const currentTime = Date.now();
      const EXIT_DELAY = 2000;

      if (currentTime - lastBackPress.current < EXIT_DELAY) {
        // Double tap happened
        BackHandler.exitApp();
        return true;
      }

      lastBackPress.current = currentTime;
      showExitToast();
      return true; // Consume the event so the app doesn't minimize/close immediately
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    return () => subscription.remove();
  }, [router, showExitToast]);
};
