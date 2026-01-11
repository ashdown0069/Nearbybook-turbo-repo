import { BackgroundPopupState, Tab } from "@/types/types";
import { processBookStoreSite } from "./processBookStoreSite";
import { getDistrictPreference } from "@/utils/storage/district";

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async (details) => {
    //처음 설치시 옵션페이지 열기
    if (details.reason == "install") {
      const optionUrl = browser.runtime.getURL("/options.html");

      await browser.tabs.create({
        url: optionUrl,
      });
    }
  });

  //notification 탭당 한번만 보내도록설정
  const notifiedTabs = new Map<number, string>();
  browser.tabs.onRemoved.addListener((tabId) => {
    //탭이 닫힐 때 삭제
    notifiedTabs.delete(tabId);
  });

  //notification 버튼 클릭시 외부링크 탭 생성
  browser.notifications.onButtonClicked.addListener(
    async (notificationId, buttonIndex) => {
      //옵션페이지에서 사용자 테스트용으로 생성시 TEST전달
      if (notificationId === "TEST") {
        return;
      }

      // 첫 번째 버튼(buttonIndex: 0)이 클릭되었을 때만 동작
      if (buttonIndex === 0) {
        const district = await getDistrictPreference();

        browser.tabs.create({
          url: `https://nearbybook.kr/map?isbn=${notificationId}&region=${district.SiDo.code}&dtl_region=${district.SiGunGu.code}`,
        });
      }
    },
  );

  //팝업에 보낼 상태 초기설정
  let popupState = {
    status: "idle",
    data: undefined,
    port: null,
    district: undefined,
  } as BackgroundPopupState;

  const updateStatus = ({
    data,
    newStatus,
  }: {
    newStatus: BackgroundPopupState["status"];
    data?: BackgroundPopupState["data"];
  }) => {
    //팝업이 열려있으면 실시간 전달
    popupState.status = newStatus;
    popupState.data = data;

    if (popupState.port) {
      if (popupState.status == "complete") {
        popupState.port.postMessage({
          status: popupState.status,
          data: popupState.data,
          district: popupState.district,
        });
      } else if (
        popupState.status == "pending" ||
        popupState.status == "error" ||
        popupState.status == "notSupport"
      ) {
        popupState.port.postMessage({ status: popupState.status });
      }
    }
  };

  //팝업, 백드라운드 연결
  browser.runtime.onConnect.addListener(async (port) => {
    const district = await getDistrictPreference();
    popupState.district = district;
    if (port.name == "popup-port") {
      //팝업오픈시 최신정보 전달
      popupState.port = port;
      try {
        const tabs = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tabs[0] && tabs[0].id) {
          updateStatus({
            newStatus: "pending",
          });
          const result = await processBookStoreSite(
            tabs[0] as Tab,
            notifiedTabs,
          );

          updateStatus({
            newStatus: result.status,
            data: result.data,
          });
        } else {
          updateStatus({
            newStatus: "notSupport",
          });
        }
      } catch (e) {
        console.log("port", e);
        updateStatus({
          newStatus: "error",
        });
      }
    }
    port.onDisconnect.addListener(async (port) => {
      if (port.name == "popup-port") {
        popupState.port = null;
      }
    });
  });

  const handleTabActivation = async (activeInfo: { tabId: number }) => {
    updateStatus({
      newStatus: "pending",
    });
    const tabInfo = await browser.tabs.get(activeInfo.tabId);
    if (tabInfo.url?.startsWith("chrome://") || tabInfo.url == undefined) {
      updateStatus({
        newStatus: "pending",
      });
      await setBadgeText("");
      return;
    }
    const result = await processBookStoreSite(tabInfo as Tab, notifiedTabs);
    if (result)
      updateStatus({
        newStatus: result.status,
        data: result.data,
      });
  };
  // 1. 활성 탭이 변경될 때마다 실행되는 리스너 등록
  browser.tabs.onActivated.addListener(handleTabActivation);

  // 2. 탭의 콘텐츠가 업데이트(새로고침, 새 URL로 이동 등)될 때도 실행
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url?.startsWith("chrome://")) return null;
    // 페이지 로딩이 완료되었고, 해당 탭이 활성 상태일 때만 실행
    if (changeInfo.status === "complete" && tab.active) {
      handleTabActivation({ tabId });
    }
  });
});
