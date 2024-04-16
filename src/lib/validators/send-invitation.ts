import { Role } from "@prisma/client";
import { z } from "zod";

export const SendInvitationValidator = z.object({
  name: z.string().min(5),
  email: z.string().email(),
  role: z.enum([
    Role.AGENCY_ADMIN,
    Role.SUBACCOUNT_USER,
    Role.SUBACCOUNT_GUEST,
  ]),
  subAccountId: z.string().optional(),
});

export type SendInvitationSchema = z.infer<typeof SendInvitationValidator>;
