import React from "react";

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { type Plan } from "@prisma/client";

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

  const verify = await verifyInvitation();

  if (verify) {
    if (verify.subAccountId) {
      redirect(`/subaccount/${verify.subAccountId}`);
    } else {
      if (searchParams.plan) {
        redirect(
          `/agency/${verify.agencyId}/billing?plan=${searchParams.plan}`
        );
      }

      if (searchParams.state) {
        const statePath = searchParams.state.split("___")[0];
        const stateAgencyId = searchParams.state.split("___")[1];

        if (!stateAgencyId) return redirect(`/agency/unauthorized`);

        redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
        );
      }

      redirect(`/agency/${verify.agencyId}`);
    }
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
