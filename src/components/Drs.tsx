import styled from 'styled-components';
import { useFetchCar } from '../hooks/useFetchCar';
import type { driverType } from '../utils/types';

const StyledDrs = styled.div<{ $isActive: boolean; $isDetected: boolean }>`
  border: 1px solid
    var(
      ${(props) =>
        props.$isActive || props.$isDetected
          ? '--color-green-700'
          : '--color-grey-400'}
    );
  border-radius: var(--border-radius-3xl);
  background-color: var(
    ${(props) => (props.$isActive ? '--color-green-700' : 'trasparent')}
  );

  color: var(
    ${(props) =>
      props.$isActive
        ? '--color-grey-900'
        : props.$isDetected
          ? '--color-green-700'
          : '--color-grey-200'}
  );
`;

function Drs({
  sessionKey,
  driver,
}: {
  sessionKey: number;
  driver: driverType;
}) {
  const { data: carData } = useFetchCar(driver.driver_number, sessionKey);

  if (!carData) return;

  const car = carData.find((c) => c.driver_number === driver.driver_number);

  if (!car) return;

  let isActive: boolean = false;
  let isDetected: boolean = false;

  switch (car.drs) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 9:
      isActive = false;
      break;
    case 10:
    case 12:
    case 14:
      isActive = true;
      break;
    case 8:
      isDetected = false;
      break;
    default:
      isActive = false;
      break;
  }

  return (
    <>
      <StyledDrs $isActive={isActive} $isDetected={isDetected}>
        DRS
      </StyledDrs>
    </>
  );
}

export default Drs;
