import { trackEvent } from "../umami"

describe("trackEvent", () => {
  let originalEnv: string | undefined

  beforeAll(() => {
    originalEnv = process.env.NODE_ENV
  })

  afterEach(() => {
    // 각 테스트 후 window.umami 및 NODE_ENV 정리
    delete (window as any).umami
    ;(process.env as any).NODE_ENV = originalEnv
    jest.restoreAllMocks()
  })

  it("window.umami가 존재하면 track을 호출해야 한다", () => {
    const mockTrack = jest.fn()
    ;(window as any).umami = { track: mockTrack }

    trackEvent("test-event", { key: "value" })

    expect(mockTrack).toHaveBeenCalledWith("test-event", { key: "value" })
    expect(mockTrack).toHaveBeenCalledTimes(1)
  })

  it("window.umami가 없으면 에러 없이 무시해야 한다", () => {
    expect(() => trackEvent("test-event")).not.toThrow()
  })

  it("데이터 없이 이벤트명만 전달할 수 있어야 한다", () => {
    const mockTrack = jest.fn()
    ;(window as any).umami = { track: mockTrack }

    trackEvent("simple-event")

    expect(mockTrack).toHaveBeenCalledWith("simple-event", undefined)
  })

  it("window.umami는 존재하나 track이 함수가 아닐 때 런타임 예외 없이 안전하게 무시되어야 한다", () => {
    ;(window as any).umami = { track: "not-a-function" }
    expect(() => trackEvent("test-event")).not.toThrow()
  })

  it("개발 환경에서 트래커가 없을 때 콘솔에 디버그 로그를 출력해야 한다", () => {
    ;(process.env as any).NODE_ENV = "development"
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {})

    trackEvent("debug-event", { check: true })

    expect(consoleSpy).toHaveBeenCalledWith('[Umami Debug] Event: "debug-event"', { check: true })
  })
})
