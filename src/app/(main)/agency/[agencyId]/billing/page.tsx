import React from "react";
import { redirect } from "next/navigation";

import {
  getAddOnsProducts,
  getCharges,
  getPrices,
} from "@/lib/stripe/stripe-actions";
import { getAgencySubscription } from "@/database/actions/agency.actions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import PricingCard from "@/components/modules/billing/PricingCard";

import { PRICING } from "@/config/pricing";
import { cn, constructMetadata, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ADD_ONS } from "@/config/add-ons";

interface AgencyBillingPageProps {
  params: {
    agencyId: string | undefined;
  };
}

const AgencyBillingPage: React.FC<AgencyBillingPageProps> = async ({
  params,
}) => {
  const { agencyId } = params;

  if (!agencyId) redirect("/agency/unauthorized");

  // WIP: Create more add-ons products
  const addOns = await getAddOnsProducts();
  const agencySubscription = await getAgencySubscription(agencyId);

  const prices = await getPrices();
  const currentPlanDetails = PRICING.find(
    (price) => price.priceId === agencySubscription?.subscription?.priceId
  );

  const charges = await getCharges(agencySubscription?.customerId);
  const allCharges = [
    ...charges.data.map((charge) => ({
      id: charge.id,
      description: charge.description,
      date: `${new Date(charge.created * 1000).toLocaleTimeString()} ${new Date(
        charge.created * 1000
      ).toLocaleDateString()}`,
      status: "Paid",
      amount: `$${charge.amount / 100}`,
    })),
  ];

  const amt =
    agencySubscription?.subscription?.active && currentPlanDetails?.price
      ? currentPlanDetails?.price
      : "$0";

  const buttonCta = agencySubscription?.subscription?.active
    ? "Change Plan"
    : "Get Started";

  const description =
    agencySubscription?.subscription?.active && currentPlanDetails?.description
      ? currentPlanDetails?.description
      : "Lets get started! Pick a plan that works best for you!";

  const title =
    agencySubscription?.subscription?.active === true &&
    currentPlanDetails?.title
      ? currentPlanDetails?.title
      : "Starter";

  const starterFeatures =
    PRICING.find((feature) => feature.title === "Starter")?.features || [];

  const features =
    agencySubscription?.subscription?.active && currentPlanDetails?.features
      ? currentPlanDetails.features
      : starterFeatures;

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Billing</h1>
      <Separator className="mb-6" />
      <h2 className="text-2xl mb-4">Current Plan</h2>
      <div className="flex flex-col lg:!flex-row justify-between gap-8 mb-4">
        <PricingCard
          isPlanExists={Boolean(agencySubscription?.subscription?.active)}
          prices={prices.data}
          customerId={agencySubscription?.customerId || ""}
          amt={amt}
          buttonCta={buttonCta}
          description={description}
          title={title}
          highlightTitle="Plan Options"
          highlightDescription="Want to modify your plan? You can do this here."
          duration="/ month"
          features={features}
        />
        {addOns.data.map((addOn) => (
          <PricingCard
            isAddOn={true}
            key={addOn.id}
            isPlanExists={Boolean(agencySubscription?.subscription?.active)}
            prices={prices.data}
            customerId={agencySubscription?.customerId || ""}
            amt={
              // @ts-expect-error
              addOn.default_price?.unit_amount
                ? // @ts-expect-error
                  formatPrice(addOn.default_price?.unit_amount / 100, {
                    maximumFractionDigits: 0,
                  })
                : "$0"
            }
            buttonCta="Subscribe"
            description={addOn.description as string}
            title={addOn.name}
            highlightTitle={addOn.metadata.HighlightTitle}
            highlightDescription={addOn.metadata.HighlightDescription}
            duration={"/ month"}
            features={[
              "Dedicated Support Team",
              "Faster Response Times",
              "Priority Issue Resolution",
            ]}
          />
        ))}
      </div>
      <h2 className="text-2xl mb-4">Payment History</h2>
      <Table className="bg-card rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Invoice ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!!allCharges.length &&
            allCharges.map((charge) => (
              <TableRow key={charge.id}>
                <TableCell>{charge.description}</TableCell>
                <TableCell>
                  {format(new Date(charge.date), "dd/MM/yyyy hh:mm a")}
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn({
                      "bg-emerald-500 text-white":
                        charge.status.toLowerCase() === "paid",
                      "bg-orange-600 text-white":
                        charge.status.toLowerCase() === "pending",
                      "bg-destructive text-white":
                        charge.status.toLowerCase() === "failed",
                    })}
                  >
                    {charge.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{charge.amount + ".00"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {charge.id}
                </TableCell>
              </TableRow>
            ))}
          {!allCharges.length && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-14 text-muted-foreground"
              >
                No charges found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default AgencyBillingPage;

export const metadata = constructMetadata({
  title: "Billing | AgencyFlow",
});
