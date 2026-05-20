import { TooltipProvider } from "@workspace/ui/components/tooltip"
import FeedbackTrigger from "./FeedbackTrigger"
import OpenSearchPage from "./OpenSearchPage"
import SettingsTrigger from "./SettingsTrigger"

export default function PopupFooter({
  siDo,
  siGunGu,
}: {
  siDo: string
  siGunGu: string
}) {
  const handleOptionPageOpen = () => {
    browser.runtime.openOptionsPage()
  }

  const handleFeedbackPageOpen = () => {
    const url = browser.runtime.getURL("/feedback.html")
    window.open(url)
  }
  return (
    <footer className="flex h-10 items-center justify-between border-t border-slate-100 bg-slate-50 px-2">
      <div className="ml-1 text-[13px] text-slate-700">
        {siDo} {siGunGu}
      </div>
      <div className="flex justify-center gap-1">
        <TooltipProvider>
          <OpenSearchPage />
          <FeedbackTrigger openFeedbackPage={handleFeedbackPageOpen} />
          <SettingsTrigger openOptionPage={handleOptionPageOpen} />
        </TooltipProvider>
      </div>
    </footer>
  )
}
