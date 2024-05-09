"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { Flag, Plus } from "lucide-react";

import { useModal } from "@/hooks/use-modal";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/common/CustomModal";
import LaneDetails from "@/components/forms/LaneDetails";
import PipelineLane from "./PipelineLane";

import type { PipelineDetailsWithLanesCardsTagsTickets } from "@/lib/types";
import { ILaneWithTicketsAndTags } from "@/database/models/lane.model";
import { ITicketPopulated } from "@/database/models/ticket.model";
import { IPipeline } from "@/database/models/pipeline.model";

interface PipelineViewProps {
  lanes: ILaneWithTicketsAndTags[];
  pipelineId: string;
  subAccountId: string;
  pipelineDetails: IPipeline;
  updateLanesOrder: (lanes: ILaneWithTicketsAndTags[]) => Promise<void>;
  updateTicketsOrder: (tickets: ITicketPopulated[]) => Promise<void>;
}

const PipelineView: React.FC<PipelineViewProps> = ({
  lanes,
  pipelineDetails,
  pipelineId,
  subAccountId,
  updateLanesOrder,
  updateTicketsOrder,
}) => {
  const router = useRouter();
  const { setOpen } = useModal();

  const [allLanes, setAllLanes] =
    React.useState<ILaneWithTicketsAndTags[]>(lanes);
  const [allTickets, setAllTickets] = React.useState<ITicketPopulated[]>([]);

  React.useEffect(() => {
    setAllLanes(lanes);
  }, [lanes]);

  const handleAddLane = () => {
    setOpen(
      <CustomModal
        title="Create a Lane"
        subTitle="Lanes allow you to group tickets"
        scrollShadow={false}
      >
        <LaneDetails pipelineId={pipelineId}></LaneDetails>
      </CustomModal>
    );
  };

  const onDragEnd = (dropResult: DropResult) => {
    const { destination, source, type } = dropResult;

    // checks if the destination is invalid or if the element was dropped back to its original position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return null;
    }

    switch (type) {
      case "lane": {
        // update lane position during drag & drop
        const newLanes = [...allLanes]
          .toSpliced(source.index, 1) // remove from origin position
          .toSpliced(destination.index, 0, allLanes[source.index]) // insert to new position
          .map((lane, index) => ({
            ...lane,
            order: index,
          }));

        setAllLanes(newLanes as ILaneWithTicketsAndTags[]);
        updateLanesOrder(newLanes as ILaneWithTicketsAndTags[]);

        router.refresh();
      }
      case "ticket": {
        const lanesCopyArray = [...allLanes];

        const originLane = lanesCopyArray.find(
          (lane) => lane._id === source.droppableId
        );
        const destinationLane = lanesCopyArray.find(
          (lane) => lane._id === destination.droppableId
        );

        if (!originLane || !destinationLane) return null;

        if (source.droppableId === destination.droppableId) {
          // update ticket position during drag & drop
          const newTickets = [...originLane.tickets]
            .toSpliced(source.index, 1) // remove from origin position
            .toSpliced(destination.index, 0, originLane.tickets[source.index]) // insert to new position
            .map((ticket, index) => ({
              ...ticket,
              order: index,
            }));

          originLane.tickets = newTickets; // updates the tickets in the origin lane loccaly
          setAllLanes(lanesCopyArray);
          updateTicketsOrder(newTickets);

          router.refresh();
        } else {
          const [currentTicket] = originLane.tickets.splice(source.index, 1);

          // rearrange original tickets
          originLane.tickets.forEach((ticket, index) => {
            ticket.order = index;
          });

          destinationLane.tickets.splice(destination.index, 0, {
            ...currentTicket,
            lane: destination.droppableId,
          });

          // rearrange destination tickets
          destinationLane.tickets.forEach((ticket, index) => {
            ticket.order = index;
          });

          setAllLanes(lanesCopyArray);
          updateTicketsOrder([
            ...destinationLane.tickets,
            ...originLane.tickets,
          ]);

          router.refresh();
        }
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="bg-white/60 dark:bg-background/60 rounded-md p-4 use-automation-zoom-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{pipelineDetails?.name}</h1>
          <Button
            className="inline-flex items-center gap-2"
            onClick={handleAddLane}
          >
            <Plus className="w-4 h-4" /> Create Lane
          </Button>
        </div>
        <Droppable
          droppableId="lanes"
          type="lane"
          direction="horizontal"
          key="lanes"
          isDropDisabled={false}
        >
          {(provided) => (
            <div
              className="flex items-center gap-x-2 overflow-auto"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="flex items-start gap-3 mt-4">
                {allLanes.map((lane, index) => (
                  <PipelineLane
                    key={lane._id}
                    allTickets={allTickets}
                    setAllTickets={setAllTickets}
                    subAccountId={subAccountId}
                    pipelineId={pipelineId}
                    tickets={lane.tickets}
                    laneDetails={lane}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
        {!allLanes.length && (
          <div className="flex items-center justify-center w-full flex-col gap-2 text-muted-foreground pb-10">
            <Flag className="w-32 h-32 opacity-100" />
            <p className="text-xs font-medium">
              You don&apos;t have any lanes. Go create one!
            </p>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default PipelineView;
