import { useSelector } from 'react-redux';
import type { RootState } from '../store/store.ts';
import { useFetchWeather } from '../hooks/useFetchWeather.ts';
import WeatherItem from '../components/WeatherItem.tsx';

function Weather() {
  const sessionKey = useSelector(
    (store: RootState) => store.session.selectedSessionKey
  );

  const { data: weatherData } = useFetchWeather(sessionKey ?? 0);

  return (
    <>
      {weatherData && (
        <WeatherItem data={weatherData[weatherData.length - 1]} />
      )}
    </>
  );
}

export default Weather;
