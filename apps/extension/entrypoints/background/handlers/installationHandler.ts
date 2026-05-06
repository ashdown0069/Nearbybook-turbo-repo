import { clearSearchSetting } from "@/utils/storage/searchSetting";
import { clearSessionTabState } from "@/utils/storage/session";

const STORAGE_VERSION = 2;

export const handleInstallation = async (details: { reason: string }) => {
  try {
    const versionStore = storage.defineItem<number>("sync:storageVersion", {
      fallback: 1,
    });
    const currentVersion = await versionStore.getValue();

    if (currentVersion < STORAGE_VERSION) {
      await clearSearchSetting();
      await clearSessionTabState();
      await storage.removeItem("sync:districtPreferenceStore");
      await versionStore.setValue(STORAGE_VERSION);

      const optionUrl = browser.runtime.getURL("/options.html");
      await browser.tabs.create({ url: optionUrl });
    } else if (details.reason === "install") {
      const optionUrl = browser.runtime.getURL("/options.html");
      await browser.tabs.create({ url: optionUrl });
    }
  } catch (e) {
    console.error("[installationHandler] migration failed", e);
  }
};
