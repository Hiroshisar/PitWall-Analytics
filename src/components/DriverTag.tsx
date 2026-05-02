import styled from 'styled-components';

const StyledDriverTag = styled.div`
  height: auto;
  width: 80px;

  display: flex;

  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-3xl);

  justify-content: center;
  align-items: center;

  padding: 2px;
`;

function DriverTag({ driverTag }: { driverTag: string }) {
  return (
    <StyledDriverTag>
      <h5>{driverTag}</h5>
    </StyledDriverTag>
  );
}

export default DriverTag;
