export interface WeatherData {
  city?: string;
  country?: string;
  description?: string;
  tempC?: number;
}

const OWM_KEY = process.env.REACT_APP_OWM_API_KEY;

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    if (OWM_KEY) {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OWM_KEY}&units=metric`);
      if (!res.ok) throw new Error('owm-failed');
      const data = await res.json();
      return {
        city: data.name,
        country: data.sys?.country,
        description: data.weather?.[0]?.description,
        tempC: data.main?.temp,
      };
    }
  } catch (e) {
    // fallback
  }
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`);
    const data = await res.json();
    const tempC = data?.current?.temperature_2m;
    return { description: 'Current conditions', tempC };
  } catch (e) {
    return null;
  }
}