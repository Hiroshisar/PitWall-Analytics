import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { meetingStateType } from "../utils/types";

const initialState: meetingStateType = {
  selectedMeetingKey: null,
};

export const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    setSelectedMeeting(state, action: PayloadAction<number | null>) {
      state.selectedMeetingKey = action.payload;
    },
  },
});

export const { setSelectedMeeting } = meetingSlice.actions;
export default meetingSlice.reducer;
