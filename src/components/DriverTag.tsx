import { StyledDriverTag } from '../style/styles.ts';

function DriverTag({
  driverTag,
  position,
  color = '',
}: {
  driverTag: string;
  position: number;
  color: string;
}) {
  return (
    <StyledDriverTag $color={color}>
      {position} {driverTag}
    </StyledDriverTag>
  );
}

export default DriverTag;
