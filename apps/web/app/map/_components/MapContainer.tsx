"use client";
import { MapProps } from "@/types/type";
import dynamic from "next/dynamic";
// import MapContainer from "./MapContainer";
const Map = dynamic(() => import("./Map"), {
  ssr: false,
});

export default function MapContainer({ isbn, region, dtlRegion }: MapProps) {
  return <Map isbn={isbn} region={region} dtlRegion={dtlRegion} />;
}
