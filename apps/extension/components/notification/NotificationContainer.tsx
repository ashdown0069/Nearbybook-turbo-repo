import React from "react";
import NotificationSwitch from "./NotificationSwitch";
import { Separator } from "@repo/ui/components/separator";

export default function Notification() {
  return (
    <div className="w-full rounded-xs bg-white">
      <NotificationSwitch />
    </div>
  );
}
