import { configureStore } from "@reduxjs/toolkit";
import meetingReducer from "./meetingSlice";
import sessionReducer from "./sessionSlice";

const store = configureStore({
  reducer: {
    meeting: meetingReducer,
    session: sessionReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
