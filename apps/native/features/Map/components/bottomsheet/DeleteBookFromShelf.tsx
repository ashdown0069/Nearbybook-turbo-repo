import BottomSheetModalItem from "@/components/BottomSheet/BottomSheetModalItem";
import { useBookDataBase } from "@/db/service/Book";
import { useToast } from "@/features/Toast/useToast";
import { useCurrentBookStore } from "@/store/useCurrentBook";
import { Trash } from "lucide-react-native";

//modal에서 사용
//flex-1 이 자식 modal의 자식클래스에 무조건 존재해야함
export default function DeleteBookFromShelf({
  onPress,
}: {
  onPress: () => void;
}) {
  const selectedBook = useCurrentBookStore((state) => state.selectedBook);
  const { deleteBook } = useBookDataBase();
  const { showDeleteBookToast } = useToast();
  return (
    <BottomSheetModalItem
      onPress={async () => {
        onPress();
        await deleteBook(selectedBook?.isbn!, () => {
          showDeleteBookToast();
        });
      }}
      iconComponent={<Trash />}
      title="삭제하기"
      description="나의 서재에서 도서를 삭제합니다."
    />
  );
}
