import { Stripe } from "stripe";
import { getAuthUserDetails } from "@/database/actions/auth.actions";
import { getSubAccountWithContacts } from "@/database/actions/contact.actions";
import { getMedia } from "@/database/actions/media.actions";
import { getUserWithPermissionsAndSubAccount } from "@/database/actions/permission.actions";
import {
  getPipelineDetails,
  getPipelines,
} from "@/database/actions/pipeline.actions";
import {
  getTicketDetails,
  getTicketsWithTags,
} from "@/database/actions/ticket.actions";
import { getFunnels } from "@/database/actions/funnel.actions";

import type {
  Contact,
  Lane,
  Notification,
  Prisma,
  Tag,
  Ticket,
  User,
} from "@prisma/client";
import { IUser } from "@/database/models/user.model";
import { INotification } from "@/database/models/notification.model";
import { ITag } from "@/database/models/tag.model";
import { IContact } from "@/database/models/contact.model";

export type NotificationsWithUser =
  | ({ user: IUser } & INotification)[]
  | undefined;

export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<
  typeof getUserWithPermissionsAndSubAccount
>;

export type AuthUserWithAgencyAndSubAccounts = Prisma.PromiseReturnType<
  typeof getAuthUserDetails
>;

export type UsersWithAgencySubAccountPermissions = Prisma.PromiseReturnType<
  typeof getAuthUserDetails
>;

export type MediaFiles = Prisma.PromiseReturnType<typeof getMedia>;

export type CreateMediaType = Prisma.MediaCreateWithoutSubAccountInput;

export type TicketAndTags = Ticket & {
  tags: ITag[];
  assigned: IUser | null;
  customer: IContact | null;
};

export type LaneDetails = Lane & {
  tickets: TicketAndTags[];
};

export type TicketDetails = Prisma.PromiseReturnType<typeof getTicketDetails>;

export type PipelineDetailsWithLanesCardsTagsTickets = Prisma.PromiseReturnType<
  typeof getPipelineDetails
>;

export type TicketsWithTags = Prisma.PromiseReturnType<
  typeof getTicketsWithTags
>;

export type SubAccountWithContacts = Prisma.PromiseReturnType<
  typeof getSubAccountWithContacts
>;

export type ShippingAddress = {
  city: string;
  country: string;
  line1: string;
  postal_code: string;
  state: string;
};

export type ShippingInfo = {
  address: ShippingAddress;
  name: string;
};

export type StripeCustomer = {
  email: string;
  name: string;
  shipping: ShippingInfo;
  address: ShippingAddress;
};

export type PriceList = Stripe.ApiList<Stripe.Price>;

export type FunnelsForSubAccount = Prisma.PromiseReturnType<
  typeof getFunnels
>[0];

export type PipelinesWithLanesAndTickets = Prisma.PromiseReturnType<
  typeof getPipelines
>;
