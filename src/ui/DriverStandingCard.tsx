import styled from 'styled-components';
import type { driverType } from '../utils/types.ts';
import { DriverNumber, StyledDriverRow } from '../style/styles.ts';

const getPublicImageSrc = (fileName: string) =>
  `${import.meta.env.BASE_URL}${fileName}`;

const getDriverImageSrc = (driverNumber?: number) =>
  getPublicImageSrc(driverNumber ? `${driverNumber}.png` : 'unknown.png');

const StyledDriverCard = styled.div<{ $url: string }>`
  position: relative;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-width: 10rem;
  width: 35rem;
  height: 120px;
  overflow: hidden;

  padding-left: 1rem;
  padding-right: 2rem;

  background-color: var(--color-grey-800);
  border-radius: var(--border-radius-3xl);
  color: var(--color-grey-200);

  column-gap: 1rem;

  &::before {
    position: absolute;
    inset: 0;
    content: '';
    background-image: url('${(props) => props.$url}');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.7;
  }

  & > * {
    position: relative;
  }
`;

function DriverStandingCard({ driver }: { driver: driverType }) {
  const imageSrc = getDriverImageSrc(driver.driver_number);

  return (
    <StyledDriverCard $url={imageSrc}>
      <StyledDriverRow>
        <h3>{driver.full_name}</h3>
        <h4>{driver.team_name}</h4>
      </StyledDriverRow>
      <DriverNumber>
        <h2>{driver.driver_number}</h2>
      </DriverNumber>
    </StyledDriverCard>
  );
}

export default DriverStandingCard;
