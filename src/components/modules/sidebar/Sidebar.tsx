import React from "react";

import { getAuthUserDetails } from "@/queries/auth";

import MenuOptions from "./MenuOptions";
import {
  agencySidebarOptions,
  AgencySidebarOption,
} from "@/config/agency-sidebar";
import {
  SubAccountSidebarOption,
  subAccountSidebarOptions,
} from "@/config/subaccount-sidebar";

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
      : user?.agency.subAccounts.find((subAccount) => subAccount.id === id);
  const isWhiteLabelAgency = user.agency.whiteLabel;

  if (!details) return null;

  let sideBarLogo: string = user.agency.agencyLogo || "/assets/plura-logo.svg";

  if (!isWhiteLabelAgency && type === "subaccount") {
    const subAccountLogo = user?.agency.subAccounts.find(
      (subAccount) => subAccount.id === id
    )?.subAccountLogo;

    sideBarLogo = subAccountLogo || user.agency.agencyLogo;
  }

  let sidebarOptions: AgencySidebarOption[] | SubAccountSidebarOption[] = [];

  if (type === "agency") {
    sidebarOptions = agencySidebarOptions(id);
  } else {
    sidebarOptions = subAccountSidebarOptions(id);
  }

  const subAccounts = user.agency.subAccounts.filter((subAccount) =>
    user.permissions.find(
      (permission) =>
        permission.subAccountId === subAccount.id && permission.access === true
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
