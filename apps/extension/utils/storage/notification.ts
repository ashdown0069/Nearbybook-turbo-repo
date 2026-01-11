interface notificationPreferenceStore {
  isNotificationsEnabled: boolean;
}

export const notificationPreferenceStore =
  storage.defineItem<notificationPreferenceStore>(
    "sync:notificationPreferenceStore",
    {
      fallback: {
        isNotificationsEnabled: true,
      },
    },
  );

export const getNotifications = async () => {
  return await notificationPreferenceStore.getValue();
};

export const setNotifications = async (value: boolean) => {
  await notificationPreferenceStore.setValue({
    isNotificationsEnabled: value,
  });
};

export const createNotification = async (
  title: string,
  message: string,
  Id: string,
) => {
  const iconUrl = browser.runtime.getURL("/icon/128.png");
  return await browser.notifications.create(Id, {
    type: "basic",
    iconUrl: iconUrl,
    title: title,
    message: message,
    buttons: [
      {
        title: "소장 도서관 보기",
      },
    ],
  });
};
