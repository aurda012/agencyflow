import React from "react";

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { type Plan, Role } from "@prisma/client";

import { getAuthUserDetails } from "@/queries/auth";
import { verifyInvitation } from "@/queries/invitations";

import AgencyDetails from "@/components/forms/AgencyDetails";
import Unauthorized from "@/components/common/Unauthorized";
import { constructMetadata } from "@/lib/utils";

interface AgencyPageProps {
  searchParams: {
    plan: Plan | undefined;
    state: string | undefined;
    code: string | undefined;
  };
}

const AgencyPage = async ({ searchParams }: AgencyPageProps) => {
  const authUser = await currentUser();

  const agencyId = await verifyInvitation();
  const user = await getAuthUserDetails();

  const isSubAccountUser =
    user?.role === Role.SUBACCOUNT_GUEST || user?.role === Role.SUBACCOUNT_USER;
  const isAgencyUser =
    user?.role === Role.AGENCY_OWNER || user?.role === Role.AGENCY_ADMIN;

  if (agencyId) {
    if (isSubAccountUser) {
      redirect("/subaccount");
    } else if (isAgencyUser) {
      if (searchParams.plan) {
        redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`);
      }

      if (searchParams.state) {
        const statePath = searchParams.state.split("___")[0];
        const stateAgencyId = searchParams.state.split("___")[1];

        if (!stateAgencyId) return <div>Not authorized.</div>;

        redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
        );
      }

      redirect(`/agency/${agencyId}`);
    }

    return <Unauthorized />;
  }

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] flex flex-col gap-8">
        <AgencyDetails
          data={{ companyEmail: authUser!.emailAddresses[0].emailAddress }}
        />
      </div>
    </div>
  );
};

export default AgencyPage;

export const metadata = constructMetadata({
  title: "Agency | AgencyFlow",
});
