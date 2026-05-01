import BookingButton from "@/components/caves/BookingButton";
import { getWeatherStatus } from "@/lib/weather";

// Resort coordinates — replace with actual lat/lon
const RESORT_LAT = 17.5288;
const RESORT_LON = 106.6036;

const WEATHER_ICON: Record<string, string> = {
  Thunderstorm: "⛈️",
  Drizzle:      "🌦️",
  Rain:         "🌧️",
  Snow:         "❄️",
  Clear:        "☀️",
  Clouds:       "⛅",
};

interface LakeBookingButtonProps {
  activityId: string;
}

// Server component — fetches weather at render time (cached 10 min via fetch)
export default async function LakeBookingButton({
  activityId,
}: LakeBookingButtonProps) {
  let weather;
  try {
    weather = await getWeatherStatus(RESORT_LAT, RESORT_LON);
  } catch {
    // If weather API is unavailable, allow booking but show a notice
    return (
      <div className="flex flex-col gap-1">
        <BookingButton activityId={activityId} label="Đặt vé tắm hồ" />
        <p className="text-xs text-gray-400">
          Không thể tải thông tin thời tiết
        </p>
      </div>
    );
  }

  const icon = WEATHER_ICON[weather.main] ?? "🌡️";

  if (!weather.isSafe) {
    return (
      <div className="space-y-2">
        {/* Disabled booking button */}
        <BookingButton
          activityId={activityId}
          label="Đặt vé tắm hồ"
          disabled
          disabledReason={`Tạm đóng – thời tiết không an toàn (${icon} ${weather.description})`}
        />

        {/* Alert banner */}
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <span className="text-lg leading-none">{icon}</span>
          <div>
            <p className="font-semibold">Cảnh báo thời tiết</p>
            <p>
              Hiện tại:{" "}
              <span className="capitalize">{weather.description}</span>,{" "}
              {weather.temperature.toFixed(1)}°C. Hoạt động tắm hồ tạm ngừng
              để đảm bảo an toàn cho du khách.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <BookingButton activityId={activityId} label="Đặt vé tắm hồ" />
      <p className="text-xs text-gray-500">
        {icon} Thời tiết hiện tại:{" "}
        <span className="capitalize">{weather.description}</span>,{" "}
        {weather.temperature.toFixed(1)}°C – An toàn
      </p>
    </div>
  );
}
