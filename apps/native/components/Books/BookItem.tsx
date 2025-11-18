import type { Book } from "@repo/types";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import FallbackImage from "./FallbackImage";
interface BookItemProps {
  book: Book;
  handlePressBookItem?: (book: Book) => void;
}
export default function BookItem({ book, handlePressBookItem }: BookItemProps) {
  return (
    <Pressable
      onPress={() => {
        if (handlePressBookItem) handlePressBookItem(book);
      }}
      className="mb-2 flex h-32 flex-row bg-white"
    >
      <View className="w-1/5">
        {book.bookImageURL && (
          <Image
            source={{
              uri: book.bookImageURL,
            }}
            contentFit="cover"
            style={{
              width: "100%",
              height: "100%",
            }}
            accessibilityLabel={book.bookname}
          />
        )}
        {!book.bookImageURL && <FallbackImage />}
      </View>
      <View className="flex-1 flex-col justify-around gap-2 px-3">
        <View>
          <Text
            className="text-xl font-semibold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {book.bookname} {book.vol ? book.vol : ""}
          </Text>
        </View>
        <View className="flex flex-col gap-1">
          <View className="flex flex-row gap-4">
            <Text className="max-w-48" numberOfLines={1} ellipsizeMode="tail">
              {book.authors}
            </Text>
            <Text>{book.publicationYear}</Text>
          </View>
          <View className="flex flex-row gap-4">
            <Text
              className="w-1/2 text-slate-600"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {book.publisher}
            </Text>
            <Text
              className="w-1/2 text-slate-600"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {book.isbn}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
    // </Link>
  );
}
