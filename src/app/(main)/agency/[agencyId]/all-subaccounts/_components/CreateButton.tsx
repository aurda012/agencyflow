"use client";

import React from "react";
import { type User, type SubAccount, type Agency } from "@prisma/client";
import { PlusCircle } from "lucide-react";

import { useModal } from "@/hooks/use-modal";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/common/CustomModal";
import SubAccountDetails from "@/components/forms/SubAccountDetails";
import { IAgency } from "@/database/models/agency.model";
import { ISubAccount } from "@/database/models/subaccount.model";
import { IUser } from "@/database/models/user.model";

interface CreateButtonProps {
  agencyId: string;
  user: IUser & {
    agency:
      | (IAgency & {
          subAccounts: ISubAccount[];
        })
      | null;
  };
}

const CreateButton: React.FC<CreateButtonProps> = ({ agencyId, user }) => {
  const { setOpen } = useModal();
  const agencyDetails = user?.agency;

  if (!agencyDetails) return null;

  const onClickCreate = () => {
    setOpen(
      <CustomModal
        title="Create A Subaccount"
        subTitle="You can switch between your agency account and the subaccount from the sidebar"
      >
        <SubAccountDetails
          agencyDetails={agencyDetails}
          userId={user._id}
          userName={user.name}
        />
      </CustomModal>
    );
  };

  return (
    <Button className="flex items-center gap-2" onClick={onClickCreate}>
      <PlusCircle aria-hidden className="w-4 h-4" />
      Create Sub Account
    </Button>
  );
};

export default CreateButton;
