import { Switch } from "@/components/ui/switch";
import useAsync from "react-use/lib/useAsync";
import { Button } from "../ui/button";
import {
  getNotifications,
  setNotifications,
  createNotification,
} from "@/utils/storage/notification";

export default function NotificationSwitch() {
  const handleToggle = async (checked: boolean) => {
    return await setNotifications(checked);
  };
  const state = useAsync(getNotifications, [handleToggle]);

  //3번째 인수 TEST로 넣어야 버튼눌러도 리스너에서 반응안함
  const testNotification = () => {
    return createNotification("알림 테스트", "잠시 후에 사라집니다.", "TEST");
  };

  return (
    <div className="flex h-16 items-center justify-between p-5">
      <div className="flex items-center gap-5">
        <div className="text-lg"> 책이 근처에 있으면 알림을 표시합니다.</div>
        <div>
          <Button
            onClick={testNotification}
            variant={"default"}
            className="cursor-pointer bg-green-500 text-white hover:bg-green-400"
          >
            테스트
          </Button>
        </div>
      </div>
      <Switch
        checked={state.value?.isNotificationsEnabled}
        onCheckedChange={handleToggle}
        className="h-7 w-12 data-[state=checked]:bg-green-500"
        thumbClassName="h-6 w-6 data-[state=checked]:translate-x-5"
      />
    </div>
  );
}
