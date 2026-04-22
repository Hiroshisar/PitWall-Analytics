import { useEffect, useState } from "react";
import { useFetchMeetings } from "../hooks/useFetchMeetings";
import { useFetchAllSessions } from "../hooks/useFetchSession";
import { formatDate } from "../utils/helpers";
import { Button, StyledForm, StyledFromField } from "../style/styles";
import Spinner from "../ui/Spinner";
import { useAppDispatch } from "../store/hooks";
import { setSelectedMeeting } from "../store/meetingSlice";
import { setSelectedSessionKey } from "../store/sessionSlice";

function Form() {
  const currentYear = new Date().getFullYear();

  const dispatch = useAppDispatch();

  const [meeting, setMeeting] = useState(0);
  const [session, setSession] = useState(0);

  const [appliedMeeting, setAppliedMeeting] = useState(0);

  useEffect(() => {
    setAppliedMeeting(Number(meeting));
  }, [meeting]);

  const {
    data: meetings,
    isLoading: isLoadingMeetings,
    error: meetingError,
  } = useFetchMeetings(currentYear);

  const {
    data: sessions,
    isLoading: isLoadingSessions,
    error: sessionError,
  } = useFetchAllSessions(Number(appliedMeeting));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setSelectedMeeting(meeting));
    dispatch(setSelectedSessionKey(session));
  };

  if (meetingError || sessionError) console.log();

  if (isLoadingMeetings || isLoadingSessions) <Spinner />;
  return (
    <>
      <h2>{`Choose a race from ${currentYear}!`}</h2>
      <StyledForm onSubmit={handleSubmit}>
        <StyledFromField>
          <label htmlFor="weekend">Weekend</label>
          <select
            id="weekend"
            value={meeting ? meeting : ""}
            onChange={(e) => setMeeting(Number(e.target.value))}
            disabled={meetings && meetings.length ? false : true}
          >
            <option value={""}>--- SELECT ONE ---</option>
            {meetings?.map((m) => (
              <option
                key={`${m.circuit_short_name} - ${m.date_start}`}
                value={m.meeting_key}
              >
                {`${m.circuit_short_name} - ${formatDate(m.date_start)}`}
              </option>
            ))}
          </select>
        </StyledFromField>

        <StyledFromField>
          <label htmlFor="session">Session</label>
          <select
            id="session"
            value={session ? session : ""}
            onChange={(e) => setSession(Number(e.target.value))}
            disabled={sessions && sessions.length ? false : true}
          >
            <option value={""}>--- SELECT ONE ---</option>
            {sessions?.map((s) => (
              <option
                key={`${s.session_key} - ${s.date_start}`}
                value={s.session_key}
              >
                {`${s.session_name} - ${s.session_type}`}
              </option>
            ))}
          </select>
        </StyledFromField>

        <div>
          <Button type="submit" disabled={session ? false : true}>
            Cerca
          </Button>
        </div>
      </StyledForm>
    </>
  );
}

export default Form;
