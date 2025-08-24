//@ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

export enum FormState {
  Idle = "IDLE", // When the form is not doing anything
  Loading = "LOADING", // When the form is initially loaded or data is being fetched
  Ready = "READY", // When the form is ready for user input
  Submititng = "SUBMITTING", // When the form is being submitted
  Error = "ERROR", // When an error occurs (e.g., submission failure, validation error)
  Completed = "COMPLETED", // When the form submission is successful
}

// const EMPTY_FORM = { formState: FormState.Loading, formData: null }
const EMPTY_FORM = { formState: FormState.Loading, formData: null };

export const formsSlice = createSlice({
  name: "forms",
  initialState: {
    forms: {},
  },
  reducers: {
    // action.payload should now contain { id: 'formId', isLoading: true/false }
    setFormState(state, action) {
      const { id, formState, formData } = action.payload;
      state.forms[id] = { ...state.forms[id], formState, formData };
    },
    setFormData(state, action) {
      const { id, formData, formState } = action.payload;
      state.forms[id] = { ...state.forms[id], formData, formState };
    },
    resetForm(state, action) {
      const { id } = action.payload;
      state.forms[id] = EMPTY_FORM;
    },
  },
});

export const { setFormState, setFormData, resetForm } = formsSlice.actions;

// Selector to get the formState of a form by ID
export const selectFormState = (id) => (state) =>
  state.forms.forms[id]?.formState || EMPTY_FORM.formState;

export const selectFormData = (id) => (state) =>
  state.forms.forms[id]?.formData || EMPTY_FORM;

export default formsSlice.reducer;
