import { useMemo } from "react";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { carType, DriverSeries, driverType } from "../utils/types";
import { formatLapTime, normalizeHexColor } from "../utils/helpers";

const fallbackColors = [
  "#4f46e5",
  "#16a34a",
  "#dc2626",
  "#ea580c",
  "#0284c7",
  "#a21caf",
  "#eab308",
  "#475569",
];

function getSpeedAtTime(
  points: DriverSeries["points"],
  targetTimeSec: number,
): number | null {
  if (points.length === 0 || !Number.isFinite(targetTimeSec)) return null;

  if (targetTimeSec <= points[0].lapTimeSec) {
    return points[0].speed;
  }

  const lastPoint = points[points.length - 1];
  if (targetTimeSec >= lastPoint.lapTimeSec) {
    return lastPoint.speed;
  }

  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const nextPoint = points[i];

    if (targetTimeSec > nextPoint.lapTimeSec) continue;

    const deltaTime = nextPoint.lapTimeSec - prevPoint.lapTimeSec;
    if (deltaTime <= 0) return nextPoint.speed;

    const progress = (targetTimeSec - prevPoint.lapTimeSec) / deltaTime;
    return prevPoint.speed + (nextPoint.speed - prevPoint.speed) * progress;
  }

  return null;
}

function CustomSpeedTooltip({
  active,
  label,
  speedTelemetryData,
}: {
  active?: boolean;
  label?: number | string;
  speedTelemetryData: DriverSeries[];
}) {
  if (!active) return null;

  const lapTimeSec = Number(label);
  if (!Number.isFinite(lapTimeSec)) return null;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        padding: "8px 10px",
      }}
    >
      <div style={{ marginBottom: "6px", fontWeight: 600 }}>
        Lap time: {formatLapTime(lapTimeSec)}
      </div>
      {speedTelemetryData.map((driverSeries) => {
        const speed = getSpeedAtTime(driverSeries.points, lapTimeSec);

        return (
          <div
            key={driverSeries.driver.driver_number}
            style={{ color: driverSeries.color, lineHeight: 1.4 }}
          >
            {driverSeries.driver.name_acronym}{" "}
            {speed === null ? "N/D" : `${Math.round(speed)} km/h`}
          </div>
        );
      })}
    </div>
  );
}

function Chart({
  carsData,
  selectedDrivers,
}: {
  carsData: carType[];
  selectedDrivers: driverType[];
}) {
  const speedTelemetryData = useMemo<DriverSeries[]>(() => {
    const groupedCars: Record<number, carType[]> = {};

    for (const carSample of carsData) {
      if (!groupedCars[carSample.driver_number]) {
        groupedCars[carSample.driver_number] = [];
      }
      groupedCars[carSample.driver_number].push(carSample);
    }

    return selectedDrivers.map((driver, index) => {
      const driverCarData = [...(groupedCars[driver.driver_number] ?? [])].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      const firstSampleTime = new Date(driverCarData[0]?.date ?? "").getTime();

      const points = driverCarData.map((sample) => {
        const sampleTime = new Date(sample.date).getTime();
        const lapTimeSec = Number.isFinite(firstSampleTime)
          ? (sampleTime - firstSampleTime) / 1000
          : 0;

        return {
          lapTimeSec: Math.max(0, lapTimeSec),
          speed: sample.speed,
        };
      });

      const teamColor =
        normalizeHexColor(driver.team_colour) ??
        fallbackColors[index % fallbackColors.length];

      return {
        driver,
        color: teamColor,
        points,
      };
    });
  }, [carsData, selectedDrivers]);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="lapTimeSec"
          domain={["dataMin", "dataMax"]}
          tickFormatter={formatLapTime}
        >
          <Label
            value="Lap Time (mm:ss.mmm)"
            position="insideBottom"
            offset={-6}
            fontSize={12}
          />
        </XAxis>
        <YAxis type="number" dataKey="speed" width={72}>
          <Label
            value="Speed (km/h)"
            angle={-90}
            position="insideLeft"
            fontSize={12}
          />
        </YAxis>
        <Tooltip
          content={(props) => (
            <CustomSpeedTooltip
              active={props.active}
              label={props.label}
              speedTelemetryData={speedTelemetryData}
            />
          )}
        />
        {speedTelemetryData.map((driverSeries) => {
          if (driverSeries.points.length === 0) return null;

          return (
            <Line
              key={driverSeries.driver.driver_number}
              type="monotone"
              data={driverSeries.points}
              dataKey="speed"
              name={`${driverSeries.driver.name_acronym} #${driverSeries.driver.driver_number}`}
              stroke={driverSeries.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default Chart;
