import {
  Tooltip as TooltipContainer,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Tooltip({
  children,
  tooltipText,
  contentClassName,
  triggerClassName,
}: {
  children: React.ReactNode;
  tooltipText: string;
  triggerClassName?: string;
  contentClassName?: string;
}) {
  return (
    <TooltipContainer>
      <TooltipTrigger className={triggerClassName} asChild>
        <div className="truncate">{children}</div>
      </TooltipTrigger>
      <TooltipContent className={contentClassName}>
        {tooltipText}
      </TooltipContent>
    </TooltipContainer>
  );
}
