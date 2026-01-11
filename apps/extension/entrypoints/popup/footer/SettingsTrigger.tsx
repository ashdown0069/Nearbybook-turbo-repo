import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function SettingsTrigger({
  openOptionPage,
}: {
  openOptionPage: () => void;
}) {
  return (
    <Tooltip tooltipText="옵션 페이지로 이동합니다">
      <Button
        onClick={openOptionPage}
        variant={"link"}
        className="cursor-pointer hover:bg-gray-100"
      >
        <Settings />
      </Button>
    </Tooltip>
  );
}
