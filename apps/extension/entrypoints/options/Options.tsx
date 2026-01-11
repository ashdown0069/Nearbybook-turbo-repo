import DistrictSelector from "./DistrictSelector";
import Notification from "@/components/notification/NotificationContainer";

export default function Options() {
  return (
    <section className="p-10">
      <div className="mx-auto flex w-[768px] flex-col gap-10">
        <div className="rounded-md border border-green-300 p-3 shadow-md">
          <div className="p-3 text-left text-2xl text-black">지역 설정</div>
          <DistrictSelector />
        </div>
        <div className="rounded-md border border-green-300 p-3 shadow-md">
          <div className="p-3 text-left text-2xl text-black">알림 설정</div>
          <Notification />
        </div>
      </div>
    </section>
  );
}
