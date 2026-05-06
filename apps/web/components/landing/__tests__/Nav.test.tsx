import { render, screen } from "@testing-library/react";
import Nav from "../Nav";

// 로고 및 Next.js 링크 모킹
jest.mock("@/components/common/Logo", () => () => <div data-testid="logo">Logo</div>);

describe("Nav 컴포넌트", () => {
  it("로고와 주요 링크들을 렌더링해야 한다", () => {
    render(<Nav />);

    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByText("책 검색하기")).toBeInTheDocument();
    expect(screen.getByText("도서관 찾기")).toBeInTheDocument();
  });

  it("각 링크가 올바른 경로(href)를 가지고 있어야 한다", () => {
    render(<Nav />);

    const searchLink = screen.getByRole("link", { name: /책 검색하기/i });
    const mapLink = screen.getByRole("link", { name: /도서관 찾기/i });

    expect(searchLink).toHaveAttribute("href", "/search");
    expect(mapLink).toHaveAttribute("href", "/map/libs");
  });
});
