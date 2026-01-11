import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, Text } from "react-native";
import { toast } from "sonner-native";

export const useToast = () => {
  const router = useRouter();

  //close 를 써야 한줄에 버튼표시가능
  //아니면 모든걸 새로 만들어야해서 번거로움
  //tailwind 버그있어서 스타일 직접 지정
  const showSaveBookToast = useCallback(() => {
    toast("책이 성공적으로 저장되었습니다.", {
      duration: 2000,
      style: {
        backgroundColor: "#262626",
        paddingVertical: 20,
      },
      styles: {
        title: {
          color: "white",
        },
      },
      icon: <></>,
      close: (
        <Pressable style={{}} onPress={() => router.push("/(tabs)/mybooks")}>
          <Text
            style={{
              color: "#22c55e",
              fontWeight: "600",
            }}
          >
            확인하기
          </Text>
        </Pressable>
      ),
    });
  }, [router]);

  const showSaveLibraryToast = useCallback(() => {
    toast("도서관을 찜 했습니다.", {
      duration: 2000,
      style: {
        backgroundColor: "#262626",
        paddingVertical: 20,
      },
      styles: {
        title: {
          color: "white",
        },
      },
      icon: <></>,
      close: (
        <Pressable style={{}} onPress={() => router.push("/(tabs)/mylibs")}>
          <Text
            style={{
              color: "#22c55e",
              fontWeight: "600",
            }}
          >
            확인하기
          </Text>
        </Pressable>
      ),
    });
  }, [router]);

  const showDeleteBookToast = useCallback(() => {
    toast.success("도서가 서재에서 삭제되었습니다.", {
      position: "top-center",
      duration: 1000,
      richColors: true,
    });
  }, []);

  const showExitToast = useCallback(() => {
    toast("한번 더 누르면 앱이 종료됩니다.", {
      duration: 2000,
      style: {
        backgroundColor: "#262626",
        paddingVertical: 12,
        justifyContent: "center",
      },
      styles: {
        title: {
          color: "white",
          textAlign: "center",
        },
      },
      icon: <></>,
    });
  }, []);

  return {
    showSaveBookToast,
    showDeleteBookToast,
    showSaveLibraryToast,
    showExitToast,
  };
};
