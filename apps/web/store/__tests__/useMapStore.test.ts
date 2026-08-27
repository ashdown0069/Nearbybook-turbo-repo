import { useMapStore } from "../useMapStore"

describe("useMapStore - isLocationAllowed", () => {
  beforeEach(() => {
    useMapStore.setState({
      region: undefined,
      dtl_region: undefined,
      myLng: undefined,
      myLat: undefined,
      status: "loading",
      isLocationAllowed: false,
    })
  })

  it("isLocationAllowed의 초기값은 false여야 한다", () => {
    expect(useMapStore.getState().isLocationAllowed).toBe(false)
  })

  it("setIsLocationAllowed 호출 시 값이 정상 업데이트되어야 한다", () => {
    useMapStore.getState().setIsLocationAllowed(true)
    expect(useMapStore.getState().isLocationAllowed).toBe(true)

    useMapStore.getState().setIsLocationAllowed(false)
    expect(useMapStore.getState().isLocationAllowed).toBe(false)
  })
})
