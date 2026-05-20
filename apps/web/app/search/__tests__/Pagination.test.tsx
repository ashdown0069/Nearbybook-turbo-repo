import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaginationWithIcon from "../_components/Pagination";
import "@testing-library/jest-dom";

// Mock next/link to prevent navigation errors in jsdom
jest.mock("next/link", () => {
  const MockLink = ({ children, href, ...rest }: any) => {
    return (
      <a
        href={href}
        {...rest}
        onClick={(e) => {
          e.preventDefault();
          // If there's an original onClick handler, call it
          if (rest.onClick) rest.onClick(e);
        }}
      >
        {children}
      </a>
    );
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("PaginationWithIcon 컴포넌트", () => {
  const createPageUrlFn = jest.fn().mockImplementation((page) => `/?page=${page}`);

  beforeEach(() => {
    createPageUrlFn.mockClear();
  });

  it("페이지네이션 컴포넌트를 올바르게 렌더링해야 한다 (totalPages > pageCount, startPage < 1)", () => {
    // 렌더링 검증: 전체 페이지가 10, 현재 페이지가 3일 때 (startPage 조정 분기)
    render(
      <PaginationWithIcon
        totalPages={10}
        currentPage={3}
        createPageUrl={createPageUrlFn}
      />,
    );

    const currentPageLink = screen.getByText("3");
    expect(currentPageLink).toBeInTheDocument();
    
    // 1부터 8페이지까지 렌더링되어야 함
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.queryByText("9")).not.toBeInTheDocument();
  });

  it("전체 페이지가 pageCount(8) 이하일 때 모든 페이지를 렌더링해야 한다 (totalPages <= pageCount)", () => {
    // 분기 검증: 전체 페이지가 5일 때
    render(
      <PaginationWithIcon
        totalPages={5}
        currentPage={3}
        createPageUrl={createPageUrlFn}
      />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.queryByText("6")).not.toBeInTheDocument();
  });

  it("끝 페이지가 totalPages보다 클 때 마지막 페이지를 기준으로 렌더링해야 한다 (endPage > totalPages)", () => {
    // 분기 검증: 전체 10페이지 중 현재 9페이지일 때 (endPage 조정 분기)
    render(
      <PaginationWithIcon
        totalPages={10}
        currentPage={9}
        createPageUrl={createPageUrlFn}
      />,
    );

    // startPage = 10 - 8 + 1 = 3, endPage = 10
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });

  it("현재 페이지가 1일 때 이전/첫 페이지 버튼이 비활성화되어야 한다", () => {
    // 엣지 케이스: 첫 페이지일 때 버튼 상태 검증
    render(
      <PaginationWithIcon
        totalPages={10}
        currentPage={1}
        createPageUrl={createPageUrlFn}
      />,
    );

    const firstPageButton = screen.getByLabelText("Go to first page");
    const prevPageButton = screen.getByLabelText("Go to previous page");

    expect(firstPageButton).toHaveAttribute("aria-disabled", "true");
    expect(prevPageButton).toHaveAttribute("aria-disabled", "true");
    expect(firstPageButton).toHaveClass("pointer-events-none");
    expect(prevPageButton).toHaveClass("pointer-events-none");
  });

  it("현재 페이지가 마지막 페이지일 때 다음/마지막 페이지 버튼이 비활성화되어야 한다", () => {
    // 엣지 케이스: 마지막 페이지일 때 버튼 상태 검증
    render(
      <PaginationWithIcon
        totalPages={10}
        currentPage={10}
        createPageUrl={createPageUrlFn}
      />,
    );

    const lastPageButton = screen.getByLabelText("Go to last page");
    const nextPageButton = screen.getByLabelText("Go to next page");

    expect(lastPageButton).toHaveAttribute("aria-disabled", "true");
    expect(nextPageButton).toHaveAttribute("aria-disabled", "true");
    expect(lastPageButton).toHaveClass("pointer-events-none");
    expect(nextPageButton).toHaveClass("pointer-events-none");
  });

  it("사용자 상호작용: 각 버튼 클릭 시 올바른 URL 생성을 호출해야 한다", async () => {
    const user = userEvent.setup();
    render(
      <PaginationWithIcon
        totalPages={10}
        currentPage={3}
        createPageUrl={createPageUrlFn}
      />,
    );

    // 숫자 버튼 클릭
    await user.click(screen.getByText("5"));
    expect(createPageUrlFn).toHaveBeenCalledWith(5);

    // 첫 페이지 이동
    await user.click(screen.getByLabelText("Go to first page"));
    expect(createPageUrlFn).toHaveBeenCalledWith(1);

    // 마지막 페이지 이동
    await user.click(screen.getByLabelText("Go to last page"));
    expect(createPageUrlFn).toHaveBeenCalledWith(10);

    // 다음 페이지 이동
    await user.click(screen.getByLabelText("Go to next page"));
    expect(createPageUrlFn).toHaveBeenCalledWith(4);

    // 이전 페이지 이동
    await user.click(screen.getByLabelText("Go to previous page"));
    expect(createPageUrlFn).toHaveBeenCalledWith(2);
  });
});
