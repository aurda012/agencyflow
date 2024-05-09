import React from "react";
import { verifyInvitation } from "@/database/actions/invitation.actions";
import { redirect } from "next/navigation";
import { getAuthUserDetails } from "@/database/actions/auth.actions";
import Unauthorized from "@/components/common/Unauthorized";
import { constructMetadata } from "@/lib/utils";

interface SubAccountPageProps {
  searchParams: {
    code: string | undefined;
    state: string | undefined;
  };
}

const SubAccountPage: React.FC<SubAccountPageProps> = async ({
  searchParams,
}) => {
  const { code, state } = searchParams;

  const verify = await verifyInvitation();

  if (state) {
    const statePath = state.split("___")[0];
    const stateSubAccountId = state.split("___")[1];

    if (!stateSubAccountId) redirect(`/agency/unauthorized`);

    redirect(`/subaccount/${stateSubAccountId}/${statePath}?code=${code}`);
  }

  if (verify?.subAccountId) {
    redirect(`/subaccount/${verify.subAccountId}`);
  }

  return <Unauthorized />;
};

export default SubAccountPage;

export const metadata = constructMetadata({
  title: "Sub Account | AgencyFlow",
});
