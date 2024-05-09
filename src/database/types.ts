export interface Role {
  AGENCY_OWNER: "AGENCY_OWNER";
  AGENCY_ADMIN: "AGENCY_ADMIN";
  SUBACCOUNT_USER: "SUBACCOUNT_USER";
  SUBACCOUNT_GUEST: "SUBACCOUNT_GUEST";
}

export interface TriggerTypes {
  CONTACT_FORM: "CONTACT_FORM";
}

export interface ActionType {
  CREATE_CONTACT: "CREATE_CONTACT";
}

export interface InvitationStatus {
  ACCEPTED: "ACCEPTED";
  REVOKED: "REVOKED";
  PENDING: "PENDING";
}

export interface Plan {
  // Product 1: Base Plan
  price_1P5scFP09QncQd2I1CwdnYmt: "price_1P5scFP09QncQd2I1CwdnYmt";
  // Product 2: Unlimited Plan
  price_1P5scFP09QncQd2IrkDhBKTV: "price_1P5scFP09QncQd2IrkDhBKTV";
}
