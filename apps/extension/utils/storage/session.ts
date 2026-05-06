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
}

export const FindSessionTabState = async ({
  ISBN,
}: FindSessionTabStateProps) => {
  const data = await extTabStateStore.getValue();
  return data.session.find((item) => ISBN && item.ISBN === ISBN);
};
export const getSessionTabState = async () => {
  return await extTabStateStore.getValue();
};

export const setSessionTabState = async (state: tabState) => {
  try {
    const data = await getSessionTabState();
    const length = data.session.length;

    if (length > 50) {
      // 세션이 50개 이상이면 가장 오래된 세션 제거
      data.session.shift();
    }

    // 기존에 동일한 ISBN이 있다면 제외하고 새로운 상태를 추가 (업데이트 효과)
    const filteredSession = data.session.filter(
      (item) => item.ISBN !== state.ISBN,
    );

    await extTabStateStore.setValue({
      session: [...filteredSession, state],
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
