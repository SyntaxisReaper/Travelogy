export interface WeatherData {
  city?: string;
  country?: string;
  description?: string;
  tempC?: number;
}

export interface AirQualityData {
  aqi?: number; // 1-5 (Good..Very Poor) for OWM
  components?: { [k: string]: number };
}

export interface ForecastPoint { dt: number; tempC: number; description?: string }

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

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData | null> {
  if (!OWM_KEY) return null;
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OWM_KEY}`);
    const json = await res.json();
    const item = json?.list?.[0];
    return item ? { aqi: item.main?.aqi, components: item.components } : null;
  } catch (e) {
    return null;
  }
}

export async function fetchForecast(lat: number, lon: number): Promise<ForecastPoint[] | null> {
  try {
    if (OWM_KEY) {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OWM_KEY}&units=metric`);
      const json = await res.json();
      const list = Array.isArray(json?.list) ? json.list : [];
      return list.slice(0, 8).map((p: any) => ({ dt: p.dt, tempC: p.main?.temp, description: p.weather?.[0]?.description }));
    }
  } catch (e) {
    // ignore
  }
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m`);
    const json = await res.json();
    const times: string[] = json?.hourly?.time || [];
    const temps: number[] = json?.hourly?.temperature_2m || [];
    return times.slice(0, 8).map((t, i) => ({ dt: Math.floor(new Date(t).getTime()/1000), tempC: temps[i] }));
  } catch {
    return null;
  }
}
