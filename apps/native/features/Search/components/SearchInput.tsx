import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  TextInputSubmitEditingEvent,
  View,
} from "react-native";
import { ChevronLeft, SearchIcon } from "lucide-react-native";
import { useRouter } from "expo-router";

interface SearchInputProps {
  placeholder: string;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  validation?: (query: string) => boolean;
}

export default function SearchInput({
  placeholder,
  query,
  setQuery,
  validation,
}: SearchInputProps) {
  const [inputText, setInputText] = useState(query);
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleSearch = () => {
    if (validation) {
      const isValid = validation(inputText);
      if (!isValid) {
        Keyboard.dismiss();
        return;
      }
    }

    return setQuery(() => inputText.trim());
  };

  return (
    <KeyboardAvoidingView
      className="mt-3 flex h-12 flex-row"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Pressable
        onPress={handleGoBack}
        className="flex h-full w-12 items-center justify-center"
      >
        <ChevronLeft size={30} />
      </Pressable>
      <View className="h-full flex-1 px-2">
        <TextInput
          className="size-full rounded-3xl border-2 border-black bg-transparent"
          placeholder={placeholder}
          onChangeText={setInputText}
          value={inputText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
