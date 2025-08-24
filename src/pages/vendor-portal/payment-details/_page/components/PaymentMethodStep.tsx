import { updatePayment } from "@/api/sap/vendors";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";
import { usePaymentDetailsStore } from "../zustand/usePaymentDetailsStore";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { PaymentMethodView } from "./PaymentMethodView";

export const PaymentMethodStep = ({ data }: any) => {
  const queryClient = useQueryClient();
  const formRef = useRef(null);

  const { activeStepIndex, getActiveStep, setStepOptions } =
    usePaymentDetailsStore();

  const activeStep = getActiveStep();

  const { isEditing } = activeStep.options;

  const handleSave = async (values: any) => {
    try {
      await updatePayment(data._id, { method: values });
      toast.success("The payment method has updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["vendorData"] });
      setStepOptions(activeStepIndex, { isEditing: false });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update the payment method");
    }
  };

  return (
    <>
      {isEditing ? (
        <PaymentMethodForm
          initialValues={data}
          onSubmit={handleSave}
          ref={formRef}
        />
      ) : (
        <PaymentMethodView
          initialValues={data}
          onEdit={() => setStepOptions(activeStepIndex, { isEditing: true })}
        />
      )}
    </>
  );
};
