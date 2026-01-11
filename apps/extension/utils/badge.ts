export const setBadgeText = async (text: string | number) => {
  return await browser.action.setBadgeText({
    text: text.toString(),
  });
};
