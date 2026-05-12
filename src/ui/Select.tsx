import { StyledOption, StyledSelect } from '../style/styles.ts';
import type { SelectProps } from '../utils/types.ts';

export function Select({
  value,
  meetings,
  sessions,
  max,
  onSelect,
}: SelectProps) {
  const sortedMeetings = meetings
    ? [...meetings].sort(
        (a, b) =>
          new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
      )
    : undefined;

  const sortedSessions = sessions
    ? [...sessions].sort(
        (a, b) =>
          new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
      )
    : undefined;

  return (
    <StyledSelect
      value={value}
      onChange={(e) => onSelect(Number(e.target.value))}
    >
      {!meetings && !sessions && (
        <>
          <StyledOption value={0}>Fastest</StyledOption>
          {Array.from(
            {
              length: max ?? 0,
            },
            (_, index) => (
              <StyledOption key={index} value={index + 1}>
                {index + 1}
              </StyledOption>
            )
          )}
        </>
      )}
      {meetings && !sessions && (
        <>
          {sortedMeetings?.map((meeting) => (
            <StyledOption key={meeting.meeting_key} value={meeting.meeting_key}>
              {meeting.circuit_short_name}
            </StyledOption>
          ))}
        </>
      )}
      {sessions && !meetings && (
        <>
          {sortedSessions?.map((session) => (
            <StyledOption key={session.session_key} value={session.session_key}>
              {session.session_name}
            </StyledOption>
          ))}
        </>
      )}
    </StyledSelect>
  );
}
