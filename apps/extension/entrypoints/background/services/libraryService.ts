import {
  getLibsByISBNExtension,
  getBookLoanStatus,
  searchBookLocation,
  getLibInfo,
} from "@workspace/data-access"
import { axiosInstance } from "@/lib/axios"
import { getSearchSetting } from "@/utils/storage/searchSetting"
import { setSessionTabState } from "@/utils/storage/session"
import { tabState, libraryResult } from "@/types/types"

export const getLibraryData = async (
  ISBN: string,
  TITLE: string,
  tabUrl: string,
  signal?: AbortSignal
): Promise<tabState> => {
  const searchSetting = await getSearchSetting()
  if (!searchSetting) {
    throw new Error("needsSetup")
  }

  // 병렬 데이터 조회
  const [regionRes, loanRes, locationRes, libInfoRes] =
    await Promise.allSettled([
      getLibsByISBNExtension(
        axiosInstance,
        ISBN,
        searchSetting.SiDo.code,
        searchSetting.SiGunGu.code,
        signal
      ),
      getBookLoanStatus(
        axiosInstance,
        ISBN,
        searchSetting.library.libCode,
        signal
      ),
      searchBookLocation(
        axiosInstance,
        searchSetting.library.libCode,
        ISBN,
        signal
      ),
      getLibInfo(axiosInstance, searchSetting.library.libCode, signal),
    ])

  const regionData = regionRes.status === "fulfilled" ? regionRes.value : []
  const loanData = loanRes.status === "fulfilled" ? loanRes.value : null
  const locationData =
    locationRes.status === "fulfilled" ? locationRes.value : null
  const libInfoData =
    libInfoRes.status === "fulfilled" ? libInfoRes.value : null

  const libResult: libraryResult = {
    libCode: searchSetting.library.libCode,
    libName: searchSetting.library.libName,
    address: libInfoData?.address || null,
    homepage: libInfoData?.homepage || null,
    hasBook: locationData?.hasBook && loanData?.hasBook === "Y" ? true : false,
    bookCode: locationData ? locationData.bookCode || null : null,
    shelfLocation: locationData ? locationData.shelfLocation || null : null,
    loanAvailable: loanData ? loanData.loanAvailable === "Y" : null,
  }

  const resultState: tabState = {
    ISBN,
    TITLE,
    tabUrl,
    regionResult: {
      libraries: regionData,
      foundDataLength: regionData.length,
    },
    libraryResult: libResult,
  }

  await setSessionTabState(resultState)
  return resultState
}
