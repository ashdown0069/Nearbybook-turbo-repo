import { render, screen, fireEvent } from "@testing-library/react";
import Autocomplete from "../Autocomplete";
import { useGetAutoCompleteResult } from "@repo/data-access";

// 의존성 모킹
jest.mock("@repo/data-access", () => ({
  useGetAutoCompleteResult: jest.fn(),
}));

jest.mock("@/lib/axios", () => ({
  axiosInstance: {},
}));

// Lucide 아이콘 모킹
jest.mock("lucide-react", () => ({
  BookOpen: () => <div data-testid="book-open-icon" />,
}));

describe("Autocomplete 컴포넌트", () => {
  const mockOnSelect = jest.fn();
  const mockHits = [
    {
      title: "테스트 도서 1",
      isbn: "1111111111",
      authors: "저자 1",
      publicationYear: "2023",
    },
    {
      title: "테스트 도서 2",
      isbn: "2222222222",
      authors: "저자 2",
      publicationYear: "2024",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("isOpen이 false이면 아무것도 렌더링하지 않아야 한다", () => {
    (useGetAutoCompleteResult as jest.Mock).mockReturnValue({
      data: { hits: mockHits },
    });
    const { container } = render(
      <Autocomplete
        query="테스트"
        mode="title"
        isOpen={false}
        onSelect={mockOnSelect}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("검색 결과가 없으면 아무것도 렌더링하지 않아야 한다", () => {
    (useGetAutoCompleteResult as jest.Mock).mockReturnValue({
      data: { hits: [] },
    });
    const { container } = render(
      <Autocomplete
        query="테스트"
        mode="title"
        isOpen={true}
        onSelect={mockOnSelect}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("검색 결과가 있으면 도서 목록을 렌더링해야 한다", async () => {
    (useGetAutoCompleteResult as jest.Mock).mockReturnValue({
      data: { hits: mockHits },
    });
    render(
      <Autocomplete
        query="테스트"
        mode="title"
        isOpen={true}
        onSelect={mockOnSelect}
      />,
    );

    expect(screen.getByText("테스트 도서 1")).toBeInTheDocument();
    expect(screen.getByText("저자 1 - 1111111111")).toBeInTheDocument();
    expect(screen.getByText("테스트 도서 2")).toBeInTheDocument();
  });

  it("도서를 선택하면 onSelect 콜백이 ISBN과 함께 호출되어야 한다", () => {
    (useGetAutoCompleteResult as jest.Mock).mockReturnValue({
      data: { hits: mockHits },
    });
    render(
      <Autocomplete
        query="테스트"
        mode="title"
        isOpen={true}
        onSelect={mockOnSelect}
      />,
    );

    const firstItem = screen
      .getByText("테스트 도서 1")
      .closest('[role="option"]');
    if (firstItem) {
      fireEvent.click(firstItem);
    }

    expect(mockOnSelect).toHaveBeenCalledWith("1111111111");
  });
});
