import { getSearchSetting } from "@/utils/storage/searchSetting";
import { handleInstallation } from "./handlers/installationHandler";
import { handlePopupConnect } from "./handlers/popupHandler";
import { handleTabActivation } from "./handlers/tabHandler";

export default defineBackground(() => {
  // 알림 중복 방지 상태 (탭당 ISBN 저장)
  const notifiedTabs = new Map<number, string>();

  //abort controller
  let controller = new AbortController();

  // 1. 설치 및 마이그레이션 핸들러
  browser.runtime.onInstalled.addListener(handleInstallation);

  // 2. 탭 관리 핸들러
  browser.tabs.onRemoved.addListener((tabId) => {
    notifiedTabs.delete(tabId);
  });

  browser.tabs.onActivated.addListener(async (activeInfo) => {
    controller.abort(); // 이전 요청 취소
    controller = new AbortController(); // 새로운 컨트롤러 생성
    await handleTabActivation(
      activeInfo.tabId,
      notifiedTabs,
      controller.signal,
    );
  });

  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (tab.url?.startsWith("chrome://")) return;
    if (changeInfo.status === "complete" && tab.active) {
      controller.abort(); // 이전 요청 취소
      controller = new AbortController(); // 새로운 컨트롤러 생성
      await handleTabActivation(tabId, notifiedTabs, controller.signal);
    }
  });

  // 3. 팝업 연결 핸들러
  browser.runtime.onConnect.addListener(async (port) => {
    controller.abort(); // 이전 요청 취소
    controller = new AbortController(); // 새로운 컨트롤러 생성
    console.log("onConnect 이벤트 발생, 포트 이름:", port.name);
    await handlePopupConnect(port, notifiedTabs, controller.signal);
  });

  // 4. 알림 버튼 클릭 핸들러
  browser.notifications.onButtonClicked.addListener(
    async (notificationId, buttonIndex) => {
      if (notificationId === "TEST") return;

      if (buttonIndex === 0) {
        const searchSetting = await getSearchSetting();
        if (!searchSetting) {
          await browser.runtime.openOptionsPage();
          return;
        }

        const url = `https://nearbybook.kr/map?isbn=${notificationId}&region=${searchSetting.SiDo.code}&dtl_region=${searchSetting.SiGunGu.code}`;
        browser.tabs.create({ url });
      }
    },
  );
});
