import type { Book } from "@repo/types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useState, useEffect } from "react";

interface BookState {
  savedBooks: Book[];
  addBook: (book: Book) => void;
  removeBook: (isbn: string) => void;
  clearBooks: () => void;
}

const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      savedBooks: [],

      // 추가하기: 이미 있는 책인지 ISBN으로 확인 후 추가
      addBook: (newBook) =>
        set((state) => {
          const isExist = state.savedBooks.some(
            (book) => book.isbn === newBook.isbn,
          );
          if (isExist) {
            toast.info("이미 저장된 책입니다.");
            return state;
          }
          toast.success("저장되었습니다.");
          return { savedBooks: [...state.savedBooks, newBook] };
        }),

      // 개별삭제
      removeBook: (targetIsbn) =>
        set((state) => {
          toast.success("삭제되었습니다.");
          return {
            savedBooks: state.savedBooks.filter(
              (book) => book.isbn !== targetIsbn,
            ),
          };
        }),

      // 전체삭제: 빈 배열로 초기화
      clearBooks: () =>
        set(() => {
          toast.success("모든 책이 삭제되었습니다.");
          return { savedBooks: [] };
        }),
    }),
    {
      name: "my-book-storage", // 로컬 스토리지에 저장될 Key 이름
      storage: createJSONStorage(() => localStorage), // 명시적 스토리지 설정
    },
  ),
);

export function useBook() {
  const store = useBookStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return {
    // 마운트 전에는 빈 배열을 보여줘서 에러 방지
    savedBooks: isMounted ? store.savedBooks : [],
    addBook: store.addBook,
    removeBook: store.removeBook,
    clearBooks: store.clearBooks,
    isMounted, // 필요시 로딩 상태 처리에 사용
  };
}
