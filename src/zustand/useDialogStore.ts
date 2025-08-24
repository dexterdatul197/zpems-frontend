//@ts-nocheck
import { create } from "zustand";

export const useDialogStore = create((set, get) => ({
  dialogs: {},

  openDialog: (id, dialogData = null) =>
    set((state) => ({
      dialogs: {
        ...state.dialogs,
        [id]: { ...state.dialogs[id], open: true, dialogData },
      },
    })),

  closeDialog: (id) =>
    set((state) => ({
      dialogs: {
        ...state.dialogs,
        [id]: { open: false, dialogData: null },
      },
    })),

  selectDialogOpen: (id) => get().dialogs[id]?.open || false,

  selectDialogData: (id) => get().dialogs[id]?.dialogData || null,
}));

export const dialogActions = {
  openDialog: (id, dialogData = null) => {
    useDialogStore.setState((state) => ({
      dialogs: {
        ...state.dialogs,
        [id]: { ...state.dialogs[id], open: true, dialogData },
      },
    }));
  },

  closeDialog: (id) => {
    useDialogStore.setState((state) => ({
      dialogs: {
        ...state.dialogs,
        [id]: { open: false, dialogData: null },
      },
    }));
  },

  isDialogOpen: (id) => useDialogStore.getState().dialogs[id]?.open || false,
  getDialogData: (id) =>
    useDialogStore.getState().dialogs[id]?.dialogData || null,
};
