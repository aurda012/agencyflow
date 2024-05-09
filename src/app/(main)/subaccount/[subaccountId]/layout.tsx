import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";

import { verifyInvitation } from "@/database/actions/invitation.actions";
import { getAuthUserDetails } from "@/database/actions/auth.actions";
import { getNotifications } from "@/database/actions/notification.actions";

import Sidebar from "@/components/modules/sidebar/Sidebar";
import InfoBar from "@/components/common/InfoBar";

import { NotificationsWithUser } from "@/lib/types";
import { IPermission } from "@/database/models/permission.model";
import { INotification } from "@/database/models/notification.model";
import { sub } from "date-fns";

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
  console.log(subaccountId);
  const hasPermission = authUser?.permissions.find(
    (permission: Partial<IPermission>) =>
      permission.access && permission.subAccountId === subaccountId
  );
  if (!hasPermission) {
    console.log("Unauthorized:", "Sub Account Layout");
    redirect(`/subaccount/unauthorized`);
  }

  if (verify) {
    const allNotifications = await getNotifications(verify.agencyId as string);

    if (
      user.privateMetadata.role === "AGENCY_ADMIN" ||
      user.privateMetadata.role === "AGENCY_OWNER"
    ) {
      notifications = allNotifications;
    } else {
      const filteredNotifications = allNotifications?.filter(
        (notification: INotification) =>
          notification.subAccount === subaccountId
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
