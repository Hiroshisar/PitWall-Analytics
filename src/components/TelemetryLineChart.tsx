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
  DriverSeries,
  driverType,
  SelectedLapCarSample,
  TelemetryMetric,
} from '../utils/types';
import { formatLapTime, normalizeHexColor } from '../utils/helpers';
import {
  ChartTooltip,
  ChartTooltipTitle,
  ChartTooltipValue,
} from '../style/styles.ts';

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
  normalizeValue?: (value: number) => number;
  formatValue: (value: number) => string;
};

const capPercentageValue = (value: number) => Math.min(value, 100);

const formatPercentageValue = (value: number) =>
  `${Math.round(capPercentageValue(value))}%`;

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
    normalizeValue: capPercentageValue,
    formatValue: formatPercentageValue,
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
    normalizeValue: capPercentageValue,
    formatValue: formatPercentageValue,
  },
};

export type ChartProps = {
  carsData: SelectedLapCarSample[];
  selectedDrivers: driverType[];
  metric?: TelemetryMetric;
};

function getTelemetryValueAtTime(
  points: DriverSeries['points'],
  targetTimeSec: number,
  interpolate: boolean
): number | null {
  if (points.length === 0 || !Number.isFinite(targetTimeSec)) return null;

  if (targetTimeSec <= points[0].lapTimeSec) return points[0].value;

  const lastPoint = points[points.length - 1];
  if (targetTimeSec >= lastPoint.lapTimeSec) return lastPoint.value;

  let left = 0;
  let right = points.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    const middlePoint = points[middle];

    if (middlePoint.lapTimeSec === targetTimeSec) return middlePoint.value;

    if (middlePoint.lapTimeSec < targetTimeSec) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  const prevPoint = points[Math.max(0, right)];
  const nextPoint = points[Math.min(points.length - 1, left)];

  if (!interpolate) return prevPoint.value;

  const deltaTime = nextPoint.lapTimeSec - prevPoint.lapTimeSec;
  if (deltaTime <= 0) return nextPoint.value;

  const progress = (targetTimeSec - prevPoint.lapTimeSec) / deltaTime;
  return prevPoint.value + (nextPoint.value - prevPoint.value) * progress;
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
    <ChartTooltip>
      <ChartTooltipTitle>
        Lap time: {formatLapTime(lapTimeSec)}
      </ChartTooltipTitle>
      {telemetryData.map((driverSeries) => {
        const value = getTelemetryValueAtTime(
          driverSeries.points,
          lapTimeSec,
          metricConfig.interpolate
        );

        return (
          <ChartTooltipValue
            key={driverSeries.driver.driver_number}
            $color={driverSeries.color}
          >
            {driverSeries.driver.name_acronym}{' '}
            {value === null ? 'N/D' : metricConfig.formatValue(value)}{' '}
            {driverSeries.lapNumber ? `lap ${driverSeries.lapNumber}` : ''}
          </ChartTooltipValue>
        );
      })}
    </ChartTooltip>
  );
}

function TelemetryLineChart({
  carsData,
  selectedDrivers,
  metric = 'speed',
}: ChartProps) {
  const metricConfig = telemetryMetricConfigs[metric];

  const telemetryData = useMemo<DriverSeries[]>(() => {
    const groupedCars: Record<number, SelectedLapCarSample[]> = {};

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
        const rawValue = sample[metricConfig.field];

        return {
          lapTimeSec: Math.max(0, lapTimeSec),
          value: metricConfig.normalizeValue?.(rawValue) ?? rawValue,
        };
      });

      const teamColor =
        normalizeHexColor(driver.team_colour) ??
        fallbackColors[index % fallbackColors.length];

      return {
        driver,
        color: teamColor,
        points,
        lapNumber: driverCarData[0]?.selectedLapNumber,
      };
    });
  }, [carsData, metricConfig, selectedDrivers]);

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
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
            tickCount={8}
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
                activeDot={true}
                isAnimationActive={true}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default TelemetryLineChart;
