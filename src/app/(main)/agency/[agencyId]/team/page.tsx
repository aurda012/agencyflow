import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import { getAgencyDetails } from "@/queries/agency";
import { getAuthUserGroup } from "@/queries/auth";

import TeamsDataTable from "./data-table";
import { teamTableColumns } from "./columns";
import SendInvitation from "@/components/forms/SendInvitation";
import { constructMetadata } from "@/lib/utils";

interface TeamPageProps {
  params: {
    agencyId: string | undefined;
  };
}

const TeamPage: React.FC<TeamPageProps> = async ({ params }) => {
  const { agencyId } = params;
  const authUser = await currentUser();

  if (!authUser) redirect("/agency/sign-in");
  if (!agencyId) redirect("/agency/unauthorized");

  const teamMembers = await getAuthUserGroup(agencyId);
  if (!teamMembers) redirect("/agency/sign-in");

  const agencyDetails = await getAgencyDetails(agencyId);
  if (!agencyDetails) redirect("/agency/unauthorized");

  return (
    <TeamsDataTable
      actionButtonText={
        <>
          <Plus className="w-4 h-4" />
          Add
        </>
      }
      modalChildren={
        <SendInvitation
          agencyId={agencyId}
          subAccounts={agencyDetails.subAccounts}
        />
      }
      filterValue="name"
      columns={teamTableColumns}
      data={teamMembers}
    />
  );
};

export default TeamPage;

export const metadata = constructMetadata({
  title: "Team | AgencyFlow",
});
