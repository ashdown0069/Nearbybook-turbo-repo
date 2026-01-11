import FeedbackTrigger from "./FeedbackTrigger";
import OpenSearchPage from "./OpenSearchPage";
import SettingsTrigger from "./SettingsTrigger";

export default function PopupFooter({
  siDo,
  siGunGu,
}: {
  siDo: string;
  siGunGu: string;
}) {
  const handleOptionPageOpen = () => {
    browser.runtime.openOptionsPage();
  };

  const handleFeedbackPageOpen = () => {
    const url = browser.runtime.getURL("/feedback.html");
    window.open(url);
  };
  return (
    <header className="flex h-10 items-center justify-between border-neutral-300">
      <div className="ml-3">
        {siDo} {siGunGu}
      </div>
      <div className="flex justify-center gap-3">
        <OpenSearchPage />
        <FeedbackTrigger openFeedbackPage={handleFeedbackPageOpen} />
        <SettingsTrigger openOptionPage={handleOptionPageOpen} />
      </div>
    </header>
  );
}
