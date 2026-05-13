import type { DriverStandingCardProps } from '../utils/types.ts';
import {
  DriverNumber,
  StyledCardRow,
  StyledDriverCard,
} from '../style/styles.ts';

const getPublicImageSrc = (fileName: string) =>
  `${import.meta.env.BASE_URL}${fileName}`;

const getDriverImageSrc = (driverNumber?: number) =>
  getPublicImageSrc(driverNumber ? `${driverNumber}.png` : 'unknown.png');

function DriverStandingCard({ driver }: DriverStandingCardProps) {
  const imageSrc = getDriverImageSrc(driver.driver_number);

  return (
    <StyledDriverCard $url={`drivers${imageSrc}`}>
      <DriverNumber>
        <h2>{driver.driver_number}</h2>
      </DriverNumber>
      <StyledCardRow>
        <h3>{driver.full_name}</h3>
        <h4>{driver.team_name}</h4>
      </StyledCardRow>
    </StyledDriverCard>
  );
}

export default DriverStandingCard;
