import Constants from "expo-constants";
const getBackendBaseUrl = () => {
  //배포 환경
  if (!__DEV__) {
    return process.env.EXPO_PUBLIC_API_URL as string; // .env 파일에서 가져온 주소
  }
  const port = process.env.EXPO_PUBLIC_BACKEND_PORT || "8080";
  // 개발 환경
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  // 시뮬레이터용 폴백
  if (!localhost) {
    return "http://localhost:8080";
  }

  return `http://${localhost}:${port}`;
};

export const BACKEND_API_BASE_URL = getBackendBaseUrl();
