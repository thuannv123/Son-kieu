const OWM_BASE = "https://api.openweathermap.org/data/2.5";

// Weather condition groups from OpenWeatherMap that make lake activities unsafe
const UNSAFE_CONDITION_IDS = new Set([
  200, 201, 202, 210, 211, 212, 221, 230, 231, 232, // Thunderstorm
  300, 301, 302, 310, 311, 312, 313, 314, 321,       // Drizzle
  500, 501, 502, 503, 504, 511, 520, 521, 522, 531,  // Rain
  600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622, // Snow
  781,                                               // Tornado
]);

export interface WeatherStatus {
  conditionId: number;
  main: string;       // e.g. "Rain", "Clear"
  description: string;
  temperature: number;
  isSafe: boolean;    // false → hide lake booking button
}

export async function getWeatherStatus(
  lat: number,
  lon: number
): Promise<WeatherStatus> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) throw new Error("OPENWEATHERMAP_API_KEY is not set");

  const url = `${OWM_BASE}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=vi`;
  const res = await fetch(url, { next: { revalidate: 600 } }); // cache 10 min

  if (!res.ok) {
    throw new Error(`OpenWeatherMap error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const weather = data.weather[0];
  const conditionId: number = weather.id;

  return {
    conditionId,
    main: weather.main,
    description: weather.description,
    temperature: data.main.temp,
    isSafe: !UNSAFE_CONDITION_IDS.has(conditionId),
  };
}

export async function getForecast(
  lat: number,
  lon: number
): Promise<{ date: string; main: string; description: string; isSafe: boolean; temp: number }[]> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) throw new Error("OPENWEATHERMAP_API_KEY is not set");

  const url = `${OWM_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=vi&cnt=56`;
  const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hr

  if (!res.ok) {
    throw new Error(`OpenWeatherMap error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  // Deduplicate to one entry per calendar day (noon reading preferred)
  const byDay = new Map<string, (typeof data.list)[0]>();
  for (const entry of data.list) {
    const date = entry.dt_txt.slice(0, 10);
    const hour = parseInt(entry.dt_txt.slice(11, 13), 10);
    if (!byDay.has(date) || Math.abs(hour - 12) < Math.abs(parseInt(byDay.get(date)!.dt_txt.slice(11, 13), 10) - 12)) {
      byDay.set(date, entry);
    }
  }

  return Array.from(byDay.values())
    .slice(0, 7)
    .map((entry) => ({
      date: entry.dt_txt.slice(0, 10),
      main: entry.weather[0].main,
      description: entry.weather[0].description,
      isSafe: !UNSAFE_CONDITION_IDS.has(entry.weather[0].id),
      temp: entry.main.temp,
    }));
}
