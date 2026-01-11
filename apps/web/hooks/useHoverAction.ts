import { useEffect, useRef } from "react";
import { useHoverDirty } from "react-use";

interface useHoverActionProps {
  action: () => Promise<void> | void;
  delay: number;
}

export const useHoverAction = (
  action: useHoverActionProps["action"],
  delay: useHoverActionProps["delay"] = 300,
) => {
  const ref = useRef<any>(null);
  const isHovered = useHoverDirty(ref);

  useEffect(() => {
    if (!isHovered) return;

    const timer = setTimeout(async () => {
      try {
        await action();
      } catch (error) {
        console.error("useHoverAction error");
      }
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [isHovered, delay, action]);
  return ref;
};
