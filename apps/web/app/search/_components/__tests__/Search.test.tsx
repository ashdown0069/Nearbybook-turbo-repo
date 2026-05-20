import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Search from "../Search"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { PrefetchSearchBooks } from "@workspace/data-access"

// Next.js 기능 모킹
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  redirect: jest.fn(),
}))

jest.mock("next/form", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => {
    // action prop을 DOM form에 전달하지 않도록 분리
    const { action, ...rest } = props
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault() // 폼 제출 시 페이지 리로드 및 실제 action 실행 방지
        }}
        {...rest}
      >
        {children}
      </form>
    )
  },
}))

// TanStack Query 모킹
jest.mock("@tanstack/react-query", () => ({
  useQueryClient: jest.fn(),
}))

// API 및 의존성 모킹
jest.mock("@workspace/data-access", () => ({
  PrefetchSearchBooks: jest.fn(),
}))

jest.mock("@/lib/axios", () => ({
  axiosInstance: {},
}))

// Autocomplete 모킹
jest.mock("../Autocomplete", () => ({
  __esModule: true,
  default: ({ isOpen, onSelect }: any) =>
    isOpen ? (
      <div data-testid="autocomplete">
        <button onClick={() => onSelect("추천 검색어")}>추천 검색어</button>
      </div>
    ) : null,
}))

// Radix UI Select 모킹 (복잡한 상호작용 회피 및 모드 변경 테스트 목적)
jest.mock("@workspace/ui/components/select", () => {
  const React = require("react")
  return {
    Select: ({ onValueChange, children, defaultValue }: any) => (
      <div data-testid="mock-select" onClick={() => onValueChange("isbn")}>
        {children}
      </div>
    ),
    SelectContent: ({ children }: any) => <div>{children}</div>,
    SelectItem: ({ children, value }: any) => (
      <div data-value={value}>{children}</div>
    ),
    SelectTrigger: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  }
})

describe("Search 컴포넌트", () => {
  const mockPush = jest.fn()
  const mockQueryClient = { prefetchQuery: jest.fn() }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useQueryClient as jest.Mock).mockReturnValue(mockQueryClient)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("정상적으로 렌더링되어야 한다", () => {
    render(<Search />)
    expect(
      screen.getByPlaceholderText("도서명을 입력하세요")
    ).toBeInTheDocument()
    expect(screen.getByTestId("submit-button")).toBeInTheDocument()
  })

  it("검색 모드(제목/ISBN)를 변경할 수 있어야 한다 (모드 변경 및 placeholder 변경 검증)", async () => {
    const user = userEvent.setup()
    render(<Search />)

    // 초기에는 제목 placeholder
    expect(
      screen.getByPlaceholderText("도서명을 입력하세요")
    ).toBeInTheDocument()

    // Select 트리거를 클릭하여 onValueChange 호출 유도 (모드 변경)
    const select = screen.getByTestId("mock-select")
    await user.click(select)

    // isbn 모드로 변경되면 placeholder가 바뀜
    expect(
      screen.getByPlaceholderText("ISBN을 입력하세요.")
    ).toBeInTheDocument()
  })

  it("입력값이 있으면 Autocomplete가 표시되고 Prefetch가 호출되어야 한다", async () => {
    const user = userEvent.setup()
    render(<Search />)

    const input = screen.getByRole("searchbox")
    await user.type(input, "테스트")

    expect(screen.getByTestId("autocomplete")).toBeInTheDocument()

    // useDebounce가 500ms 이후 실행되므로 대기
    await waitFor(
      () => {
        expect(PrefetchSearchBooks).toHaveBeenCalled()
      },
      { timeout: 600 }
    )
  })

  it("입력값이 비어 있으면 포커스를 해도 Autocomplete가 표시되지 않아야 한다 (handleFocus 빈 값 분기)", async () => {
    const user = userEvent.setup()
    render(<Search />)

    const input = screen.getByRole("searchbox")
    await user.click(input) // focus 트리거

    expect(screen.queryByTestId("autocomplete")).not.toBeInTheDocument()
  })

  it("입력값이 있을 때 포커스를 지웠다 바로 다시 주면 닫히지 않아야 강건하다 (handleFocus clearTimeout 분기)", async () => {
    const user = userEvent.setup()
    render(<Search />)

    const input = screen.getByRole("searchbox")
    await user.type(input, "테스트")
    expect(screen.getByTestId("autocomplete")).toBeInTheDocument()

    // blur 발생 -> 타이머 시작
    fireEvent.blur(input)
    // 즉시 다시 focus 발생 -> 타이머 클리어
    fireEvent.focus(input)

    await waitFor(
      () => {
        expect(screen.getByTestId("autocomplete")).toBeInTheDocument()
      },
      { timeout: 300 }
    )
  })

  it("입력값이 비어 있으면 Autocomplete가 표시되지 않아야 한다", async () => {
    const user = userEvent.setup()
    render(<Search />)

    const input = screen.getByRole("searchbox")
    await user.type(input, "테스트")
    await user.clear(input)

    expect(screen.queryByTestId("autocomplete")).not.toBeInTheDocument()
  })

  it("Autocomplete에서 항목을 선택하면 해당 검색어로 이동해야 한다", async () => {
    const user = userEvent.setup()
    render(<Search />)

    const input = screen.getByRole("searchbox")
    await user.type(input, "테스트")

    const suggestion = screen.getByText("추천 검색어")
    await user.click(suggestion)

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining(
        "query=%EC%B6%94%EC%B2%9C%20%EA%B2%80%EC%83%89%EC%96%B4"
      )
    )
  })

  it("Escape 키를 누르면 Autocomplete가 닫혀야 한다 (handleKeyDown 분기)", async () => {
    const user = userEvent.setup()
    render(<Search />)

    const input = screen.getByRole("searchbox")
    await user.type(input, "테스트")
    expect(screen.getByTestId("autocomplete")).toBeInTheDocument()

    await user.keyboard("{Escape}")
    expect(screen.queryByTestId("autocomplete")).not.toBeInTheDocument()
  })

  it("Enter 키를 누르는 등 다른 키에는 Autocomplete가 닫히지 않아야 한다", async () => {
    const user = userEvent.setup()
    render(<Search />)

    const input = screen.getByRole("searchbox")
    await user.type(input, "테스트")
    expect(screen.getByTestId("autocomplete")).toBeInTheDocument()

    // prevent default onSubmit navigation in Form mock
    await user.keyboard("{Enter}")
    expect(screen.getByTestId("autocomplete")).toBeInTheDocument()
  })

  it("에러 상태일 때 에러 메시지를 렌더링해야 한다 (state.error 분기)", () => {
    // useActionState 훅을 모킹하여 에러 상태 반환
    jest.spyOn(React, "useActionState").mockReturnValue([
      {
        error: "검색 중 오류가 발생했습니다.",
        success: false,
        query: "",
        mode: "title",
      },
      jest.fn(),
      false,
    ])

    render(<Search />)
    expect(screen.getByText("검색 중 오류가 발생했습니다.")).toBeInTheDocument()
  })
})
