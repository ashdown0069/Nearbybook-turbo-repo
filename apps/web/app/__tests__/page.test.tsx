import { render, screen } from "@testing-library/react";
import Page from "../page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 하위 컴포넌트들 모킹
jest.mock("@/components/landing/Nav", () => {
  const MockNav = () => <div data-testid="nav">Nav</div>;
  MockNav.displayName = "MockNav";
  return MockNav;
});
jest.mock("@/components/landing/MainPromoteCard", () => {
  const MockMainPromoteCard = () => (
    <div data-testid="main-promote-card">MainPromoteCard</div>
  );
  MockMainPromoteCard.displayName = "MockMainPromoteCard";
  return MockMainPromoteCard;
});
jest.mock("@/components/landing/PopularBooks", () => {
  const MockPopularBooks = () => (
    <div data-testid="popular-books">PopularBooks</div>
  );
  MockPopularBooks.displayName = "MockPopularBooks";
  return MockPopularBooks;
});
jest.mock("@/components/landing/BrowserExtension", () => {
  const MockBrowserExtension = () => (
    <div data-testid="browser-extension">BrowserExtension</div>
  );
  MockBrowserExtension.displayName = "MockBrowserExtension";
  return MockBrowserExtension;
});
jest.mock("@/components/landing/FindLibs", () => {
  const MockFindLibs = () => <div data-testid="find-libs">FindLibs</div>;
  MockFindLibs.displayName = "MockFindLibs";
  return MockFindLibs;
});
jest.mock("@/components/landing/Footer", () => {
  const MockFooter = () => <div data-testid="footer">Footer</div>;
  MockFooter.displayName = "MockFooter";
  return MockFooter;
});
jest.mock("@/app/search/_components/Search", () => {
  const MockSearch = () => <div data-testid="search">Search</div>;
  MockSearch.displayName = "MockSearch";
  return MockSearch;
});
jest.mock(
  "@/app/search/_components/SearchTrending/SearchTrending",
  () => {
    const MockSearchTrending = () => (
      <div data-testid="search-trending">SearchTrending</div>
    );
    MockSearchTrending.displayName = "MockSearchTrending";
    return MockSearchTrending;
  }
);

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
