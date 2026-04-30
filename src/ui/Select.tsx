import { StyledOption, StyledSelect } from '../style/styles.ts';

export function Select({
  selectedLap,
  max,
  onSelect,
}: {
  selectedLap: number;
  max: number;
  onSelect: (lap: number) => void;
}) {
  return (
    <StyledSelect
      value={selectedLap ?? '0'}
      onChange={(e) => onSelect(Number(e.target.value))}
    >
      <StyledOption value="0" disabled>
        ---
      </StyledOption>
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
    </StyledSelect>
  );
}
