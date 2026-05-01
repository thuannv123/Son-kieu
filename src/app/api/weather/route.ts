import { NextResponse } from "next/server";

const UNSAFE_IDS = new Set([
  200,201,202,210,211,212,221,230,231,232,
  300,301,302,310,311,312,313,314,321,
  500,501,502,503,504,511,520,521,522,531,
  600,601,602,611,612,613,615,616,620,621,622,
  781,
]);

export async function GET() {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const lat    = process.env.NEXT_PUBLIC_RESORT_LAT ?? "17.5288";
  const lon    = process.env.NEXT_PUBLIC_RESORT_LON ?? "106.6036";

  if (!apiKey || apiKey === "your_key_here") {
    // Return mock data when API key is not configured
    return NextResponse.json({
      conditionId: 800,
      main:        "Clear",
      description: "Quang đãng",
      temperature: 27.4,
      isSafe:      true,
      source:      "mock",
    });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=vi`;
    const res = await fetch(url, { next: { revalidate: 600 } });

    if (!res.ok) throw new Error(`OWM error: ${res.status}`);

    const owm     = await res.json();
    const weather = owm.weather[0];
    const id      = weather.id as number;

    return NextResponse.json({
      conditionId: id,
      main:        weather.main,
      description: weather.description,
      temperature: owm.main.temp,
      isSafe:      !UNSAFE_IDS.has(id),
      source:      "live",
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
