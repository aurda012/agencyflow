import React from "react";

import { getAuthUserDetails } from "@/database/actions/auth.actions";

import MenuOptions from "./MenuOptions";
import {
  agencySidebarOptions,
  AgencySidebarOption,
} from "@/config/agency-sidebar";
import {
  SubAccountSidebarOption,
  subAccountSidebarOptions,
} from "@/config/subaccount-sidebar";
import { ISubAccount } from "@/database/models/subaccount.model";
import { IPermission } from "@/database/models/permission.model";

interface SidebarProps {
  id: string;
  type: "agency" | "subaccount";
}

const Sidebar: React.FC<SidebarProps> = async ({ id, type }) => {
  const user = await getAuthUserDetails();

  if (!user || !user.agency) return null;

  const details =
    type === "agency"
      ? user.agency
      : user?.agency.subAccounts.find(
          (subAccount: Partial<ISubAccount>) => subAccount._id === id
        );
  const isWhiteLabelAgency = user.agency.whiteLabel;

  if (!details) return null;

  let sideBarLogo: string = user.agency.agencyLogo || "/assets/plura-logo.svg";

  if (!isWhiteLabelAgency && type === "subaccount") {
    const subAccountLogo = user?.agency.subAccounts.find(
      (subAccount: Partial<ISubAccount>) => subAccount._id === id
    )?.subAccountLogo;

    sideBarLogo = subAccountLogo || user.agency.agencyLogo;
  }

  let sidebarOptions: AgencySidebarOption[] | SubAccountSidebarOption[] = [];

  if (type === "agency") {
    sidebarOptions = agencySidebarOptions(id);
  } else {
    sidebarOptions = subAccountSidebarOptions(id);
  }

  const subAccounts = user.agency.subAccounts.filter(
    (subAccount: Partial<ISubAccount>) =>
      user.permissions.find(
        (permission: Partial<IPermission>) =>
          permission.subAccount === subAccount._id && permission.access === true
      )
  );

  return (
    <>
      <MenuOptions
        defaultOpen={true}
        details={details}
        id={id}
        sideBarLogo={sideBarLogo}
        sideBarOptions={sidebarOptions}
        subAccount={subAccounts}
        user={user}
      />
      <MenuOptions
        defaultOpen={false}
        details={details}
        id={id}
        sideBarLogo={sideBarLogo}
        sideBarOptions={sidebarOptions}
        subAccount={subAccounts}
        user={user}
      />
    </>
  );
};

export default Sidebar;
