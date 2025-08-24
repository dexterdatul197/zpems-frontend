import { HeaderPortal } from "@/pages/_page/HeaderPortal";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";

import { getVendorByUserId } from "@/api/sap/vendors";

import { usePaymentDetailsStore } from "./zustand/usePaymentDetailsStore";
import { useRouteLoaderData } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export const PaymentDetails = () => {
  const { authUser }: any = useRouteLoaderData("root");

  const {
    steps,
    activeStepIndex,
    canGoNext,
    canGoPrev,
    goNext,
    goPrev,
    renderStep,
  } = usePaymentDetailsStore();

  const { data: vendorData } = useQuery({
    queryKey: ["vendorData"],
    queryFn: async () => await getVendorByUserId(authUser.id),
  });

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Payment Details</h1>
      </HeaderPortal>
      <div className="p-10">
        <Stepper steps={steps} activeStep={activeStepIndex} />
        <div className="mt-10 flex flex-col gap-4">
          {renderStep(vendorData)}

          <Separator />

          <div className="flex justify-between">
            <Button onClick={goPrev} disabled={!canGoPrev()}>
              Back
            </Button>
            <Button onClick={goNext} disabled={!canGoNext()}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
