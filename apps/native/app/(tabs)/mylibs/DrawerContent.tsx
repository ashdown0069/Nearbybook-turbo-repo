import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useLibraryDataBase } from "@/db/service/Library";
import { LibraryBig } from "lucide-react-native";
export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { savedLibraries } = useLibraryDataBase(); //   DB에서 도서관 목록 가져오기

  return (
    <DrawerContentScrollView {...props}>
      {/* <DrawerItemList {...props} /> */}

      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          저장된 도서관
        </Text>
      </View>
      {savedLibraries?.map((lib) => (
        <DrawerItem
          key={lib.id}
          label={lib.libName} // 도서관 이름
          onPress={() => {
            router.push({
              pathname: "/(tabs)/mylibs/[libCode]",
              params: { libCode: lib.libCode, name: lib.libName },
            });
          }}
        />
      ))}
    </DrawerContentScrollView>
  );
}
