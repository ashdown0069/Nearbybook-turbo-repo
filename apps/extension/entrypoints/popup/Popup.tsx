import LoadingBouncing from "@/components/LoadingBouncing"
import { useEffect, useState } from "react"
import { NotAvailable, NeedsSetup, RegionTab, LibraryTab } from "./status"
import {
  PopupPortMessage,
  PopupStatus,
  tabState,
  searchSettingStoreType,
} from "@/types/types"
import PopupFooter from "./footer/PopupFooter"
import PopupWrapper from "./PopupWrapper"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

function Popup() {
  const [popUpState, setPopUpState] = useState<{
    status: PopupStatus
    tabState: tabState | undefined
    searchSetting: searchSettingStoreType | undefined
  }>({
    status: "pending",
    tabState: undefined,
    searchSetting: undefined,
  })
  const [activeTab, setActiveTab] = useState<"region" | "library">("region")
  const isInitialLoad = useRef(true)
  const isLoading =
    popUpState.status === "idle" || popUpState.status === "pending"

  useEffect(() => {
    const port = browser.runtime.connect({
      name: "popup-port",
    })

    port.onMessage.addListener((message: PopupPortMessage) => {
      if (message.status === "complete") {
        setPopUpState({
          status: message.status,
          tabState: message.data,
          searchSetting: message.searchSetting,
        })
        if (isInitialLoad.current) {
          setActiveTab(message.searchSetting?.defaultTab ?? "region")
          isInitialLoad.current = false
        }
      } else {
        setPopUpState((prev) => ({
          ...prev,
          status: message.status,
        }))
      }
    })

    return () => {
      port.disconnect()
    }
  }, [])

  if (isLoading) {
    return (
      <PopupWrapper>
        <div className="flex flex-1 items-center justify-center">
          <LoadingBouncing />
        </div>
      </PopupWrapper>
    )
  }

  const renderContent = () => {
    if (popUpState.status === "needsSetup") {
      return <NeedsSetup />
    }

    if (popUpState.status === "error") {
      return (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
          오류가 발생했습니다. 종료 후 다시 시도해주세요
        </div>
      )
    }

    if (popUpState.status === "notSupport") {
      return <NotAvailable />
    }

    if (
      popUpState.status === "complete" &&
      popUpState.tabState &&
      popUpState.searchSetting
    ) {
      return (
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "region" | "library")}
          className="mt-3 flex flex-1 flex-col overflow-hidden p-2"
        >
          <TabsList className="w-full shrink-0 py-5">
            <TabsTrigger value="region" className="cursor-pointer py-4">
              지역 ({popUpState.tabState.regionResult?.foundDataLength ?? "-"})
            </TabsTrigger>
            <TabsTrigger
              value="library"
              className="cursor-pointer truncate py-4 text-ellipsis"
            >
              {popUpState.searchSetting.library.libName}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="region" className="flex-1 overflow-y-auto">
            <RegionTab
              data={popUpState.tabState.regionResult}
              title={popUpState.tabState.TITLE}
              isbn={popUpState.tabState.ISBN}
              searchSetting={popUpState.searchSetting}
            />
          </TabsContent>
          <TabsContent value="library" className="flex-1 overflow-y-auto">
            <LibraryTab data={popUpState.tabState.libraryResult} />
          </TabsContent>
        </Tabs>
      )
    }

    return <NotAvailable />
  }

  return (
    <PopupWrapper
      footer={
        <PopupFooter
          siDo={popUpState.searchSetting?.SiDo.name || ""}
          siGunGu={popUpState.searchSetting?.SiGunGu.name || ""}
        />
      }
    >
      {renderContent()}
    </PopupWrapper>
  )
}

export default Popup
