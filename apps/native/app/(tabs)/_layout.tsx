import { Tabs } from "expo-router";
// import { Ionicons } from '@expo/vector-icons'; // 아이콘용
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#22c55e",
      }}
    >
      <Tabs.Screen
        name="index" // app/(tabs)/index.tsx 파일을 의미
        options={{
          title: "HOME",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "검색",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mybooks" // app/(tabs)/mybooks.tsx
        options={{
          title: "서재",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="book-bookmark" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mylibs" // app/(tabs)/mylibs.tsx
        options={{
          href: null, //tab에서 안보이게, 아직 미완성
          title: "도서관",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="barcode"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
