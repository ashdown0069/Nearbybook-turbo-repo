import { create } from "zustand";

type LoanStatus = "idle" | "loading" | "error" | "canLoan" | "cannotLoan";

export interface BookLocationInfo {
  shelfLocation: string;
  bookCode: string;
}

interface BookInfoEntry {
  loanStatus: LoanStatus;
  location: BookLocationInfo | null;
  locationLoading: boolean;
}

interface BookInfoState {
  entries: Record<string, BookInfoEntry>;
  setLoanStatus: (isbn: string, libCode: string, status: LoanStatus) => void;
  setLocation: (
    isbn: string,
    libCode: string,
    location: BookLocationInfo | null,
  ) => void;
  setLocationLoading: (
    isbn: string,
    libCode: string,
    loading: boolean,
  ) => void;
}

const defaultEntry: BookInfoEntry = {
  loanStatus: "idle",
  location: null,
  locationLoading: false,
};

function getEntry(
  state: BookInfoState,
  isbn: string,
  libCode: string,
): BookInfoEntry {
  return state.entries[`${isbn}-${libCode}`] ?? defaultEntry;
}

export const useBookInfoStore = create<BookInfoState>((set) => ({
  entries: {},
  setLoanStatus: (isbn, libCode, status) =>
    set((state) => {
      const key = `${isbn}-${libCode}`;
      const prev = getEntry(state, isbn, libCode);
      return {
        entries: { ...state.entries, [key]: { ...prev, loanStatus: status } },
      };
    }),
  setLocation: (isbn, libCode, location) =>
    set((state) => {
      const key = `${isbn}-${libCode}`;
      const prev = getEntry(state, isbn, libCode);
      return {
        entries: { ...state.entries, [key]: { ...prev, location } },
      };
    }),
  setLocationLoading: (isbn, libCode, loading) =>
    set((state) => {
      const key = `${isbn}-${libCode}`;
      const prev = getEntry(state, isbn, libCode);
      return {
        entries: {
          ...state.entries,
          [key]: { ...prev, locationLoading: loading },
        },
      };
    }),
}));
