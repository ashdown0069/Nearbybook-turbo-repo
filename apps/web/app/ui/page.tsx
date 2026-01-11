"use client";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { Switch } from "@repo/ui/components/switch";
export default function page() {
  return (
    <div>
      <Switch />
      <Button variant={"secondary"}>버튼 테스트</Button>
      <Card>test</Card>
    </div>
  );
}
