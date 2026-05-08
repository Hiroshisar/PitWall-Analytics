import { BsCloudRainHeavy } from 'react-icons/bs';
import { RiArrowRightLongFill, RiSunLine } from 'react-icons/ri';
import {
  WeatherIcon,
  WeatherItemContainer,
  WeatherWindDirection,
  WeatherWindRow,
} from '../style/styles.ts';
import type { WeatherItemProps } from '../utils/types.ts';

function WeatherItem({ data }: WeatherItemProps) {
  const directionDegrees = data.wind_direction;

  return (
    <WeatherItemContainer>
      <WeatherIcon>
        {data.rainfall === 0 ? <RiSunLine /> : <BsCloudRainHeavy />}
      </WeatherIcon>
      <div>
        <h4>{`Air ${data.air_temperature}°`}</h4>
        <h4>{`Track ${data.track_temperature}°`}</h4>
        <WeatherWindRow>
          {`Wind ${data.wind_speed} m/s`}
          <WeatherWindDirection $degrees={directionDegrees}>
            <RiArrowRightLongFill />
            {`${setDirectionString(directionDegrees)}`}
          </WeatherWindDirection>
        </WeatherWindRow>
      </div>
    </WeatherItemContainer>
  );
}

export default WeatherItem;

function setDirectionString(directionDegrees: number): string {
  switch (true) {
    case directionDegrees === 0:
      return 'E';
    case directionDegrees >= 1 && directionDegrees <= 44:
      return 'ESE';
    case directionDegrees === 45:
      return 'SE';
    case directionDegrees >= 46 && directionDegrees <= 89:
      return 'SSE';
    case directionDegrees === 90:
      return 'S';
    case directionDegrees >= 91 && directionDegrees <= 134:
      return 'SSO';
    case directionDegrees === 135:
      return 'SO';
    case directionDegrees >= 136 && directionDegrees <= 189:
      return 'OSO';
    case directionDegrees === 190:
      return 'O';
    case directionDegrees >= 191 && directionDegrees <= 234:
      return 'ONO';
    case directionDegrees === 235:
      return 'NO';
    case directionDegrees >= 236 && directionDegrees <= 269:
      return 'NNO';
    case directionDegrees === 270:
      return 'N';
    case directionDegrees >= 271 && directionDegrees <= 314:
      return 'NNE';
    case directionDegrees === 315:
      return 'NE';
    case directionDegrees >= 316 && directionDegrees <= 359:
      return 'ENE';
    default:
      return '';
  }
}
