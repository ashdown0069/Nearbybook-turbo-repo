import { render, screen } from "@testing-library/react";
import SearchSummary from "../_components/SearchSummary";

describe("SearchSummary component", () => {
  it("should render the SearchSummary component correctly", () => {
    render(<SearchSummary numFound={10} />);

    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("should render warning text when numFound is greater than 50", () => {
    render(<SearchSummary numFound={60} />);

    expect(
      screen.getByText(
        "검색결과가 너무 많다면 정확한 제목을 입력하시거나 ISBN을 사용하여 검색하세요.",
      ),
    ).toBeInTheDocument();
  });
});
