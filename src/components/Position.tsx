import styled from 'styled-components';
import DriverTag from './DriverTag';
import DriverSector from './DriverSector';
import DriverTime from './DriverTime';
import Drs from './Drs';
import type { driverType } from '../utils/types';

const StyledPosition = styled.div`
  max-height: 80px;
  width: 100%;

  display: grid;
  grid-template-columns: auto 1fr;

  justify-content: center;
  align-items: center;

  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-3xl);

  padding-left: 5px;
  padding-top: 2.5px;
`;

function Position({
  sessionKey,
  driver,
}: {
  sessionKey: number;
  driver: driverType;
}) {
  return (
    <StyledPosition>
      <div>
        <div
          style={{
            border: '1px solid var(--color-grey-400)',
            borderRadius: 'var(--border-radius-3xl)',
          }}
        >
          <DriverTag driverTag={driver.name_acronym} />
        </div>
        <div
          style={{
            height: 'auto',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Drs sessionKey={sessionKey} driver={driver} />
        </div>
      </div>
      <div style={{ border: '1px solid white' }}>
        <div style={{ border: '1px solid white' }}>
          <DriverTime />
        </div>
        <div style={{ border: '1px solid white' }}>
          <DriverSector />
        </div>
      </div>
    </StyledPosition>
  );
}

export default Position;
