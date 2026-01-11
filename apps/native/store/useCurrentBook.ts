import { Book } from "@repo/types";
import { create } from "zustand";

interface BookStoreState {
  selectedBook: Book | null;
  selectBook: (book: Book) => void;
  clearSelectedBook: () => void;
}

export const useCurrentBookStore = create<BookStoreState>((set) => ({
  selectedBook: null,
  selectBook: (book) => set({ selectedBook: book }),
  clearSelectedBook: () => set({ selectedBook: null }),
}));
