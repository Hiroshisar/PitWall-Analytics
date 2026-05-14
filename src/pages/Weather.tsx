import { useFetchWeather } from '../hooks/useFetchWeather.ts';
import WeatherItem from '../components/WeatherItem.tsx';
import { useEffect, useMemo, useState } from 'react';
import type { WeatherType } from '../utils/types.ts';
import { checkIfIsLiveSession } from '../utils/helpers.ts';
import { useFetchSession } from '../hooks/useFetchSession.ts';
import {
  StyledTitle,
  StyledToolContainer,
  StyledWeatherContainerRow,
} from '../style/styles.ts';
import Spinner from '../ui/Spinner.tsx';

const weatherSampleIntervalMs = 5 * 60 * 1000;

type WeatherInfoType = {
  minAir: number;
  maxAir: number;
  minTrack: number;
  maxTrack: number;
};

function canAppendWeatherSample(
  sample: WeatherType,
  currentData: WeatherType[]
) {
  if (currentData.length === 0) return true;

  const lastShownSample = currentData[currentData.length - 1];

  return (
    new Date(sample.date).getTime() >=
    new Date(lastShownSample.date).getTime() + weatherSampleIntervalMs
  );
}

function Weather() {
  const [dataToShow, setDataToShow] = useState<WeatherType[]>([]);
  const { data: weatherData, isLoading: isLoadingWeather } = useFetchWeather();
  const { data: session, isLoading: isLoadingSession } = useFetchSession();

  const weatherInfo = useMemo<WeatherInfoType | null>(() => {
    if (!weatherData || weatherData.length === 0) return null;

    const firstSample = weatherData[0];

    return weatherData.reduce<WeatherInfoType>(
      (info, item) => ({
        minAir: Math.min(info.minAir, item.air_temperature),
        maxAir: Math.max(info.maxAir, item.air_temperature),
        minTrack: Math.min(info.minTrack, item.track_temperature),
        maxTrack: Math.max(info.maxTrack, item.track_temperature),
      }),
      {
        minAir: firstSample.air_temperature,
        maxAir: firstSample.air_temperature,
        minTrack: firstSample.track_temperature,
        maxTrack: firstSample.track_temperature,
      }
    );
  }, [weatherData]);

  const isLive = checkIfIsLiveSession(
    session?.date_start ?? '',
    session?.date_end ?? ''
  );

  useEffect(() => {
    if (
      isLoadingSession ||
      !session ||
      !weatherData ||
      weatherData.length === 0
    )
      return;

    const sortedWeatherData = [...weatherData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const updateWeatherData = window.setTimeout(() => {
      setDataToShow((currentData) => {
        if (isLive) {
          const latestWeatherSample =
            sortedWeatherData[sortedWeatherData.length - 1];

          if (!canAppendWeatherSample(latestWeatherSample, currentData)) {
            return currentData;
          }

          return [...currentData, latestWeatherSample];
        }

        return sortedWeatherData.reduce<WeatherType[]>((nextData, item) => {
          if (!canAppendWeatherSample(item, nextData)) return nextData;

          return [...nextData, item];
        }, []);
      });
    }, 0);

    return () => window.clearTimeout(updateWeatherData);
  }, [weatherData, isLive, isLoadingSession, session]);

  return (
    <StyledToolContainer>
      {(isLoadingSession || isLoadingWeather) && <Spinner />}
      <StyledWeatherContainerRow $variant="header">
        <StyledTitle>WEATHER</StyledTitle>
      </StyledWeatherContainerRow>
      {weatherInfo && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            width: '100%',
          }}
        >
          <div>
            <h3>Air</h3>
            <h4>{`Min ${weatherInfo.minAir}°`}</h4>
            <h4>{`Max ${weatherInfo.maxAir}°`}</h4>
          </div>
          <div>
            <h3>Track</h3>
            <h4>{`Min ${weatherInfo.minTrack}°`}</h4>
            <h4>{`Max ${weatherInfo.maxTrack}°`}</h4>
          </div>
        </div>
      )}
      <StyledWeatherContainerRow $variant="list">
        {dataToShow.map((item) => (
          <WeatherItem key={item.date} data={item} />
        ))}
      </StyledWeatherContainerRow>
    </StyledToolContainer>
  );
}

export default Weather;
