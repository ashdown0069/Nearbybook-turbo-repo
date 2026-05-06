import { render, screen } from "@testing-library/react";
import Page from "../page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 하위 컴포넌트들 모킹
jest.mock("@/components/landing/Nav", () => () => <div data-testid="nav">Nav</div>);
jest.mock("@/components/landing/MainPromoteCard", () => () => <div data-testid="main-promote-card">MainPromoteCard</div>);
jest.mock("@/components/landing/PopularBooks", () => () => <div data-testid="popular-books">PopularBooks</div>);
jest.mock("@/components/landing/BrowserExtension", () => () => <div data-testid="browser-extension">BrowserExtension</div>);
jest.mock("@/components/landing/FindLibs", () => () => <div data-testid="find-libs">FindLibs</div>);
jest.mock("@/components/landing/Footer", () => () => <div data-testid="footer">Footer</div>);
jest.mock("@/app/search/_components/Search", () => () => <div data-testid="search">Search</div>);
jest.mock("@/app/search/_components/SearchTrending/SearchTrending", () => () => <div data-testid="search-trending">SearchTrending</div>);

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("루트 페이지 (랜딩 페이지)", () => {
  it("모든 주요 섹션이 정상적으로 렌더링되어야 한다", async () => {
    const queryClient = createTestQueryClient();
    const PageComponent = await Page();
    render(
      <QueryClientProvider client={queryClient}>
        {PageComponent}
      </QueryClientProvider>
    );

    expect(screen.getByTestId("nav")).toBeInTheDocument();
    expect(screen.getByTestId("find-libs")).toBeInTheDocument();
    expect(screen.getByTestId("browser-extension")).toBeInTheDocument();
    expect(screen.getByTestId("popular-books")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("search")).toBeInTheDocument();
  });

  it("레이아웃 구조가 올바르게 렌더링되어야 한다", async () => {
    const queryClient = createTestQueryClient();
    const PageComponent = await Page();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        {PageComponent}
      </QueryClientProvider>
    );
    
    const main = container.querySelector("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass("flex", "min-h-screen", "flex-col");
  });
});
