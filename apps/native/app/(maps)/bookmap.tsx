// MapScreen.tsx

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  NaverMapMarkerOverlay,
  NaverMapView,
  type NaverMapViewRef,
} from "@mj-studio/react-native-naver-map";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { useMapInit } from "@/hooks/useMapInit";
import { openSettingsAlert } from "@/utils/permissionAlert";
import { useGetLibsByISBN } from "@repo/data-access";
import { axiosInstance } from "@/lib/axios";
import { useCurrentRegion } from "@/hooks/useCurrentRegion";
import { useCurrentBookStore } from "@/store/useCurrentBook";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useDebounce } from "@/hooks/useDebounce";
import {
  MapSearchAgainBtn,
  MapLoading,
  MapMyLocationBtn,
} from "@/features/Map/components";
import { Library } from "@repo/types";
import LibraryInfo from "@/features/Map/components/bottomsheet/LibraryInfo";
import SearchInfo from "@/components/BottomSheet/SearchInfo";
import BottomSheetBookInfo from "@/features/Map/components/bottomsheet/BottomSheetBookInfo";
import { useWindowDimensions } from "react-native";
export default function MapScreen() {
  const { width, height } = useWindowDimensions();
  const [showSearchBtn, setShowSearchBtn] = useState(false);
  const [hasBookMarker, setHasBookMarker] = useState(false);
  const [selectedLib, setSelectedLib] = useState<Library | null>(null);
  //현재 지도에서 선택된 도서
  const selectedBook = useCurrentBookStore((state) => state.selectedBook);

  //bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);

  const animatedPosition = useSharedValue(0); // 애니메이션 값 설정

  const floatingButtonStyle = useAnimatedStyle(() => {
    // 버튼 위치 동기화 스타일 정의
    //시트 상단 - 70px 위치로 설정
    return {
      transform: [{ translateY: animatedPosition.value - 70 }],
    };
  });
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  //naver map ref
  const mapRef = useRef<NaverMapViewRef>(null);

  const handleScreenToCoordinate = async () => {
    const coordinate = await mapRef.current?.screenToCoordinate({
      screenX: width / 2,
      screenY: height / 2,
    });
    return coordinate;
  };

  const handleSearchAgain = async () => {
    const coordinate = await handleScreenToCoordinate();
    if (!coordinate) return;
    const { latitude, longitude } = coordinate;
    setLocation(() => ({
      latitude,
      longitude,
    }));
    setShowSearchBtn(false);
  };
  const handleTapMarker = () => {};
  const startFollowMode = async () => {
    //위치를 찾은 후 follow mode 활성화
    return setTimeout(() => {
      mapRef.current?.setLocationTrackingMode("Follow");
    }, 500);
  };

  //1. 위치 찾기, 거부하면 서울 시청 기본위치 설정
  const { isLoading, location, errorMsg, refetch, setLocation } = useMapInit(
    "screenlocation",
    startFollowMode,
  );
  // console.log("error msg", errorMsg);
  //2. 위치 토대로 도서관 코드 필터링
  const { regionCodes } = useCurrentRegion(location);
  // console.log("regionCodes", regionCodes);
  //3. isbn 과 지역 도서관 코드로 검색
  const {
    data: searchData,
    isLoading: searchLoading,
    isError: searchError,
  } = useGetLibsByISBN(
    axiosInstance,
    selectedBook ? selectedBook.isbn : "",
    regionCodes.region,
    regionCodes.dtlRegion,
  );
  // console.log("searchData", searchData);
  // const searchData = MOCK_LIBRARY_DATA;
  // const searchLoading = false;
  // console.log("searchData", searchData);

  useEffect(() => {
    //처음 렌더링 후 searchData가 존재시
    //hasBook 있는곳으로 카메라 이동
  }, []);

  //내 위치 버튼 누를 경우
  const handleLocationButton = async () => {
    console.log("press handleLocationButton");
    const { status, granted } =
      await Location.requestForegroundPermissionsAsync();
    if (status === "denied") {
      openSettingsAlert();
      return;
    }
    const isEnabled = await Location.hasServicesEnabledAsync();
    if (!isEnabled) {
      await Location.enableNetworkProviderAsync();
    }

    return setTimeout(() => {
      mapRef.current?.setLocationTrackingMode("Follow");
    }, 300);
  };

  const handleShowButtonDebounced = useDebounce(() => {
    setShowSearchBtn(true);
  }, 500);

  const snapPoints = useMemo(() => ["40%"], []);
  if (searchLoading) {
    return <MapLoading />;
  }
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={{
        bottom: "additive",
        top: "off",
        right: "additive",
        left: "additive",
      }}
    >
      {/* 지도 영역 */}
      <View className="relative flex-1 bg-gray-200">
        {/* 지도가 로딩되기 전까지 빈 화면이나 로딩바를 보여주는 것이 안전할 수 있습니다 */}
        <NaverMapView
          ref={mapRef}
          style={{ flex: 1, width: "100%", height: "100%" }}
          minZoom={7}
          maxZoom={18}
          initialCamera={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            zoom: 12,
          }}
          isShowZoomControls={false}
          isShowCompass={false}
          onTapMap={() => {
            //맵클릭시 바텀시트 닫기
            bottomSheetRef.current?.close({
              duration: 400,
            });
            setSelectedLib(null);
          }}
          onCameraChanged={(e) => {
            if (e.reason === "Gesture") {
              // (선택 사항) 드래그 시작 시 버튼을 즉시 숨기고 싶다면 아래 주석 해제
              setShowSearchBtn(false);

              // 디바운스 함수 호출 (계속 호출되어도 마지막 호출 후 500ms 뒤에 한 번만 실행됨)
              handleShowButtonDebounced();
            }
          }}
          // onCameraIdle={() => {
          //   //카메라 움직임 끝나면 재검색버튼 활성화
          //   if (!searchLoading) setShowSearchBtn(true);
          // }}
          isExtentBoundedInKorea // 한국으로 위치한정하기
        >
          {searchData &&
            searchData.length > 0 &&
            searchData.map((lib, index) => (
              <NaverMapMarkerOverlay
                key={`${lib.libCode}-${lib.hasBook}`}
                width={70}
                height={70}
                image={
                  lib.hasBook
                    ? require("../../assets/images/test-check.png")
                    : require("../../assets/images/test-x.png")
                }
                onTap={() => {
                  console.log("marker tap");

                  setSelectedLib({ ...lib });
                  bottomSheetRef.current?.snapToIndex(0, {
                    duration: 400,
                  });
                }}
                latitude={Number(lib.latitude) ?? 0}
                longitude={Number(lib.longitude) ?? 0}
              />
            ))}
        </NaverMapView>
        <Animated.View
          style={[
            { position: "absolute", left: 0, right: 0, top: 0, zIndex: 10 }, // zIndex 중요
            floatingButtonStyle,
          ]}
          pointerEvents={"box-none"}
        >
          <MapMyLocationBtn onPress={handleLocationButton} />
          {showSearchBtn && <MapSearchAgainBtn onPress={handleSearchAgain} />}
        </Animated.View>
        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          index={0}
          animatedPosition={animatedPosition}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          enablePanDownToClose={true}
        >
          <BottomSheetView className="h-full px-5 pt-2">
            <BottomSheetBookInfo
              bookname={selectedBook?.bookname!}
              authors={selectedBook?.authors!}
              isbn={selectedBook?.isbn!}
            />
            {selectedLib && <LibraryInfo {...selectedLib} />}
            {selectedLib == null && <SearchInfo />}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
}
