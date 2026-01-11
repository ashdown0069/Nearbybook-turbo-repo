import { parsedSiteData } from "@/types/types";

export const getYES24InfoFromDOM = async (
  tabId: number
): Promise<parsedSiteData> => {
  const result = await browser.scripting.executeScript({
    target: {
      tabId: tabId,
    },
    files: ["/scripts/yes24-parser.js"],
  });
  const { ISBN, TITLE } = result[0].result as parsedSiteData;

  return { ISBN, TITLE };
};
