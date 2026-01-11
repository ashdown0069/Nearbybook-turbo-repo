//BottomSheet에서 사용하거나 BottomSheetCarousel의 renderItem 으로사용하거나
import { Library } from "@repo/types";
import { Pressable, Text, View } from "react-native";
import { ExternalLink } from "@/components/external-link";
import {
  Bed,
  BriefcaseBusiness,
  ExternalLinkIcon,
  Heart,
  MapPin,
  Phone,
} from "lucide-react-native";
import { useGetBookLoanStatus } from "@repo/data-access";
import { axiosInstance } from "@/lib/axios";
import { useCurrentBookStore } from "@/store/useCurrentBook";
import TextWithIcon from "@/components/TextWithIcon";
import { cn } from "@/lib/utils";
import { useLibraryDataBase } from "@/db/service/Library";
import Loading from "@/components/Loading";
import { useToast } from "@/features/Toast/useToast";

export default function LibraryInfo({
  libName,
  address,
  tel,
  homepage = "",
  operatingTime,
  closed,
  libCode,
  hasBook,
  latitude,
  longitude,
}: Library) {
  const selectedBook = useCurrentBookStore((state) => state.selectedBook);
  const { data, isLoading, isError } = useGetBookLoanStatus(
    axiosInstance,
    selectedBook?.isbn!,
    libCode,
    hasBook,
  );

  //미완성
  // const { saveLibrary } = useLibraryDataBase();
  // const { showSaveLibraryToast } = useToast();
  // const handleSaveLibrary = async () => {
  //   await saveLibrary(
  //     {
  //       libName,
  //       address,
  //       tel,
  //       homepage,
  //       operatingTime,
  //       closed,
  //       libCode,
  //       latitude,
  //       longitude,
  //     },
  //     () => {
  //       showSaveLibraryToast();
  //     },
  //   );
  // };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 flex-col justify-between p-3">
      <View className="flex flex-col gap-1">
        <View className="mb-1 flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-3">
            <Text className="text-base font-semibold">{libName}</Text>
          </View>
          <View className="flex flex-row gap-3">
            {/* <Pressable onPress={handleSaveLibrary}>
              <Heart />
            </Pressable> */}
            <ExternalLink href={homepage as any}>
              <ExternalLinkIcon />
            </ExternalLink>
          </View>
        </View>
        <TextWithIcon
          iconComponent={<MapPin />}
          text={address}
          textClassName="text-xs"
        />
        <TextWithIcon
          iconComponent={<Phone />}
          text={tel}
          textClassName="text-xs"
        />
        <TextWithIcon
          iconComponent={<BriefcaseBusiness />}
          textClassName="text-xs"
          text={operatingTime}
        />
        <TextWithIcon
          iconComponent={<Bed />}
          text={closed}
          textClassName="text-xs"
        />
      </View>
      {data && data.hasBook === "Y" && (
        <View className="flex flex-col gap-2">
          <View
            className={cn(
              "z-10 w-full items-center justify-center overflow-hidden rounded-md bg-gray-600 p-3",
              data.loanAvailable === "Y" && "bg-green-500",
              data.loanAvailable === "N" && "bg-red-500",
            )}
          >
            <Text className={cn("text-base font-semibold text-white")}>
              {data.loanAvailable === "Y" ? "대출가능" : "대출불가"}
            </Text>
          </View>
          <Text className="mt-0 text-center text-xs text-gray-700">
            도서 상태는 하루 전 데이터를 기반으로 제공됩니다.
          </Text>
        </View>
      )}
    </View>
  );
}
