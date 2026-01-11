import React from "react";
import NotificationSwitch from "./NotificationSwitch";
import { Separator } from "@/components/ui/separator";

export default function Notification() {
  return (
    <div className="w-full rounded-xs bg-white">
      <NotificationSwitch />
    </div>
  );
}
