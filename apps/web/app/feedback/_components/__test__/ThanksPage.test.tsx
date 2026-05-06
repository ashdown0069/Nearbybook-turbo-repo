import { render, screen } from "@testing-library/react";
import ThanksPage from "../../thanks/page";

describe("피드백 감사 페이지", () => {
  it("ThanksPage 컴포넌트를 올바르게 렌더링해야 한다", () => {
    render(<ThanksPage />);
    const heading = screen.getByRole("heading", {
      name: /제출이 완료되었습니다!/i,
    });
    expect(heading).toBeInTheDocument();

    const paragraph = screen.getByText(/소중한 의견을 보내주셔서 감사합니다./i);
    expect(paragraph).toBeInTheDocument();

    const homeLink = screen.getByRole("link", {
      name: /홈으로 돌아가기/i,
    });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
