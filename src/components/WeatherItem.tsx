import {
  RiArrowRightLongFill,
  RiSunLine,
  RiMoonLine,
  RiShowersLine,
} from 'react-icons/ri';
import {
  WeatherIcon,
  WeatherIconContainer,
  WeatherItemContainer,
  WeatherWindDirection,
  WeatherWindRow,
} from '../style/styles.ts';
import type { WeatherItemProps } from '../utils/types.ts';
import { formatHours } from '../utils/helpers.ts';

function WeatherItem({ data }: WeatherItemProps) {
  const directionDegrees = data.wind_direction;
  const now = new Date(data.date);
  const hour = now.getHours();

  return (
    <WeatherItemContainer>
      <WeatherIconContainer>
        <WeatherIcon>
          {data.rainfall === 1 ? (
            <div style={{ color: 'grey' }}>
              <RiShowersLine />
            </div>
          ) : hour > 6 && hour < 19 ? (
            <div style={{ color: 'yellow' }}>
              <RiSunLine />
            </div>
          ) : (
            <div style={{ color: 'aquamarine' }}>
              <RiMoonLine />
            </div>
          )}
        </WeatherIcon>
        <p>{formatHours(data.date)}</p>
      </WeatherIconContainer>
      <div>
        <h4>{`Air ${data.air_temperature}°`}</h4>
        <h4>{`Track ${data.track_temperature}°`}</h4>
        <WeatherWindRow>
          {`Wind ${data.wind_speed} m/s`}
          {data.wind_speed > 0 ? (
            <WeatherWindDirection $degrees={directionDegrees}>
              <RiArrowRightLongFill />
              <h4>{`${setDirectionString(directionDegrees)}`}</h4>
            </WeatherWindDirection>
          ) : null}
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
