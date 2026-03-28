"use client";

import Script from "next/script";
import { useState } from "react";
import LoadingScreen from "@/components/Loading";

export default function NaverMapProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMapsReady, setIsMapsReady] = useState(false);
  const [isGeocoderReady, setIsGeocoderReady] = useState(false);

  const isReady = isMapsReady && isGeocoderReady;

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_MAP_CLIENT_ID}`}
        id="naver-map-script"
        strategy="afterInteractive"
        onReady={() => setIsMapsReady(true)}
      />
      {isMapsReady && (
        <Script
          src="https://oapi.map.naver.com/openapi/v3/maps-geocoder.js"
          id="naver-map-script-geocoder"
          strategy="afterInteractive"
          onReady={() => setIsGeocoderReady(true)}
        />
      )}
      {isReady ? children : <LoadingScreen />}
    </>
  );
}
