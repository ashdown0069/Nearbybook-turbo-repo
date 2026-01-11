import React from "react";
import { preconnect } from "react-dom";

export default function usePreconnect() {
  preconnect("https://api.nearbybook.kr");
  preconnect("https://image.aladin.co.kr");
  preconnect("http://image.aladin.co.kr");
  preconnect("http://shopping-phinf.pstatic.net");
  preconnect("https://bookthumb-phinf.pstatic.net");
  return null;
}
