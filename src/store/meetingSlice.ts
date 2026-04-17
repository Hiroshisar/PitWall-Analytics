import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MeetingState } from "../utils/types";

const initialState: MeetingState = {
  year: null,
  selectedMeetingKey: null,
};

export const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    setSelectedMeeting(
      state,
      action: PayloadAction<{
        year: number | null;
        selectedMeetingKey: number | null;
      }>,
    ) {
      state.selectedMeetingKey = action.payload.selectedMeetingKey;
    },
  },
});

export const { setSelectedMeeting } = meetingSlice.actions;
export default meetingSlice.reducer;
