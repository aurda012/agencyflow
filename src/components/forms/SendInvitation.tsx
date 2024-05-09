"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Role, SubAccount } from "@prisma/client";

import { saveActivityLogsNotification } from "@/database/actions/notification.actions";
import { sendInvitation } from "@/database/actions/invitation.actions";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

import {
  SendInvitationValidator,
  type SendInvitationSchema,
} from "@/lib/validators/send-invitation";
import { useModal } from "@/hooks/use-modal";
import { ISubAccount } from "@/database/models/subaccount.model";

interface SendInvitationProps {
  agencyId: string;
  subAccounts: ISubAccount[];
}

const SendInvitation: React.FC<SendInvitationProps> = ({
  agencyId,
  subAccounts,
}) => {
  const { setClose } = useModal();
  const form = useForm<SendInvitationSchema>({
    resolver: zodResolver(SendInvitationValidator),
    mode: "onChange",
    defaultValues: {
      email: "",
      role: Role.SUBACCOUNT_USER,
    },
  });

  const onSubmit = async (values: SendInvitationSchema) => {
    if (values.role !== "AGENCY_ADMIN" && !values.subAccountId) {
      toast.error("No Sub Account!", {
        description: "Please select a sub account for this invitation.",
      });
      return;
    }

    try {
      const response = await sendInvitation(
        values.name,
        values.role,
        values.email,
        agencyId,
        values.subAccountId
      );

      await saveActivityLogsNotification({
        agencyId,
        description: `Invited ${response.email}`,
        subAccountId: values.subAccountId ? values.subAccountId : undefined,
      });

      setClose();
      toast.success("Success", {
        description: "Created and sent invitation",
      });
    } catch (error) {
      setClose();
      toast.error("Oppse!", {
        description: "Could not send invitation",
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitation</CardTitle>
        <CardDescription>
          An invitation will be sent to the user. Users who already have an
          invitation sent out to their email, will not receive another
          invitation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              disabled={isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User role</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                      <SelectItem value="SUBACCOUNT_USER">
                        Sub Account User
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">
                        Sub Account Guest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.getValues().role !== "AGENCY_ADMIN" && (
              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="subAccountId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Sub Account</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Sub Account..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subAccounts.map((subAccount) => (
                          <SelectItem
                            key={subAccount._id}
                            value={subAccount._id}
                          >
                            {subAccount.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button
              disabled={isSubmitting}
              isLoading={isSubmitting}
              type="submit"
            >
              Send Invitation
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SendInvitation;
