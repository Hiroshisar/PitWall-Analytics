import type { sessionType } from "../utils/types";
import { useFetchMeetings } from "../hooks/useFetchMeetings";
import Spinner from "../ui/Spinner";
import { useEffect, useMemo } from "react";
import { useFetchSessions } from "../hooks/useFetchSession";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSelectedMeeting } from "../store/meetingSlice";
import { setSelectedSessionKey } from "../store/sessionSlice";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function Dashboard() {
  const today = new Date();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const selectedMeetingKey = useAppSelector(
    (store) => store.meeting.selectedMeetingKey,
  );
  const selectedSessionKey = useAppSelector(
    (store) => store.session.selectedSessionKey,
  );

  const { data: meetings, isLoading: isLoadingMeetings } = useFetchMeetings(
    today.getFullYear(),
  );

  useEffect(() => {
    if (selectedMeetingKey || !meetings?.length) return;

    const latestMeeting = meetings[meetings.length - 1];

    dispatch(setSelectedMeeting(latestMeeting.meeting_key));
  }, [selectedMeetingKey, meetings, dispatch]);

  const effectiveMeetingKey = selectedMeetingKey ?? 0;

  const { data: sessions, isLoading: isLoadingSessions } =
    useFetchSessions(effectiveMeetingKey);

  const eligibleSessions = useMemo(() => {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return (sessions ?? [])
      .filter((elem: sessionType) => !elem.is_cancelled)
      .filter((elem: sessionType) => new Date(elem.date_start) <= endOfToday);
  }, [sessions]);

  const effectiveSession = useMemo(() => {
    if (!eligibleSessions.length) return undefined;

    const selected = eligibleSessions.find(
      (session) => session.session_key === selectedSessionKey,
    );
    if (selected) return selected;
    return [...eligibleSessions].sort(
      (a, b) =>
        new Date(a.date_start).getTime() - new Date(b.date_start).getTime(),
    )[eligibleSessions.length - 1];
  }, [eligibleSessions, selectedSessionKey]);

  useEffect(() => {
    if (!effectiveSession) return;
    if (selectedSessionKey === effectiveSession.session_key) return;
    dispatch(setSelectedSessionKey(effectiveSession.session_key));
  }, [effectiveSession, selectedSessionKey, dispatch]);

  const isLiveSession = useMemo(() => {
    if (!effectiveSession) return false;

    const now = new Date().getTime();
    const start = new Date(effectiveSession.date_start).getTime();
    const end = new Date(effectiveSession.date_end).getTime();

    return now >= start && now <= end;
  }, [effectiveSession]);

  if (isLoadingMeetings || (effectiveMeetingKey > 0 && isLoadingSessions))
    return <Spinner />;

  if (location.pathname === "/")
    return <Navigate to={isLiveSession ? "/live" : "/analyze"} replace />;

  return (
    <>
      <div>Dashboard</div>
      <Outlet />
    </>
  );
}

export default Dashboard;
