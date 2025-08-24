//@ts-nocheck

// TODO: not used yet

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: Object | null;
  // isAuthenticated: boolean
  // status: string
  // error: string | null
}

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },
  },
});

export const { setAuthUser } = authSlice.actions;

export const selectAuthUser = () => (state) => state.auth.user;

export default authSlice.reducer;
