import { setBadgeText } from "@/utils/badge";
import { createNotification } from "@/utils/storage/notification";

export const updateExtensionIcon = async (tabId: number, isOn: boolean) => {
  const suffix = isOn ? "_ON" : "";
  await browser.action
    .setIcon({
      tabId,
      path: {
        "16": `/icon/16${suffix}.png`,
        "32": `/icon/32${suffix}.png`,
      },
    })
    .catch((e) => {
      console.error(`[uiService] Failed to set icon (isOn: ${isOn}) for tab`, tabId, e);
    });
};

export const updateBadge = async (count: number | string) => {
  await setBadgeText(count);
};

export const sendLibraryNotification = async (
  title: string,
  isbn: string,
  foundCount: number,
) => {
  const notificationTitle = `책 소장 도서관 찾기`;
  const notificationDescription = `${title}을(를) 소장하고 있는 ${foundCount} 곳의 도서관을 찾았습니다`;
  await createNotification(notificationTitle, notificationDescription, isbn);
};
