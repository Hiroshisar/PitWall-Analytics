import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { sessionStateType } from "../utils/types";

const initialState: sessionStateType = {
  selectedSessionKey: null,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSelectedSessionKey(state, action: PayloadAction<number | null>) {
      state.selectedSessionKey = action.payload;
    },
  },
});

export const { setSelectedSessionKey } = sessionSlice.actions;
export default sessionSlice.reducer;
