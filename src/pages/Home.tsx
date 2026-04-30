import type { sessionType } from '../utils/types';
import { useFetchMeetings } from '../hooks/useFetchMeetings';
import Spinner from '../ui/Spinner';
import { useEffect, useMemo } from 'react';
import { useFetchAllSessions } from '../hooks/useFetchSession';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSelectedMeeting } from '../store/meetingSlice';
import { setSelectedSessionKey } from '../store/sessionSlice';
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Session from '../components/Session.tsx';

function Home() {
  const today = new Date();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const selectedMeetingKey = useAppSelector(
    (store) => store.meeting.selectedMeetingKey
  );
  const selectedSessionKey = useAppSelector(
    (store) => store.session.selectedSessionKey
  );

  const { data: meetings, isLoading: isLoadingMeetings } = useFetchMeetings(
    today.getFullYear()
  );

  const latestMeeting = useMemo(() => {
    if (!meetings?.length) return undefined;

    return meetings[meetings.length - 1];
  }, [meetings]);

  useEffect(() => {
    if (selectedMeetingKey || !latestMeeting) return;

    dispatch(setSelectedMeeting(latestMeeting.meeting_key));
  }, [selectedMeetingKey, latestMeeting, dispatch]);

  const effectiveMeetingKey =
    selectedMeetingKey ?? latestMeeting?.meeting_key ?? 0;

  const { data: sessions, isLoading: isLoadingSessions } =
    useFetchAllSessions(effectiveMeetingKey);

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
      (session) => session.session_key === selectedSessionKey
    );
    if (selected) return selected;
    return [...eligibleSessions].sort(
      (a, b) =>
        new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
    )[eligibleSessions.length - 1];
  }, [eligibleSessions, selectedSessionKey]);

  useEffect(() => {
    if (!effectiveSession) return;
    if (selectedSessionKey === effectiveSession.session_key) return;
    dispatch(setSelectedSessionKey(effectiveSession.session_key));
  }, [effectiveSession, selectedSessionKey, dispatch]);

  if (isLoadingMeetings || (effectiveMeetingKey > 0 && isLoadingSessions))
    return <Spinner />;

  if (pathname !== '/home') return <Outlet />;

  const StyledHomeTitleContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  return (
    <div>
      <div>
        <Session />
      </div>

      <StyledHomeTitleContainer>
        <h1>Seleziona uno strumento</h1>
      </StyledHomeTitleContainer>
    </div>
  );
}

export default Home;
