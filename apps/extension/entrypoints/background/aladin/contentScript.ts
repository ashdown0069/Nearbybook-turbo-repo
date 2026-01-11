import { parsedSiteData } from "@/types/types";

export const getAladinInfoFromDOM = async (
  tabId: number,
): Promise<parsedSiteData> => {
  const result = await browser.scripting.executeScript({
    target: {
      tabId: tabId,
    },
    files: ["/scripts/aladin-parser.js"],
  });

  const { ISBN, TITLE } = result[0].result as parsedSiteData;
  return { ISBN, TITLE };
};
