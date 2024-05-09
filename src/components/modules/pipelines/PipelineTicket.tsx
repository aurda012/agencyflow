import React from "react";
import { useRouter } from "next/navigation";
import { Draggable } from "react-beautiful-dnd";
import {
  Contact2,
  Edit,
  Link2,
  MoreHorizontal,
  Trash,
  User2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { deleteTicket } from "@/database/actions/ticket.actions";
import { saveActivityLogsNotification } from "@/database/actions/notification.actions";

import { useModal } from "@/hooks/use-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tag } from "@/components/ui/tag";
import CustomModal from "@/components/common/CustomModal";
import TicketDetails from "@/components/forms/TicketDetails";

import type { TicketsWithTags } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ITicket } from "@/database/models/ticket.model";
import { ITag } from "@/database/models/tag.model";
import { IContact } from "@/database/models/contact.model";
import { IUser } from "@/database/models/user.model";

interface PipelineTicketProps {
  setAllTickets: React.Dispatch<React.SetStateAction<TicketsWithTags>>;
  allTickets: TicketsWithTags;
  ticket: ITicket;
  subAccountId: string;
  index: number;
}

const PipelineTicket: React.FC<PipelineTicketProps> = ({
  allTickets,
  index,
  setAllTickets,
  subAccountId,
  ticket,
}) => {
  const router = useRouter();
  const { setOpen } = useModal();

  const customer = ticket.customer as IContact;
  const assigned = ticket.assigned as IUser;

  const editNewTicket = (ticket: ITicket) => {
    setAllTickets(() => {
      return allTickets.map((t: ITicket) => {
        if (t._id === ticket._id) {
          return ticket;
        }

        return t;
      });
    });
  };

  const handleClickEdit = async () => {
    setOpen(
      <CustomModal title="Update Ticket Details">
        <TicketDetails
          getNewTicket={editNewTicket}
          laneId={
            typeof ticket.lane === "string" ? ticket.lane : ticket.lane._id
          }
          subAccountId={subAccountId}
        />
      </CustomModal>,
      async () => {
        // async just for typescript
        return { ticket: ticket };
      }
    );
  };

  const handleDeleteTicket = async () => {
    try {
      setAllTickets((tickets: ITicket[]) =>
        tickets.filter((t) => t._id !== ticket._id)
      );

      const response = await deleteTicket(ticket._id);
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a ticket | ${response?.name}`,
        subAccountId,
      });

      toast.success("Deleted", {
        description: "Deleted ticket from lane.",
      });

      router.refresh();
    } catch (error) {
      toast.error("Oppse!", {
        description: "Could not delete the ticket.",
      });
    }
  };

  return (
    <Draggable draggableId={ticket._id.toString()} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          const offset = { x: 300, y: 20 };
          //@ts-ignore
          const x = provided.draggableProps.style?.left - offset.x;
          //@ts-ignore
          const y = provided.draggableProps.style?.top - offset.y;
          //@ts-ignore
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            top: y,
            left: x,
          };
        }

        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <AlertDialog>
              <DropdownMenu>
                <Card className="my-4 dark:bg-background bg-white shadow-none transition-all">
                  <CardHeader className="p-3">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg w-full">{ticket.name}</span>
                      <DropdownMenuTrigger>
                        <MoreHorizontal className="text-muted-foreground" />
                      </DropdownMenuTrigger>
                    </CardTitle>
                    <span className="text-muted-foreground text-xs">
                      {format(new Date(ticket.createdAt), "dd/MM/yyyy hh:mm")}
                    </span>
                    <div className="flex items-center flex-wrap gap-2">
                      {ticket.tags.map((tag) => {
                        const tagData = tag as ITag;
                        return (
                          <Tag
                            key={tagData._id}
                            title={tagData.name}
                            colorName={tagData.color}
                          />
                        );
                      })}
                    </div>
                    <CardDescription className="w-full">
                      {ticket.description}
                    </CardDescription>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="p-2 justify-center text-muted-foreground flex gap-2 hover:bg-muted transition-all rounded-md cursor-pointer items-center">
                          <Link2 />
                          <span className="text-xs font-bold">CONTACT</span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent side="right" className="w-fit">
                        <div className="flex justify-between space-x-4">
                          <Avatar>
                            <AvatarImage />
                            <AvatarFallback className="bg-primary">
                              {customer?.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">
                              {customer?.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {customer?.email}
                            </p>
                            <div className="flex items-center pt-2">
                              <Contact2 className="mr-2 h-4 w-4 opacity-70" />
                              <span className="text-xs text-muted-foreground">
                                Joined{" "}
                                {customer?.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </CardHeader>

                  <CardFooter className="m-0 p-2 border-t border-muted-foreground/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-7 h-7">
                        <AvatarImage alt="contact" src={assigned?.avatarUrl} />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          {assigned?.name}
                          {!ticket.assigned && <User2 className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-xs justify-center">
                        <span className="text-muted-foreground">
                          {ticket.assigned ? "Assigned to:" : "Not Assigned"}
                        </span>
                        {ticket.assigned && (
                          <span className="text-xs w-28 overflow-ellipsis overflow-hidden whitespace-nowrap text-muted-foreground">
                            {assigned?.name}
                          </span>
                        )}
                        x
                      </div>
                    </div>
                    {!!ticket.value && (
                      <span className="text-sm font-bold">
                        {formatPrice(+ticket.value)}
                      </span>
                    )}
                  </CardFooter>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={handleClickEdit}
                    >
                      <Edit className="w-4 h-4" />
                      Edit Ticket
                    </DropdownMenuItem>
                    <AlertDialogTrigger>
                      <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                        <Trash className="w-4 h-4" />
                        Delete Ticket
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </Card>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the ticket and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex items-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={handleDeleteTicket}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </DropdownMenu>
            </AlertDialog>
          </div>
        );
      }}
    </Draggable>
  );
};

export default PipelineTicket;
