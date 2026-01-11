import { tabState, tabStateSessionStore } from "@/types/types";

export const extTabStateStore = storage.defineItem<tabStateSessionStore>(
  "session:tabStateSessionStore",
  {
    fallback: {
      session: [],
    },
  },
);

interface FindSessionTabStateProps {
  ISBN?: string;
  tabUrl?: string;
}

export const FindSessionTabState = async ({
  ISBN,
  tabUrl,
}: FindSessionTabStateProps) => {
  const data = await extTabStateStore.getValue();
  return data.session.find(
    (item) =>
      (tabUrl && item.tabUrl === tabUrl) || (ISBN && item.ISBN === ISBN),
  );
};
export const getSessionTabState = async () => {
  return await extTabStateStore.getValue();
};

export const setSessionTabState = async (
  ISBN: tabState["ISBN"],
  TITLE: tabState["TITLE"],
  foundDataLength: tabState["foundDataLength"],
  tabUrl: tabState["tabUrl"],
  libraries: tabState["libraries"],
) => {
  try {
    const data = await getSessionTabState();
    if (data.session.find((item) => item.ISBN === ISBN)) {
      return true;
    }
    await extTabStateStore.setValue({
      session: [
        ...data.session,
        {
          ISBN,
          TITLE,
          foundDataLength,
          tabUrl,
          libraries,
        },
      ],
    });
    return true;
  } catch (error) {
    return false;
  }
};
export const clearSessionTabState = async () => {
  await extTabStateStore.setValue({
    session: [],
  });
};
