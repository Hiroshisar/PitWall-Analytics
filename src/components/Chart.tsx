import { useMemo } from 'react';
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type {
  carType,
  DriverSeries,
  driverType,
  TelemetryMetric,
} from '../utils/types';
import { formatLapTime, normalizeHexColor } from '../utils/helpers';

const fallbackColors = [
  '#4f46e5',
  '#16a34a',
  '#dc2626',
  '#ea580c',
  '#0284c7',
  '#a21caf',
  '#eab308',
  '#475569',
];

type TelemetryField = 'speed' | 'brake' | 'n_gear' | 'rpm' | 'throttle';
type LineType = 'monotone' | 'stepAfter';
type YAxisDomain = [number | string, number | string];

type TelemetryMetricConfig = {
  field: TelemetryField;
  label: string;
  yAxisLabel: string;
  lineType: LineType;
  interpolate: boolean;
  yAxisDomain?: YAxisDomain;
  formatValue: (value: number) => string;
};

const telemetryMetricConfigs: Record<TelemetryMetric, TelemetryMetricConfig> = {
  speed: {
    field: 'speed',
    label: 'Speed',
    yAxisLabel: 'Speed (km/h)',
    lineType: 'monotone',
    interpolate: true,
    formatValue: (value) => `${Math.round(value)} km/h`,
  },
  brake: {
    field: 'brake',
    label: 'Brake',
    yAxisLabel: 'Brake (%)',
    lineType: 'stepAfter',
    interpolate: false,
    yAxisDomain: [0, 100],
    formatValue: (value) => `${Math.round(value)}%`,
  },
  gear: {
    field: 'n_gear',
    label: 'Gear',
    yAxisLabel: 'Gear',
    lineType: 'stepAfter',
    interpolate: false,
    yAxisDomain: [0, 8],
    formatValue: (value) => `${Math.round(value)}`,
  },
  rpm: {
    field: 'rpm',
    label: 'RPM',
    yAxisLabel: 'RPM',
    lineType: 'monotone',
    interpolate: true,
    formatValue: (value) => `${Math.round(value)} rpm`,
  },
  throttle: {
    field: 'throttle',
    label: 'Throttle',
    yAxisLabel: 'Throttle (%)',
    lineType: 'monotone',
    interpolate: true,
    yAxisDomain: [0, 100],
    formatValue: (value) => `${Math.round(value)}%`,
  },
};

export type ChartProps = {
  carsData: carType[];
  selectedDrivers: driverType[];
  metric?: TelemetryMetric;
};

function getTelemetryValueAtTime(
  points: DriverSeries['points'],
  targetTimeSec: number,
  interpolate: boolean
): number | null {
  if (points.length === 0 || !Number.isFinite(targetTimeSec)) return null;

  if (targetTimeSec <= points[0].lapTimeSec) {
    return points[0].value;
  }

  const lastPoint = points[points.length - 1];
  if (targetTimeSec >= lastPoint.lapTimeSec) {
    return lastPoint.value;
  }

  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const nextPoint = points[i];

    if (targetTimeSec > nextPoint.lapTimeSec) continue;

    const deltaTime = nextPoint.lapTimeSec - prevPoint.lapTimeSec;
    if (!interpolate) {
      return targetTimeSec >= nextPoint.lapTimeSec
        ? nextPoint.value
        : prevPoint.value;
    }

    if (deltaTime <= 0) return nextPoint.value;

    const progress = (targetTimeSec - prevPoint.lapTimeSec) / deltaTime;
    return prevPoint.value + (nextPoint.value - prevPoint.value) * progress;
  }

  return null;
}

function CustomTelemetryTooltip({
  active,
  label,
  telemetryData,
  metricConfig,
}: {
  active?: boolean;
  label?: number | string;
  telemetryData: DriverSeries[];
  metricConfig: TelemetryMetricConfig;
}) {
  if (!active) return null;

  const lapTimeSec = Number(label);
  if (!Number.isFinite(lapTimeSec)) return null;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '8px 10px',
      }}
    >
      <div style={{ marginBottom: '6px', fontWeight: 600 }}>
        Lap time: {formatLapTime(lapTimeSec)}
      </div>
      {telemetryData.map((driverSeries) => {
        const value = getTelemetryValueAtTime(
          driverSeries.points,
          lapTimeSec,
          metricConfig.interpolate
        );

        return (
          <div
            key={driverSeries.driver.driver_number}
            style={{ color: driverSeries.color, lineHeight: 1.4 }}
          >
            {driverSeries.driver.name_acronym}{' '}
            {value === null ? 'N/D' : metricConfig.formatValue(value)}
          </div>
        );
      })}
    </div>
  );
}

function Chart({ carsData, selectedDrivers, metric = 'speed' }: ChartProps) {
  const metricConfig = telemetryMetricConfigs[metric];

  const telemetryData = useMemo<DriverSeries[]>(() => {
    const groupedCars: Record<number, carType[]> = {};

    for (const carSample of carsData) {
      if (!groupedCars[carSample.driver_number]) {
        groupedCars[carSample.driver_number] = [];
      }
      groupedCars[carSample.driver_number].push(carSample);
    }

    return selectedDrivers.map((driver, index) => {
      const driverCarData = [...(groupedCars[driver.driver_number] ?? [])].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const firstSampleTime = new Date(driverCarData[0]?.date ?? '').getTime();

      const points = driverCarData.map((sample) => {
        const sampleTime = new Date(sample.date).getTime();
        const lapTimeSec = Number.isFinite(firstSampleTime)
          ? (sampleTime - firstSampleTime) / 1000
          : 0;

        return {
          lapTimeSec: Math.max(0, lapTimeSec),
          value: sample[metricConfig.field],
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
  }, [carsData, metricConfig.field, selectedDrivers]);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="lapTimeSec"
          domain={['dataMin', 'dataMax']}
          tickFormatter={formatLapTime}
          tickCount={8}
        >
          <Label
            value="Lap Time (mm:ss.mmm)"
            position="insideBottom"
            offset={-6}
            fontSize={12}
          />
        </XAxis>
        <YAxis
          type="number"
          dataKey="value"
          domain={metricConfig.yAxisDomain}
          width={metric === 'rpm' ? 84 : 72}
          allowDecimals={false}
        >
          <Label
            value={metricConfig.yAxisLabel}
            angle={-90}
            position="insideLeft"
            fontSize={12}
          />
        </YAxis>
        <Tooltip
          content={(props) => (
            <CustomTelemetryTooltip
              active={props.active}
              label={props.label}
              telemetryData={telemetryData}
              metricConfig={metricConfig}
            />
          )}
        />
        {telemetryData.map((driverSeries) => {
          if (driverSeries.points.length === 0) return null;

          return (
            <Line
              key={driverSeries.driver.driver_number}
              type={metricConfig.lineType}
              data={driverSeries.points}
              dataKey="value"
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
