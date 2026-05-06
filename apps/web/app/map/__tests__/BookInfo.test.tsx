import { render, screen } from "@testing-library/react";
import BookInfo from "../_components/BookInfo";
import { Book } from "@repo/types";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe("BookInfo 컴포넌트", () => {
  // 테스트에 사용할 기본 책 정보 객체
  const mockBook: Book = {
    authors: "테스트 저자",
    bookImageURL: "https://placehold.co/100x100",
    bookname: "테스트 책 제목",
    isbn: "1234567890123",
    publicationYear: "2024",
    publisher: "테스트 출판사",
    vol: "1권",
  };

  it("모든 prop이 제공되었을 때 모든 도서 정보를 올바르게 렌더링해야 한다", () => {
    render(<BookInfo book={mockBook} />);

    // 1. 책 제목과 권(vol) 정보가 올바르게 표시되는지 확인
    expect(
      screen.getByRole("heading", { name: /테스트 책 제목 \[1권\]/i }),
    ).toBeInTheDocument();

    // 2. 책 이미지가 alt 텍스트와 함께 올바르게 렌더링되는지 확인
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockBook.bookImageURL);
    expect(image).toHaveAttribute("alt", mockBook.bookname);

    // 3. 나머지 정보(저자, 출판사, 출판년도, ISBN)가 올바르게 표시되는지 확인
    expect(screen.getByText(mockBook.authors)).toBeInTheDocument();
    expect(screen.getByText(mockBook.publisher)).toBeInTheDocument();
    expect(screen.getByText(mockBook.publicationYear)).toBeInTheDocument();
    expect(screen.getByText(`ISBN: ${mockBook.isbn}`)).toBeInTheDocument();
  });

  it("bookImageURL이 제공되지 않았을 때 플레이스홀더를 표시해야 한다", () => {
    // bookImageURL이 없는 mock 데이터 생성
    const bookWithoutImage = { ...mockBook, bookImageURL: "" };
    render(<BookInfo book={bookWithoutImage} />);

    // 1. 'No Image' 텍스트가 표시되는지 확인
    expect(screen.getByText("No Image")).toBeInTheDocument();

    // 2. img 역할(role)을 가진 요소가 없는지 확인
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("'vol' 정보가 제공되지 않았을 때 권 정보를 표시하지 않아야 한다", () => {
    // vol이 없는 mock 데이터 생성
    const bookWithoutVol = { ...mockBook, vol: "" };
    render(<BookInfo book={bookWithoutVol} />);

    // 1. 책 제목만 표시되고, 권(vol) 정보는 없는지 확인
    const heading = screen.getByRole("heading", { name: /테스트 책 제목/i });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe("테스트 책 제목 "); // `[1권]`이 포함되지 않음을 확인

    // 2. 텍스트 내용에 '[1권]'이 포함되지 않는지 더 명확하게 확인
    expect(screen.queryByText(/\[1권\]/)).not.toBeInTheDocument();
  });
});
