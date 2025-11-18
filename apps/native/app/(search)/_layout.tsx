import { Stack } from "expo-router";
import React from "react";

export default function SearchLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="searchISBN"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
