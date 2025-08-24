import { updatePayment } from "@/api/sap/vendors";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";
import { AddressForm } from "./AddressForm";
import { AddressView } from "./AddressView";
import { usePaymentDetailsStore } from "../zustand/usePaymentDetailsStore";

export const AddressStep = ({ data }: any) => {
  const queryClient = useQueryClient();
  const formRef = useRef(null);

  const { activeStepIndex, getActiveStep, setStepOptions } =
    usePaymentDetailsStore();

  const activeStep = getActiveStep();

  const { isEditing } = activeStep.options;

  const handleSave = async (values: any) => {
    try {
      await updatePayment(data._id, { address: values });
      toast.success("The vendor address has updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["vendorData"] });
      setStepOptions(activeStepIndex, { isEditing: false });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update the vendor address");
    }
  };

  return (
    <>
      {isEditing ? (
        <AddressForm initialValues={data} onSubmit={handleSave} ref={formRef} />
      ) : (
        <AddressView
          initialValues={data}
          onEdit={() => setStepOptions(activeStepIndex, { isEditing: true })}
        />
      )}
    </>
  );
};
