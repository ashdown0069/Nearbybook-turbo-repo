import React from "react";
import {
  Pressable,
  Text,
  type PressableProps,
  ActivityIndicator,
} from "react-native";
import { View } from "react-native";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends Omit<PressableProps, "children"> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  textClassName?: string;
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "default",
  className = "",
  textClassName = "",
  isLoading = false,
  ...rest
}: ButtonProps) {
  const buttonStyles = {
    base: "items-center justify-center rounded-md disabled:opacity-50",
    variants: {
      primary: "bg-green-500",
      secondary: "bg-indigo-500",
      ghost: "bg-transparent",
    },
    sizes: {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
      icon: "size-10",
    },
  };

  const textStyles = {
    base: "font-semibold text-base",
    variants: {
      primary: "text-white",
      secondary: "text-white",
      ghost: "text-green-600",
    },
  };

  return (
    <Pressable
      {...rest}
      disabled={isLoading}
      className={cn(
        buttonStyles.base,
        buttonStyles.variants[variant],
        buttonStyles.sizes[size],
        className,
      )}
    >
      {isLoading && (
        <ActivityIndicator
          className="absolute"
          color={variant === "ghost" ? "#16a34a" : "#ffffff"}
        />
      )}
      <View className={cn("flex-row items-center", isLoading && "opacity-0")}>
        {typeof children === "string" ? (
          <Text
            className={cn(
              textStyles.base,
              textStyles.variants[variant],
              textClassName,
            )}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
}
