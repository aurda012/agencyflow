import { $Enums } from "@prisma/client";

export interface SubAccountSidebarOption {
  name: string;
  link: string;
  icon: $Enums.Icon;
}

export const SUBACCOUNT_SIDEBAR_OPTIONS: SubAccountSidebarOption[] = [
  {
    name: "Launch Pad",
    link: "launchpad",
    icon: "clipboardIcon",
  },
  {
    name: "Dashboard",
    link: "",
    icon: "category",
  },
  {
    name: "Pipelines",
    link: "pipelines",
    icon: "flag",
  },
  {
    name: "Funnels",
    link: "funnels",
    icon: "pipelines",
  },
  {
    name: "Media",
    link: "media",
    icon: "database",
  },
  {
    name: "Contacts",
    link: "contacts",
    icon: "person",
  },
  {
    name: "Settings",
    link: "settings",
    icon: "settings",
  },
];

export const subAccountSidebarOptions = (subAccountId: string) => {
  return SUBACCOUNT_SIDEBAR_OPTIONS.map((option) => {
    return {
      name: option.name,
      link: `/subaccount/${subAccountId}/${option.link}`,
      icon: option.icon,
    };
  });
};
