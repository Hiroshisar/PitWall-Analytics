import { useFetchWeather } from '../hooks/useFetchWeather.ts';
import WeatherItem from '../components/WeatherItem.tsx';
import { useEffect, useState } from 'react';
import type { weatherType } from '../utils/types.ts';
import { checkIfIsLiveSession } from '../utils/helpers.ts';
import { useFetchSession } from '../hooks/useFetchSession.ts';
import {
  StyledTitle,
  StyledToolContainer,
  StyledWeatherContainerRow,
} from '../style/styles.ts';
import Spinner from '../ui/Spinner.tsx';

const weatherSampleIntervalMs = 5 * 60 * 1000;

function canAppendWeatherSample(
  sample: weatherType,
  currentData: weatherType[]
) {
  if (currentData.length === 0) return true;

  const lastShownSample = currentData[currentData.length - 1];

  return (
    new Date(sample.date).getTime() >=
    new Date(lastShownSample.date).getTime() + weatherSampleIntervalMs
  );
}

function Weather() {
  const [dataToShow, setDataToShow] = useState<weatherType[]>([]);
  const { data: weatherData, isLoading: isLoadingWeather } = useFetchWeather();
  const { data: session, isLoading: isLoadingSession } = useFetchSession();

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

        return sortedWeatherData.reduce<weatherType[]>((nextData, item) => {
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
      <StyledWeatherContainerRow $variant="list">
        {dataToShow.map((item) => (
          <WeatherItem key={item.date} data={item} />
        ))}
      </StyledWeatherContainerRow>
    </StyledToolContainer>
  );
}

export default Weather;
