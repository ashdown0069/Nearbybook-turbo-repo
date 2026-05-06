import { render, screen } from "@testing-library/react";
import SearchSummary from "../_components/SearchSummary";

describe("SearchSummary 컴포넌트", () => {
  it("SearchSummary 컴포넌트를 올바르게 렌더링해야 한다", () => {
    render(<SearchSummary numFound={10} />);

    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("numFound가 50보다 클 때 경고 텍스트를 렌더링해야 한다", () => {
    render(<SearchSummary numFound={60} />);

    expect(
      screen.getByText(
        "검색결과가 너무 많다면 정확한 제목을 입력하시거나 ISBN을 사용하여 검색하세요.",
      ),
    ).toBeInTheDocument();
  });
});
