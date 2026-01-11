import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";
import React from "react";

export default function FeedbackTrigger({
  openFeedbackPage,
}: {
  openFeedbackPage: () => void;
}) {
  return (
    <Tooltip tooltipText="피드백 페이지로 이동합니다.">
      <Button
        onClick={openFeedbackPage}
        variant={"link"}
        className="cursor-pointer text-xs hover:bg-gray-100"
      >
        <MessageSquareText />
      </Button>
    </Tooltip>
  );
}
