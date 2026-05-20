import { render, screen } from "@testing-library/react"
import MapSidebar from "../_components/MapSidebar"
import type { Book } from "@workspace/types"

// 자식 컴포넌트들을 모킹합니다.
// MapSidebar의 단위 테스트에서는 자식 컴포넌트의 내부 구현이 아닌,
// MapSidebar 자체의 렌더링 로직(조건부 렌더링 등)에 집중합니다.
jest.mock("../_components/BookInfo", () => ({
  __esModule: true,
  default: ({ book }: { book: Book }) => (
    <div data-testid="book-info">{book.bookname}</div>
  ),
}))

jest.mock("../_components/Notification", () => ({
  __esModule: true,
  default: () => <div data-testid="notification">Notification</div>,
}))

jest.mock("@/app/search/_components/Search", () => ({
  __esModule: true,
  default: () => <div data-testid="search">Search</div>,
}))

jest.mock("@/components/common/Feedback", () => ({
  __esModule: true,
  default: () => <div data-testid="feedback">Feedback</div>,
}))

jest.mock("@/components/common/ExtensionPromotion", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="extension-promotion">ExtensionPromotion</div>
  ),
}))

describe("MapSidebar 컴포넌트", () => {
  const mockBook: Book = {
    authors: "테스트 저자",
    bookImageURL: "http://example.com/book.jpg",
    bookname: "테스트 책 제목",
    isbn: "1234567890123",
    publicationYear: "2024",
    publisher: "테스트 출판사",
    vol: "1권",
  }

  it("도서 정보가 제공되면 BookInfo와 다른 컴포넌트들을 렌더링해야 한다", () => {
    render(<MapSidebar book={mockBook} />)

    //컴포넌트 렌더링 확인
    expect(screen.getByTestId("book-info")).toBeInTheDocument()
    expect(screen.getByText(mockBook.bookname)).toBeInTheDocument()
    expect(screen.getByTestId("search")).toBeInTheDocument()
    expect(screen.getByTestId("notification")).toBeInTheDocument()
    expect(screen.getByTestId("extension-promotion")).toBeInTheDocument()
    expect(screen.getByTestId("feedback")).toBeInTheDocument()
  })

  it("도서 정보가 null일 경우 에러 메시지를 렌더링해야 한다", () => {
    render(<MapSidebar book={null} />)

    // 1. book prop이 null이므로 오류 메시지가 렌더링되어야 합니다.
    expect(
      screen.getByText("도서 정보를 불러오는 중 오류가 발생했습니다.")
    ).toBeInTheDocument()

    // 2. BookInfo 컴포넌트는 렌더링되지 않아야 합니다.
    expect(screen.queryByTestId("book-info")).not.toBeInTheDocument()
  })
})
