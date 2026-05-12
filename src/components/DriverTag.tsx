import { StyledDriverTag } from '../style/styles.ts';
import type { DriverTagProps } from '../utils/types.ts';

function DriverTag({
  driverTag,
  position,
  color = '',
}: DriverTagProps) {
  return (
    <StyledDriverTag $color={color}>
      {position} {driverTag}
    </StyledDriverTag>
  );
}

export default DriverTag;
