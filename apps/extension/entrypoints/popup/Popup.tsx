import LoadingBouncing from "@/components/LoadingBouncing";
import { Fragment, useEffect, useState } from "react";
import { Found, NotAvailable, NotFound } from "./status";
import { PopupPortMessage, PopupStatus, tabState } from "@/types/types";
import PopupFooter from "./footer/PopupFooter";
import type { districtPreferenceStoreType } from "@/types/types";
import useAsync from "react-use/lib/useAsync";
import { getDistrictPreference } from "@/utils/storage/district";
import PopupWrapper from "./PopupWrapper";

function Popup() {
  const state = useAsync(getDistrictPreference);
  const [popUpState, setPopUpState] = useState<{
    status: PopupStatus;
    tabState: tabState | undefined;
    district: districtPreferenceStoreType | undefined;
  }>({
    status: "pending",
    tabState: undefined,
    district: undefined,
  });
  const isLoading =
    popUpState.status === "idle" ||
    popUpState.status === "pending" ||
    state.loading;

  useEffect(() => {
    const port = browser.runtime.connect({
      name: "popup-port",
    });

    //백그라운드로부터 정보 받아오기
    port.onMessage.addListener((message: PopupPortMessage) => {
      if (message.status == "complete") {
        setPopUpState((prev) => ({
          ...prev,
          status: message.status,
          tabState: message.data,
          district: message.district,
        }));
      } else {
        setPopUpState((prev) => ({
          ...prev,
          status: message.status,
        }));
      }
    });

    return () => {
      port.disconnect();
    };
  }, []);

  if (isLoading) {
    return (
      <PopupWrapper>
        <LoadingBouncing />
      </PopupWrapper>
    );
  }

  const renderContent = () => {
    if (popUpState.status === "error") {
      return (
        <div className="flex h-[400px] w-80 items-center justify-center">
          오류가 발생했습니다. 종료 후 다시 시도해주세요
        </div>
      );
    }

    if (popUpState.status === "notSupport") {
      return <NotAvailable />;
    }

    if (
      popUpState.tabState &&
      popUpState.status === "complete" &&
      popUpState.tabState.foundDataLength === 0
    ) {
      return <NotFound title={popUpState.tabState?.TITLE} />;
    }

    if (
      popUpState.tabState &&
      popUpState.status === "complete" &&
      popUpState.tabState.foundDataLength > 0
    ) {
      return (
        <Found
          title={popUpState.tabState.TITLE}
          foundLibsLen={popUpState.tabState.foundDataLength}
          region={popUpState.district?.SiDo.code || "11"}
          detailRegion={popUpState.district?.SiGunGu.code || "11010"}
          isbn={popUpState.tabState.ISBN}
        />
      );
    }

    return <NotAvailable />;
  };

  return (
    <Fragment>
      <PopupWrapper>{!isLoading && renderContent()}</PopupWrapper>
      <PopupFooter
        siDo={state.value?.SiDo.name || ""}
        siGunGu={state.value?.SiGunGu.name || ""}
      />
    </Fragment>
  );
}

export default Popup;
