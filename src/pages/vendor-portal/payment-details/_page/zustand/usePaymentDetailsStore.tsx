import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { AddressStep } from "../components/AddressStep";
import { PaymentMethodStep } from "../components/PaymentMethodStep";

type PaymentDetailsStore = {
  steps: {
    id: number;
    name: string;
    renderComponent: (data: any) => React.ReactNode;
    options: any;
  }[];
  activeStepIndex: number;

  getActiveStep: () => any;
  setStepOptions: (stepIndex: number, options: any) => void;

  renderStep: (data: any) => React.ReactNode;

  canGoNext: () => boolean;
  canGoPrev: () => boolean;

  goNext: () => void;
  goPrev: () => void;
};

export const usePaymentDetailsStore = create<PaymentDetailsStore>()(
  immer((set, get) => ({
    steps: [
      {
        id: 1,
        name: "Address",
        renderComponent: (data: any) => <AddressStep data={data} />,
        options: {},
        canGoNext: () => {
          const { isEditing } = get().getActiveStep().options;
          return !isEditing;
        },
        canGoPrev: () => {
          return false;
        },
      },
      {
        id: 2,
        name: "Payment Method",
        renderComponent: (data: any) => <PaymentMethodStep data={data} />,
        options: {},
        canGoNext: () => {
          return true;
        },
        canGoPrev: () => {
          return true;
        },
      },
      {
        id: 3,
        name: "Tax Forms",
        renderComponent: (_: any) => <div>Tax Forms</div>,
        options: {},
        canGoNext: () => {
          return true;
        },
        canGoPrev: () => {
          return true;
        },
      },
      {
        id: 4,
        name: "Done",
        renderComponent: (_: any) => <div>Done</div>,
        options: {},
        canGoNext: () => {
          return false;
        },
        canGoPrev: () => {
          return true;
        },
      },
    ],

    activeStepIndex: 0,

    getActiveStep: () => {
      return get().steps[get().activeStepIndex];
    },
    setStepOptions: (stepIndex, options) => {
      set((state) => {
        state.steps[stepIndex].options = {
          ...state.steps[stepIndex].options,
          ...options,
        };
      });
    },

    canGoNext: () => {
      return get().getActiveStep().canGoNext();
    },
    canGoPrev: () => {
      return get().getActiveStep().canGoPrev();
    },

    renderStep: (data) => {
      const activeStepIndex = get().activeStepIndex;
      const step: any = get().steps[activeStepIndex];
      return step.renderComponent(data);
    },

    goNext: () => {
      if (!get().canGoNext()) {
        return;
      }
      set((state) => {
        state.activeStepIndex += 1;
      });
    },
    goPrev: () => {
      if (!get().canGoPrev()) {
        return;
      }
      set((state) => {
        state.activeStepIndex -= 1;
      });
    },
  }))
);
