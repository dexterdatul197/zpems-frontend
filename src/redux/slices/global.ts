//@ts-nocheck

// TODO: not used yet
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  isDentrixConnected: boolean;
}

const initialState: GlobalState = {
  isDentrixConnected: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setGlobalValue: (
      state,
      action: PayloadAction<{ key: string; value: any }>
    ) => {
      const { key, value } = action.payload;
      if (state.hasOwnProperty(key)) {
        state[key] = value;
      }
    },
  },
});

export const { setGlobalValue } = globalSlice.actions;

export const selectGlobalValue = (key) => (state) => {
  return state.global.hasOwnProperty(key) ? state.global[key] : undefined;
};

export default globalSlice.reducer;
