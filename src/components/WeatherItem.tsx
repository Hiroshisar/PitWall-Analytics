import type { weatherType } from '../utils/types.ts';
import { RiArrowRightLongFill, RiSunLine } from 'react-icons/ri';
import { BsCloudRainHeavy } from 'react-icons/bs';

function WeatherItem({ data }: { data: weatherType }) {
  const directionDegrees = data.wind_direction;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
      {data.rainfall === 0 ? (
        <RiSunLine style={{ height: '40px', width: '40px' }} />
      ) : (
        <BsCloudRainHeavy style={{ height: '40px', width: '40px' }} />
      )}
      <div>
        <h4>{`Air ${data.air_temperature}°`}</h4>
        <h4>{`Track ${data.track_temperature}°`}</h4>
        <h4 style={{ display: 'flex', justifyContent: 'space-between' }}>
          {`Wind ${data.wind_speed} m/s`}
          <span>
            <RiArrowRightLongFill
              style={{
                transform: `rotate(${directionDegrees}deg)`,
                marginLeft: '1rem',
                marginRight: '1rem',
              }}
            />
            {`${setDirectionString(directionDegrees)}`}
          </span>
        </h4>
      </div>
    </div>
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
