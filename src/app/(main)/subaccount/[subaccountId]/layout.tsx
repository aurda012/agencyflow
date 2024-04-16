import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";

import { verifyInvitation } from "@/queries/invitations";
import { getAuthUserDetails } from "@/queries/auth";
import { getNotifications } from "@/queries/notifications";

import Sidebar from "@/components/modules/sidebar/Sidebar";
import InfoBar from "@/components/common/InfoBar";

import { NotificationsWithUser } from "@/lib/types";

interface SubAccountIdLayoutProps {
  children: React.ReactNode;
  params: {
    subaccountId: string | undefined;
  };
}

const SubAccountIdLayout: React.FC<SubAccountIdLayoutProps> = async ({
  children,
  params,
}) => {
  const { subaccountId } = params;
  const verify = await verifyInvitation();

  if (!subaccountId) redirect(`/subaccount/unauthorized`);
  if (!verify?.agencyId) redirect(`/subaccount/unauthorized`);

  const user = await currentUser();

  if (!user) redirect(`/agency/sign-in`);

  let notifications: NotificationsWithUser = [];

  if (!user.privateMetadata.role) {
    console.log("Unauthorized:", "Sub Account Layout");
    redirect(`/subaccount/unauthorized`);
  }

  const authUser = await getAuthUserDetails();
  console.log(authUser);
  const hasPermission = authUser?.permissions.find(
    (permission) =>
      permission.access && permission.subAccountId === subaccountId
  );
  if (!hasPermission) {
    console.log("Unauthorized:", "Sub Account Layout");
    redirect(`/subaccount/unauthorized`);
  }

  if (verify) {
    const allNotifications = await getNotifications(verify.agencyId as string);

    if (
      user.privateMetadata.role === Role.AGENCY_ADMIN ||
      user.privateMetadata.role === Role.AGENCY_OWNER
    ) {
      notifications = allNotifications;
    } else {
      const filteredNotifications = allNotifications?.filter(
        (notification) => notification.subAccountId === subaccountId
      );
      if (filteredNotifications) notifications = filteredNotifications;
    }
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={subaccountId} type="subaccount" />

      <div className="md:pl-[300px]">
        <InfoBar
          notifications={notifications}
          role={user.privateMetadata.role as Role}
          subAccountId={params.subaccountId as string}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export default SubAccountIdLayout;
