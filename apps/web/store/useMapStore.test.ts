import { act } from "@testing-library/react";
import { useMapStore } from "./useMapStore";

const initialState = useMapStore.getState();

describe("useMapStore 스토어", () => {
  beforeEach(() => {
    useMapStore.setState(initialState);
  });

  it("올바른 초기 상태를 가져야 한다", () => {
    const state = useMapStore.getState();
    expect(state.region).toBeUndefined();
    expect(state.dtl_region).toBeUndefined();
    expect(state.myLat).toBeUndefined();
    expect(state.myLng).toBeUndefined();
    expect(state.status).toBe("loading");
  });

  it("지역과 상세 지역을 올바르게 설정해야 한다", () => {
    const newRegion = { code: "11", name: "서울특별시" };
    const newDtlRegion = { code: "11010", name: "종로구" };

    act(() => {
      useMapStore.getState().setRegion(newRegion, newDtlRegion);
    });

    const state = useMapStore.getState();
    expect(state.region).toEqual(newRegion);
    expect(state.dtl_region).toEqual(newDtlRegion);
  });

  it("내 위치를 올바르게 설정해야 한다", () => {
    const lat = 37.5665;
    const lng = 126.978;

    act(() => {
      useMapStore.getState().setMyPosition(lat, lng);
    });

    const state = useMapStore.getState();
    expect(state.myLat).toBe(lat);
    expect(state.myLng).toBe(lng);
  });

  it("상태를 올바르게 설정해야 한다", () => {
    act(() => {
      useMapStore.getState().setStatus("success");
    });
    expect(useMapStore.getState().status).toBe("success");

    act(() => {
      useMapStore.getState().setStatus("error");
    });
    expect(useMapStore.getState().status).toBe("error");
  });

  it("지역 정보를 올바르게 초기화해야 한다", () => {
    const newRegion = { code: "11", name: "서울특별시" };
    const newDtlRegion = { code: "11010", name: "종로구" };
    act(() => {
      useMapStore.getState().setRegion(newRegion, newDtlRegion);
    });

    let state = useMapStore.getState();
    expect(state.region).toBeDefined();
    expect(state.dtl_region).toBeDefined();

    //리셋
    act(() => {
      useMapStore.getState().resetRegions();
    });

    // 지역이 undefined로 리셋되었는지 확인
    state = useMapStore.getState();
    expect(state.region).toBeUndefined();
    expect(state.dtl_region).toBeUndefined();
  });
});