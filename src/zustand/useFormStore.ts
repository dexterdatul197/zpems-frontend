//@ts-nocheck
import { create } from "zustand";

export enum FormState {
  Idle = "IDLE", // When the form is not doing anything
  Loading = "LOADING", // When the form is initially loaded or data is being fetched
  Ready = "READY", // When the form is ready for user input
  Submititng = "SUBMITTING", // When the form is being submitted
  Error = "ERROR", // When an error occurs (e.g., submission failure, validation error)
  Completed = "COMPLETED", // When the form submission is successful
}

const EMPTY_FORM = { formState: FormState.Loading, formData: null };

export const useFormStore = create((set, get) => ({
  forms: {},
}));

export const formActions = {
  setFormState: (id, formState) => {
    useFormStore.setState((state) => ({
      forms: {
        ...state.forms,
        [id]: { ...state.forms[id], formState },
      },
    }));
  },
  setFormData: (id, formData) => {
    useFormStore.setState((state) => ({
      forms: {
        ...state.forms,
        [id]: { ...state.forms[id], formData },
      },
    }));
  },
  resetForm: (id) => {
    useFormStore.setState((state) => ({
      forms: {
        ...state.forms,
        [id]: EMPTY_FORM,
      },
    }));
  },

  //   selectForm: (id) => useFormStore.getState().forms[id] || EMPTY_FORM,
  formSelector: (id) => (state) => state.forms[id] || EMPTY_FORM,
  getFormState: (id) =>
    useFormStore.getState().forms[id]?.formState || EMPTY_FORM.formState,
  getFormData: (id) =>
    useFormStore.getState().forms[id]?.formData || EMPTY_FORM,
};
