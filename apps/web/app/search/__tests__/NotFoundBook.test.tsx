import { render, screen } from "@testing-library/react";
import NotFoundBooks from "../_components/NotFoundBooks";

describe("NotFoundBook 컴포넌트", () => {
  it("NotFoundBook 컴포넌트를 올바르게 렌더링해야 한다", () => {
    render(<NotFoundBooks title="테스트 제목" />);

    expect(screen.getByText("검색 결과 없음")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "더 정확하게 검색하려면?" }),
    ).toBeInTheDocument();
  });

  it("title이 제공되지 않았을 때 '검색 결과 없음' 텍스트를 표시하지 않아야 한다", () => {
    render(<NotFoundBooks title={undefined} />);

    expect(screen.queryByText("검색 결과 없음")).not.toBeInTheDocument();
  });
});
