"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pipeline } from "@prisma/client";

import { deletePipeline } from "@/database/actions/pipeline.actions";

import { AlertDialog } from "@/components/ui/alert-dialog";
import PipelineDetails from "@/components/forms/PipelineDetails";
import { IPipeline } from "@/database/models/pipeline.model";

const PipelineSettings = ({
  pipelineId,
  subaccountId,
  pipelines,
}: {
  pipelineId: string;
  subaccountId: string;
  pipelines: IPipeline[];
}) => {
  const router = useRouter();

  return (
    <AlertDialog>
      <div>
        <PipelineDetails
          subAccountId={subaccountId}
          pipelineId={pipelineId}
          defaultData={pipelines.find((p) => p._id === pipelineId)}
        />
      </div>
    </AlertDialog>
  );
};

export default PipelineSettings;
