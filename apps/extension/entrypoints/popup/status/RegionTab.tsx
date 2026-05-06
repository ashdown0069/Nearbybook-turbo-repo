import type { regionResult, searchSettingStoreType } from "@/types/types";
import Found from "./Found";
import NotFound from "./NotFound";

export default function RegionTab({
  data,
  title,
  isbn,
  searchSetting,
}: {
  data: regionResult | null;
  title: string;
  isbn: string;
  searchSetting: searchSettingStoreType;
}) {
  if (!data || data.foundDataLength === 0) {
    return (
      <div className="h-full">
        <NotFound title={title} />
      </div>
    );
  }

  return (
    <div className="h-full">
      <Found
        title={title}
        foundLibsLen={data.foundDataLength}
        region={searchSetting.SiDo.code}
        detailRegion={searchSetting.SiGunGu.code}
        isbn={isbn}
      />
    </div>
  );
}
