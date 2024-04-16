export interface AgencySidebarOption {
  name: string;
  link: string;
  icon: string;
}

export const AGENCY_SIDEBAR_OPTIONS: AgencySidebarOption[] = [
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
    name: "Sub Accounts",
    link: "all-subaccounts",
    icon: "person",
  },
  {
    name: "Team",
    link: "team",
    icon: "shield",
  },
  {
    name: "Billing",
    link: "billing",
    icon: "payment",
  },
  {
    name: "Settings",
    link: "settings",
    icon: "settings",
  },
];

export const agencySidebarOptions = (agencyId: string) => {
  return AGENCY_SIDEBAR_OPTIONS.map((option) => {
    return {
      name: option.name,
      link: `/agency/${agencyId}/${option.link}`,
      icon: option.icon,
    };
  });
};
