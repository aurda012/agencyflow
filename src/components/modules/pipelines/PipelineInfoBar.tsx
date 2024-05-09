"use client";

import React from "react";
import Link from "next/link";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import type { Pipeline } from "@prisma/client";

import { useModal } from "@/hooks/use-modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import CustomModal from "@/components/common/CustomModal";
import CreatePipelineForm from "@/components/forms/PipelineDetails";
import { IPipeline } from "@/database/models/pipeline.model";

interface PipelineInfoBarProps {
  pipelineId: string;
  subAccountId: string;
  pipelines: IPipeline[];
}

const PipelineInfoBar: React.FC<PipelineInfoBarProps> = ({
  pipelineId,
  pipelines,
  subAccountId,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>(pipelineId);
  const { setOpen: setModalOpen, setClose: setModalClose } = useModal();

  const handleClickCreatePipeline = () => {
    setModalOpen(
      <CustomModal
        title="Create a Pipeline"
        subTitle="Pipelines allows you to group tickets into lanes and track your busines processes all in one place."
        scrollShadow={false}
      >
        <CreatePipelineForm
          pipelineId={pipelineId}
          subAccountId={subAccountId}
        />
      </CustomModal>
    );
  };

  return (
    <>
      <div className="flex items-end gap-2 w-full">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isOpen}
              className="sm:w-48 w-full justify-between flex items-center gap-2"
            >
              {value
                ? pipelines.find((pipeline) => pipeline._id === value)?.name
                : "Select a pipeline"}
              <ChevronsUpDown className="w-4 h-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="sm:w-48 w-[100vw - 16px] p-0">
            <Command className="w-full">
              {/* <CommandEmpty>No pipelines found.</CommandEmpty> */}
              <CommandGroup className="w-full">
                {pipelines.map((pipeline) => {
                  return (
                    <Link
                      key={pipeline._id}
                      href={`/subaccount/${subAccountId}/pipelines/${pipeline._id}`}
                      className={cn(
                        buttonVariants({
                          variant: value === pipeline._id ? "default" : "ghost",
                          size: "sm",
                        }),
                        {
                          "bg-primary text-white font-bold":
                            value === pipeline._id,
                        },
                        "w-full gap-2 justify-start"
                      )}
                    >
                      <span>{pipeline.name}</span>
                    </Link>
                  );
                })}
                <Button
                  variant="secondary"
                  className="flex gap-2 w-full mt-4"
                  onClick={handleClickCreatePipeline}
                >
                  <Plus className="w-4 h-4" />
                  Create Pipeline
                </Button>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default PipelineInfoBar;
