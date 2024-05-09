"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, ChevronsUpDownIcon, User2 } from "lucide-react";

import { getSubAccountTeamMembers } from "@/database/actions/subaccount.actions";
import { searchContacts } from "@/database/actions/contact.actions";
import { saveActivityLogsNotification } from "@/database/actions/notification.actions";
import { upsertTicket } from "@/database/actions/ticket.actions";

import { useModal } from "@/hooks/use-modal";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import TagDetails from "./TagDetails";

import {
  type TicketDetailsSchema,
  TicketDetailsValidator,
} from "@/lib/validators/ticket-details";
import { cn } from "@/lib/utils";
import { IUser } from "@/database/models/user.model";
import { IContact } from "@/database/models/contact.model";
import { ITag } from "@/database/models/tag.model";
import { ITicketPopulated } from "@/database/models/ticket.model";
import { Types } from "mongoose";

interface TicketDetailsProps {
  laneId: string;
  subAccountId: string;
  getNewTicket: (ticket: ITicketPopulated) => void;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({
  getNewTicket,
  laneId,
  subAccountId,
}) => {
  const router = useRouter();
  const { data: defaultData, setClose } = useModal();

  const [tags, setTags] = React.useState<ITag[]>([]);
  const [contactList, setContactList] = React.useState<IContact[]>([]);
  const [allTeamMembers, setAllTeamMembers] = React.useState<IUser[]>([]);
  const [contactId, setContactId] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");
  const [assignedTo, setAssignedTo] = React.useState<string>(
    defaultData?.ticket?.assigned?._id || ""
  );

  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout>>();

  const form = useForm<TicketDetailsSchema>({
    resolver: zodResolver(TicketDetailsValidator),
    mode: "onChange",
    defaultValues: {
      name: defaultData.ticket?.name || "",
      description: defaultData.ticket?.description || "",
      value: String(defaultData.ticket?.value || 0),
    },
  });

  React.useEffect(() => {
    if (subAccountId) {
      const fetchTeamMembers = async () => {
        const response = await getSubAccountTeamMembers(subAccountId);

        if (response) setAllTeamMembers(response);
      };

      fetchTeamMembers();
    }
  }, [subAccountId]);

  React.useEffect(() => {
    if (defaultData.ticket) {
      form.reset({
        name: defaultData.ticket.name || "",
        description: defaultData.ticket.description || "",
        value: String(defaultData.ticket.value || 0),
      });

      if (defaultData.ticket.customer) {
        setContactId(
          typeof defaultData.ticket?.customer === "string"
            ? defaultData.ticket.customer
            : defaultData.ticket.customer._id
        );
      }
    }
    const fetchContacts = async () => {
      const response = await searchContacts(
        typeof defaultData.ticket?.customer === "string"
          ? defaultData.ticket.customer
          : "",
        subAccountId
      );
      setContactList(response);
    };

    fetchContacts();
  }, [defaultData, form, subAccountId]);

  const onSubmit: SubmitHandler<TicketDetailsSchema> = async (values) => {
    if (!laneId) return;

    const ticketId = defaultData.ticket?._id || new Types.ObjectId().toString();

    try {
      const response = await upsertTicket(
        {
          value: Number(values.value),
          name: values.name,
          description: values.description,
          lane: laneId,
          _id: ticketId,
          assigned: assignedTo,
          ...(contactId
            ? {
                customer: contactId,
              }
            : {}),
        },
        tags
      );

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a ticket | ${response?.name}`,
        subAccountId,
      });

      toast.success("Success", {
        description: "Saved ticket details",
      });

      if (response) {
        getNewTicket(response);
        setClose();
      }

      router.refresh();
    } catch (error) {
      toast.error("Oppse!", {
        description: "Could not save ticket details",
      });
    }
  };

  const isLoading = form.formState.isLoading || form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ticket name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ticket description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket value</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 relative">
                      <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
                        <span className="text-sm text-zinc-400">$</span>
                      </div>
                      <Input
                        placeholder="Ticket value"
                        className="pl-6"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h3 className="text-2xl font-semibold">Add tags</h3>
            <TagDetails
              subAccountId={subAccountId}
              getSelectedTags={setTags}
              defaultTags={(defaultData.ticket?.tags as ITag[]) || []}
            />
            <FormItem>
              <FormLabel>Assign to Team Member</FormLabel>
              <Select onValueChange={setAssignedTo} defaultValue={assignedTo}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage alt="contact" />
                          <AvatarFallback className="bg-primary text-sm text-white">
                            <User2 className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>

                        <span className="text-sm text-muted-foreground">
                          Not Assigned
                        </span>
                      </div>
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {allTeamMembers.map((teamMember) => (
                    <SelectItem
                      key={teamMember._id}
                      value={teamMember._id}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage
                            alt="contact"
                            src={teamMember.avatarUrl}
                          />
                          <AvatarFallback className="bg-primary text-sm text-white">
                            <User2 className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>

                        <span className="text-sm">{teamMember.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Popover>
                <PopoverTrigger asChild className="w-full">
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between"
                  >
                    {contactId
                      ? contactList.find((c) => c._id === contactId)?.name
                      : "Select Customer..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search for customers..."
                      className="h-9"
                      value={search}
                      onValueChange={async (value) => {
                        setSearch(value);

                        if (saveTimerRef.current) {
                          clearTimeout(saveTimerRef.current);
                        }

                        saveTimerRef.current = setTimeout(async () => {
                          const response = await searchContacts(
                            value,
                            subAccountId
                          );

                          setContactList(response);
                          setSearch("");
                        }, 1000);
                      }}
                    />
                    {!!contactList.length && (
                      <CommandEmpty>No Customer found.</CommandEmpty>
                    )}
                    {!contactList.length && (
                      <div className="py-6 text-center text-sm">
                        No Customer found.
                      </div>
                    )}
                    <CommandList>
                      {contactList.map((contact) => (
                        <CommandItem
                          key={contact._id}
                          value={contact._id}
                          onSelect={(currentValue) => {
                            setContactId(
                              currentValue === contactId ? "" : currentValue
                            );
                          }}
                        >
                          {contact.name}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              contactId === contact._id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormItem>
            <div className="flex justify-end">
              <Button
                className="w-20 mt-4"
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TicketDetails;
