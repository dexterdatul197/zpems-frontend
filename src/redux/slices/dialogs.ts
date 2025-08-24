import { createSlice } from "@reduxjs/toolkit";

const EMPTY_DIALOG = { open: false, dialogData: null };

export const dialogsSlice = createSlice({
  name: "dialogs",
  initialState: {
    dialogs: {},
  },
  reducers: {
    // action.payload should now contain { id: 'dialogId', open: true/false }
    setDialogOpen(state: any, action) {
      const { id, open, dialogData } = action.payload;
      state.dialogs[id] = { ...state.dialogs[id], open, dialogData };
    },
    setDialogData(state: any, action) {
      const { id, dialogData, open } = action.payload;
      state.dialogs[id] = { ...state.dialogs[id], dialogData, open };
    },
    closeDialog(state: any, action) {
      const { id } = action.payload;
      state.dialogs[id] = EMPTY_DIALOG;
    },
  },
});

export const { setDialogOpen, setDialogData, closeDialog } =
  dialogsSlice.actions;

// Selector to get the open status of a dialog by ID
export const selectDialogOpen = (id: any) => (state: any) =>
  state.dialogs.dialogs[id]?.open || false;

export const selectDialogData = (id: any) => (state: any) =>
  state.dialogs.dialogs[id]?.dialogData || null;

export default dialogsSlice.reducer;
