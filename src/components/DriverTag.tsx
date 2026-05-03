import styled from 'styled-components';

const StyledDriverTag = styled.h5<{ $color: string }>`
  height: auto;
  width: 80px;

  padding: 2px;

  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-lg);
  background-color: ${(props) =>
    props.$color ? `#${props.$color}` : 'transparent'};

  text-align: center;
  vertical-align: center;
`;

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
