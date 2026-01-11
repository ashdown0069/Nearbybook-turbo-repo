import { render, screen, fireEvent } from "@testing-library/react";
import LoanStatusButton from "../_components/LoanStatusButton";
import { useLoanStatus } from "../_hooks/useLoanStatus";

// useLoanStatus 훅 모킹
jest.mock("../_hooks/useLoanStatus");

// @repo/ui/components/button 모킹
// asChild가 사용되므로 간단하게 div나 button으로 대체
jest.mock("@repo/ui/components/button", () => ({
  Button: ({ children, onClick, disabled, className }: any) => (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}));

describe("LoanStatusButton Component", () => {
  const mockCheckLoanStatus = jest.fn();
  const defaultProps = {
    isbn: "1234567890",
    libCode: "L001",
    isMobile: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render initial (idle) state correctly", () => {
    (useLoanStatus as jest.Mock).mockReturnValue({
      status: "idle",
      checkLoanStatus: mockCheckLoanStatus,
    });

    render(<LoanStatusButton {...defaultProps} />);

    expect(screen.getByText("대출 여부 조회 하기")).toBeInTheDocument();
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("should call checkLoanStatus when clicked in idle state", () => {
    (useLoanStatus as jest.Mock).mockReturnValue({
      status: "idle",
      checkLoanStatus: mockCheckLoanStatus,
    });

    render(<LoanStatusButton {...defaultProps} />);

    fireEvent.click(screen.getByRole("button"));
    expect(mockCheckLoanStatus).toHaveBeenCalledTimes(1);
  });

  it("should render loading state correctly and be disabled", () => {
    (useLoanStatus as jest.Mock).mockReturnValue({
      status: "loading",
      checkLoanStatus: mockCheckLoanStatus,
    });

    render(<LoanStatusButton {...defaultProps} />);

    expect(screen.getByText("로딩 중...")).toBeInTheDocument();
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should render canLoan state correctly", () => {
    (useLoanStatus as jest.Mock).mockReturnValue({
      status: "canLoan",
      checkLoanStatus: mockCheckLoanStatus,
    });

    render(<LoanStatusButton {...defaultProps} />);

    expect(screen.getByText("대출 가능")).toBeInTheDocument();
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should render cannotLoan state correctly", () => {
    (useLoanStatus as jest.Mock).mockReturnValue({
      status: "cannotLoan",
      checkLoanStatus: mockCheckLoanStatus,
    });

    render(<LoanStatusButton {...defaultProps} />);

    expect(screen.getByText("대출 불가")).toBeInTheDocument();
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should render error state correctly", () => {
    (useLoanStatus as jest.Mock).mockReturnValue({
      status: "error",
      checkLoanStatus: mockCheckLoanStatus,
    });

    render(<LoanStatusButton {...defaultProps} />);

    expect(screen.getByText("오류가 발생했습니다.")).toBeInTheDocument();
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should apply mobile styling when isMobile is true", () => {
    (useLoanStatus as jest.Mock).mockReturnValue({
      status: "idle",
      checkLoanStatus: mockCheckLoanStatus,
    });

    render(<LoanStatusButton {...defaultProps} isMobile={true} />);

    const button = screen.getByRole("button");
    expect(button.className).toContain("rounded-md");
  });
});
