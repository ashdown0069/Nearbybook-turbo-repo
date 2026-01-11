import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function OpenSearchPage() {
  const ExternalSiteURL = `${import.meta.env.WXT_EXTERNAL_URL}`;
  return (
    <Tooltip tooltipText="책 검색 사이트로 이동합니다.">
      <Button
        asChild
        variant={"link"}
        className="cursor-pointer text-xs hover:bg-gray-100"
      >
        <a href={ExternalSiteURL} target="_blank" rel="noopener noreferrer">
          <Search />
        </a>
      </Button>
    </Tooltip>
  );
}
