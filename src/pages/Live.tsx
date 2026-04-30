import { useSelector } from 'react-redux';
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

  const s = sessions?.find((s) => s.session_key === selectedSessionKey);
  // rimuovere questo if
  if (!s) return;
  // TODO inserire controllo per live o no. se non live inserire un timer per la prossima sessione

  return (
    <StyledLivePage>
      <LivePageRow>
        <Session />
      </LivePageRow>
      <LivePageRow>
        <LivePageCenter>
          <LivePageColumn>
            <h1>Griglia</h1>
          </LivePageColumn>
          <LivePageColumn>
            <LivePageRow>
              <Map selectedDrivers={[]} />
            </LivePageRow>
            <LivePageRow>
              <h1>Race control</h1>
              <h1>Team radio</h1>
            </LivePageRow>
          </LivePageColumn>
        </LivePageCenter>
      </LivePageRow>
    </StyledLivePage>
  );
}

export default Live;
