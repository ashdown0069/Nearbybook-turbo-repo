import BookItem from "@/features/Book/components/BookItem";
import BookBottomSheetModal from "@/components/BottomSheet/BookBottomSheetModal";
import ModalBookItem from "@/components/BottomSheet/BookItemModal";
import Loading from "@/components/Loading";
import FindOnTheMap from "@/features/Map/components/bottomsheet/FindOnTheMap";
import SaveBookOnTheShelf from "@/features/Map/components/bottomsheet/SaveBookOnTheShelf";
import { axiosInstance } from "@/lib/axios";
import { useCurrentBookStore } from "@/store/useCurrentBook";
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSearchBook } from "@repo/data-access";
import { router, useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Text,
  View,
  Alert,
  Vibration,
  AppState,
  AppStateStatus,
  Linking,
  TouchableOpacity,
  StyleSheet,
  BackHandler, // Camera 컴포넌트의 풀스크린 설정을 위해 최소한으로 유지
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";

export default function BarcodeScannerScreen() {
  // 1. 권한 및 장치 설정
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const format = useCameraFormat(device, [
    {
      videoResolution: { width: 1280, height: 720 },
      fps: 30,
    },
  ]);

  // 2. 상태 관리
  const [isScanned, setIsScanned] = useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );
  const selectBook = useCurrentBookStore((state) => state.selectBook);
  const [ISBN, setISBN] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  //3. 모달
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleOpenModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleCloseModal = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  //4. 페칭로직
  const { data, isLoading, isError } = useSearchBook(axiosInstance, ISBN);

  useEffect(() => {
    if (data && data.isbn) {
      selectBook(data);
    }
  }, [data, selectBook]);

  // 5. 앱 생명주기 감지
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setAppState(nextAppState);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isModalOpen) {
          handleCloseModal();
        } else {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/");
          }
        }
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [isModalOpen]),
  );

  // 6. 시작시 권한 요청
  useEffect(() => {
    if (!hasPermission) requestPermission();
    // handleOpenModal();
    // setIsScanned(false);
  }, [hasPermission, requestPermission]);

  // 7. 스캔 핸들러
  const onCodeScanned = useCallback(
    (codes: any[]) => {
      if (isScanned) return;
      console.log("codes", codes);
      const value = codes[0]?.value;
      if (value) {
        setIsScanned(true);
        Vibration.vibrate();
        console.log(`[Scan Success] ISBN: ${value}`);
        setISBN(() => value);
        handleOpenModal();
        // Alert.alert("도서 바코드 인식", `ISBN: ${value}`, [
        //   { text: "확인", onPress: () => setIsScanned(false) },
        // ]);
      }
    },
    [isScanned, handleOpenModal],
  );

  // 8. 코드 스캐너 설정
  const codeScanner = useCodeScanner({
    codeTypes: ["ean-13"], //isbn 13 만 허용
    onCodeScanned: onCodeScanned,
  });

  // 9. 예외 처리 UI (권한 없음)
  if (!hasPermission) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="mb-5 text-base text-gray-800">
          카메라 권한이 필요합니다.
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openSettings()}
          className="rounded-lg bg-blue-500 p-3"
        >
          <Text className="font-bold text-white">설정으로 이동</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (device == null) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">카메라 장치를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  // 10. 렌더링
  const isCameraActive = appState === "active" && !isScanned;

  return (
    <SafeAreaView className="relative flex-1 bg-black">
      <Camera
        style={StyleSheet.absoluteFill}
        // format={format}
        video={false}
        photo={false}
        device={device}
        isActive={isCameraActive}
        codeScanner={codeScanner}
      />
      {/* 스캔 안내 */}
      <View className="absolute bottom-16 self-center rounded-lg border border-white bg-black/60 p-3">
        <View className="items-center justify-center">
          <Text className="text-center text-base font-bold text-white">
            책 뒷면의 바코드를 비춰주세요
          </Text>
        </View>
      </View>
      <BookBottomSheetModal
        ref={bottomSheetModalRef}
        detached={true}
        bottomInset={100}
        containerStyle={{
          marginHorizontal: 10,
        }}
        onChange={(idx) => {
          setIsModalOpen(idx === 0 ? true : false);
          if (idx === -1) {
            //닫힐 때
            setIsScanned(false);
          }
        }}
      >
        <View className="h-96 flex-1 p-3">
          {isLoading && <Loading />}
          {data && (
            <View className="flex-1">
              <ModalBookItem book={data} />
              <SaveBookOnTheShelf onPress={handleCloseModal} />
              <FindOnTheMap
                href={"../(maps)/bookmap"}
                onPress={handleCloseModal}
              />
            </View>
          )}
        </View>
      </BookBottomSheetModal>
    </SafeAreaView>
  );
}
