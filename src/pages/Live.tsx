import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  cacheOpenF1LiveMessage,
  connectOpenF1LiveWebSocket,
  type OpenF1LiveConnection,
} from '../api/websocket';
import type { RootState } from '../store/store';
import type { sessionType } from '../utils/types';
import {
  LivePageRow,
  StyledLivePage,
  LivePageCenter,
  LivePageColumn,
} from '../style/styles';
import { queryClient } from '../hooks/queryClient';
import Session from '../components/Session.tsx';
import Map from '../components/Map.tsx';
import Timer from '../components/Timer.tsx';
import { useFetchNextSession } from '../hooks/useFetchSession.ts';
import Spinner from '../ui/Spinner.tsx';
import SessionGrid from '../components/SessionGrid.tsx';
import RaceControl from '../components/RaceControl.tsx';
import TeamRadio from '../components/TeamRadio.tsx';

function Live() {
  // chissà se con i dati live questo sarà necessario?
  const meetingData = useSelector((store: RootState) => store.meeting);
  const sessionData = useSelector((store: RootState) => store.session);

  const { selectedMeetingKey } = meetingData;
  const { selectedSessionKey } = sessionData;

  const sessions = queryClient.getQueryData<sessionType[]>([
    'sessions',
    selectedMeetingKey,
  ]);

  const selectedSession = sessions?.find(
    (s) => s.session_key === selectedSessionKey
  );

  const { data: nextSession, isLoading: isLoadingNextSession } =
    useFetchNextSession();

  useEffect(() => {
    if (!selectedSessionKey) return;

    let isCancelled = false;
    let liveConnection: OpenF1LiveConnection | null = null;

    connectOpenF1LiveWebSocket({
      sessionKey: selectedSessionKey,
      onMessage: (message) => {
        cacheOpenF1LiveMessage(queryClient, message);
      },
      onError: (error) => {
        console.error('OpenF1 live stream error:', error);
      },
    })
      .then((connection) => {
        if (isCancelled) {
          connection.close();
          return;
        }

        liveConnection = connection;
      })
      .catch((error: unknown) => {
        console.error('Unable to start OpenF1 live stream:', error);
      });

    return () => {
      isCancelled = true;
      liveConnection?.close();
    };
  }, [selectedSessionKey]);

  if (!selectedSession) return;

  // const isLive = checkIfIsLiveSession(    selectedSession?.date_start,    selectedSession?.date_end  );
  // TODO rimuovere questo test
  const isLive = true;

  if (isLoadingNextSession) return <Spinner />;

  return (
    <>
      {isLive ? (
        <StyledLivePage>
          <LivePageRow>
            <Session />
          </LivePageRow>
          <LivePageRow>
            <LivePageCenter>
              <LivePageColumn>
                <SessionGrid sessionKey={selectedSessionKey ?? 0} />
              </LivePageColumn>
              <LivePageColumn>
                <LivePageRow>
                  <Map sessionKey={selectedSessionKey ?? 0} />
                </LivePageRow>
                <LivePageRow>
                  <RaceControl sessionKey={selectedSessionKey ?? 0} />
                  <TeamRadio sessionKey={selectedSessionKey ?? 0} />
                </LivePageRow>
              </LivePageColumn>
            </LivePageCenter>
          </LivePageRow>
        </StyledLivePage>
      ) : (
        <StyledLivePage>
          <LivePageRow>
            <Session session={nextSession ? nextSession : undefined} />
          </LivePageRow>
          <LivePageCenter>
            <h1>Next session in</h1>
            <Timer
              dateStart={new Date().toString()}
              dateEnd={nextSession?.date_start ?? ''}
            />
          </LivePageCenter>
        </StyledLivePage>
      )}
    </>
  );
}

export default Live;
