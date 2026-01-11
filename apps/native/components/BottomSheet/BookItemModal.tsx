import type { Book } from "@repo/types";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import FallbackImage from "@/features/Book/components/FallbackImage";
interface ModalBookItemProps {
  book: Book;
}
export default function ModalBookItem({ book }: ModalBookItemProps) {
  return (
    <View className="flex max-h-48 flex-row gap-2">
      <View className="w-2/5">
        {book.bookImageURL && (
          <Image
            source={{
              uri: book.bookImageURL,
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
            accessibilityLabel={book.bookname}
          />
        )}
        {!book.bookImageURL && <FallbackImage />}
      </View>
      <View className="w-3/5 flex-col gap-2">
        <Text
          className="text-base font-semibold"
          numberOfLines={4}
          ellipsizeMode="tail"
        >
          {book.bookname} {book.vol ? book.vol : ""}
        </Text>
        <View className="flex flex-col gap-2">
          <View className="flex flex-row gap-4">
            <Text className="max-w-48" numberOfLines={1} ellipsizeMode="tail">
              {book.authors}
            </Text>
            <Text>{book.publicationYear}</Text>
          </View>
          <View className="flex flex-col gap-2">
            <Text
              className="text-slate-600"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {book.publisher}
            </Text>
            <Text
              className="text-slate-600"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {book.isbn}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
