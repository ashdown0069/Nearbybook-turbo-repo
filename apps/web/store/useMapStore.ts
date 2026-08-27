import { create } from "zustand";

interface District {
  name: string | undefined;
  code: string | undefined;
}

interface MapState {
  region: District | undefined
  dtl_region: District | undefined
  myLng: number | undefined
  myLat: number | undefined
  status: "loading" | "success" | "error"
  isLocationAllowed: boolean
}

interface MapActions {
  setRegion: (region: District, dtl_region: District | undefined) => void
  setMyPosition: (lat: number, lng: number) => void
  setStatus: (status: MapState["status"]) => void
  setIsLocationAllowed: (isAllowed: boolean) => void
  resetRegions: () => void
}

export const useMapStore = create<MapState & MapActions>((set) => ({
  region: undefined,
  dtl_region: undefined,
  myLng: undefined,
  myLat: undefined,
  status: "loading",
  isLocationAllowed: false,
  setRegion: (region, dtl_region) => set({ region, dtl_region }),
  setMyPosition: (lat, lng) => set({ myLat: lat, myLng: lng }),
  setStatus: (status) => set({ status }),
  setIsLocationAllowed: (isLocationAllowed) => set({ isLocationAllowed }),
  resetRegions: () =>
    set({ region: undefined, dtl_region: undefined, isLocationAllowed: false }),
}))
