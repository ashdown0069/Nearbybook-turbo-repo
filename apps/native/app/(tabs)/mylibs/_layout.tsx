import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "./DrawerContent";

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: "green",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "내 도서관",
          title: "내 도서관",
        }}
      />
      <Drawer.Screen
        name="[libCode]"
        options={{
          drawerItemStyle: { display: "none" },
          title: "도서관 상세",
        }}
      />
    </Drawer>
  );
}
