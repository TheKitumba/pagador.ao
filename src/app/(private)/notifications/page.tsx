import { Notification03Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { notifications } from "@/mocks/inbox";

import { NotificationList } from "./_components/notification-list";

export const metadata: Metadata = { title: "Notificações" };

export default function NotificationsPage() {
  const unread = notifications.filter((item) => !item.read);

  return (
    <>
      <PageHeader title="Notificações" icon={Notification03Icon} description="Alertas, prazos e actividade recente" />
      <PageTabs
        tabs={[
          { value: "all", label: "Todas", count: notifications.length },
          { value: "unread", label: "Não lidas", count: unread.length },
          { value: "deadline", label: "Prazos" },
          { value: "alert", label: "Alertas" },
        ]}
      >
        <PageBody className="max-w-4xl">
          <PageTabPanel value="all">
            <NotificationList items={notifications} />
          </PageTabPanel>
          <PageTabPanel value="unread">
            <NotificationList items={unread} />
          </PageTabPanel>
          <PageTabPanel value="deadline">
            <NotificationList items={notifications.filter((item) => item.kind === "deadline")} />
          </PageTabPanel>
          <PageTabPanel value="alert">
            <NotificationList items={notifications.filter((item) => item.kind === "alert")} />
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
