import { render, screen } from "@testing-library/react";
import NotFoundBooks from "../_components/NotFoundBooks";

describe("NotFoundBook component", () => {
  it("should render the NotFoundBook component correctly", () => {
    render(<NotFoundBooks title="테스트 제목" />);

    expect(screen.getByText("검색 결과 없음")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "더 정확하게 검색하려면?" }),
    ).toBeInTheDocument();
  });

  it("should not display `검색 결과 없음` text when title is not provided", () => {
    render(<NotFoundBooks title={undefined} />);

    expect(screen.queryByText("검색 결과 없음")).not.toBeInTheDocument();
  });
});
