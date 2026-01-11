import { create } from "zustand";

type LoanStatus = "idle" | "loading" | "error" | "canLoan" | "cannotLoan";

interface LoanStatusState {
  // key는 'isbn-libCode' 형태, value는 해당 도서의 대출 상태
  statuses: Record<string, LoanStatus>;
  setLoanStatus: (isbn: string, libCode: string, status: LoanStatus) => void;
}

export const useLoanStatusStore = create<LoanStatusState>((set) => ({
  statuses: {},
  setLoanStatus: (isbn, libCode, status) =>
    set((state) => ({
      statuses: {
        ...state.statuses,
        [`${isbn}-${libCode}`]: status,
      },
    })),
}));
