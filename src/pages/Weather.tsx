import { useFetchWeather } from '../hooks/useFetchWeather.ts';
import WeatherItem from '../components/WeatherItem.tsx';

function Weather() {
  const { data: weatherData } = useFetchWeather();

  return (
    <>
      {weatherData && (
        <WeatherItem data={weatherData[weatherData.length - 1]} />
      )}
    </>
  );
}

export default Weather;
