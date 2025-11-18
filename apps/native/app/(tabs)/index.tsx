import Header from "@/components/Header";
import MainTileBtn from "@/components/MainTileBtn";
import { Link } from "expo-router";
import {
  BookMarked,
  Map,
  ScanBarcode,
  Search,
  TextSearch,
} from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useGetPopularLoanBooks } from "@repo/data-access";
import AdMob from "@/components/plan/ad";
import { axiosInstance } from "@/lib/axios";
import PopularBook from "@/components/Books/PopularBook";
import PopularBookSkeleton from "@/components/Books/PopularBookSkeleton";
import { keepPreviousData } from "@tanstack/react-query";
import { useDatabase } from "@/db/provider";
import { useEffect } from "react";
import { BooksTable } from "@/db/schema";
import { cn } from "@/lib/utils";
export default function HomeScreen() {
  const { data, isLoading, isError, error } = useGetPopularLoanBooks(
    axiosInstance,
    {
      placeholderData: keepPreviousData,
    },
  );
  const { bottom } = useSafeAreaInsets();
  const { db } = useDatabase();

  useEffect(() => {
    // (async () => {
    //   await db?.insert(BooksTable).values({
    //     bookname: "db test",
    //     authors: "db test",
    //     bookImageURL: "db test",
    //     isbn: "db test",
    //     publicationYear: "db test",
    //     publisher: "db test",
    //     vol: "db test",
    //   });
    //   const books = await db?.select().from(BooksTable);
    //   console.log(books);
    // })();
  });

  if (isError) {
    return (
      <SafeAreaView>
        <Text>오류가 발생했습니다:</Text>
        <Text>{error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      edges={{
        bottom: "off",
        top: "additive",
        right: "additive",
        left: "additive",
      }}
    >
      <Header />
      <ScrollView className="flex-1 p-0">
        <View className="flex flex-row flex-wrap justify-center gap-6">
          <Link href={"/search"} asChild>
            <MainTileBtn
              BtnText={`제목${"\n"}으로 검색`}
              Icon={<Search size={32} color={"#ffffff"} />}
            />
          </Link>
          <Link href={"/barcode"} asChild>
            <MainTileBtn
              BtnText={`도서 바코드 스캔${"\n"}으로 검색`}
              Icon={<ScanBarcode size={32} color={"#ffffff"} />}
            />
          </Link>
          <Link href={"/(search)/searchISBN"} asChild>
            <MainTileBtn
              BtnText={`ISBN${"\n"}으로 검색`}
              Icon={<TextSearch size={32} color={"#ffffff"} />}
            />
          </Link>
          <Link href={"/(tabs)/mylibs"} asChild>
            <MainTileBtn
              BtnText={`집 근처 도서관 찾기`}
              Icon={<Map size={32} color={"#ffffff"} />}
            />
          </Link>
        </View>
        <View className="mt-6 flex-1">
          <Text className="mb-3 pl-3 text-xl font-semibold">
            인기대출도서 TOP 10
          </Text>
          <View className="flex flex-1 flex-row flex-wrap justify-center gap-5">
            {data &&
              !isLoading &&
              data.map((item) => <PopularBook key={item.isbn} {...item} />)}
            {!data &&
              isLoading &&
              Array.from({ length: 10 }).map((_, idx) => (
                <PopularBookSkeleton key={idx} />
              ))}
          </View>
        </View>
      </ScrollView>
      {/* <AdMob /> */}
    </SafeAreaView>
  );
}
