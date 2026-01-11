import { render, screen } from "@testing-library/react";
import LibInfo from "../_components/LibInfo";
import type { Library } from "@repo/types";

describe("LibInfo Component", () => {
  const mockLibData: Omit<
    Library,
    "hasBook" | "hasBook" | "latitude" | "longitude"
  > = {
    libName: "테스트 도서관",
    homepage: "http://example.com",
    address: "테스트 주소",
    closed: "매주 월요일",
    operatingTime: "09:00 - 18:00",
    tel: "02-1234-5678",
    libCode: "12345",
    // latitude: "37.5665",
    // longitude: "126.9780",
  };

  it("should render all library information correctly", () => {
    render(<LibInfo {...mockLibData} />);

    // 1. 도서관 이름과 주소 렌더링 확인
    expect(screen.getByText(mockLibData.libName)).toBeInTheDocument();
    expect(screen.getByText(mockLibData.address)).toBeInTheDocument();

    // 2. href와 target 속성 확인
    const homepageLink = screen.getByRole("link");
    expect(homepageLink).toBeInTheDocument();
    expect(homepageLink).toHaveAttribute("href", mockLibData.homepage);
    expect(homepageLink).toHaveAttribute("target", "_blank");
  });
});
