import { useMemo, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useFetchStints } from '../hooks/useFetchStints.ts';
import { useFetchDrivers } from '../hooks/useFetchDriver.ts';
import Spinner from '../ui/Spinner.tsx';
import {
  Bar,
  BarChart,
  type BarShapeProps,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartTooltip,
  ChartTooltipTitle,
  ChartTooltipValue,
  StyledTitle,
  StyledToolContainer,
  StyledTyreStrategyChartArea,
  StyledTyreStrategyLegend,
  StyledTyreStrategyLegendItem,
  StyledTyreStrategyLegendSwatch,
  StyledTyreStrategyPanel,
} from '../style/styles.ts';
import { useFetchPit } from '../hooks/useFetchPit.ts';
import type { pitType } from '../utils/types.ts';

type TyreStrategyChartItem = {
  id: string;
  driverLabel: string;
  driverName: string;
  driverNumber: number;
  stints: TyreStrategyStintSegment[];
  totalLaps: number;
};

type TyreStrategyStintSegment = {
  id: string;
  driverNumber: number;
  stintNumber: number;
  compound: string;
  tyreAgeAtStart: number;
  lapStart: number;
  lapEnd: number;
  lapCount: number;
};

type TyreStrategyTooltipState =
  | {
      type: 'stint';
      x: number;
      y: number;
      driverName: string;
      stint: TyreStrategyStintSegment;
    }
  | {
      type: 'stint-change';
      x: number;
      y: number;
      driverName: string;
      previousStint: TyreStrategyStintSegment;
      nextStint: TyreStrategyStintSegment;
      pit: pitType;
    };

type TyreStrategyBarShapeProps = BarShapeProps & {
  onStintHover: (
    event: ReactMouseEvent<SVGRectElement>,
    item: TyreStrategyChartItem,
    stint: TyreStrategyStintSegment
  ) => void;
  onStintChangeHover: (
    event: ReactMouseEvent<SVGRectElement>,
    item: TyreStrategyChartItem,
    previousStint: TyreStrategyStintSegment,
    nextStint: TyreStrategyStintSegment
  ) => void;
  onStintLeave: () => void;
};

const compoundColors: Record<string, string> = {
  SOFT: '#d91616',
  MEDIUM: '#f6d009',
  HARD: '#ffffff',
  INTERMEDIATE: '#18a84d',
  WET: '#314ed2',
};

const compoundOrder = Object.keys(compoundColors);
const fallbackCompoundColor = '#9ca3af';

function getCompoundColor(compound: string) {
  return compoundColors[compound] ?? fallbackCompoundColor;
}

function getCompoundTextColor(compound: string) {
  return compound === 'HARD' ? '#374151' : getCompoundColor(compound);
}

function TyreStrategyTooltip({
  tooltip,
}: {
  tooltip: TyreStrategyTooltipState;
}) {
  if (tooltip.type === 'stint-change') {
    const { driverName, previousStint, nextStint, pit } = tooltip;

    return (
      <ChartTooltip>
        <ChartTooltipTitle>{driverName}</ChartTooltipTitle>
        <ChartTooltipValue $color={getCompoundTextColor(nextStint.compound)}>
          {`Change after lap ${previousStint.lapEnd}: ${previousStint.compound} -> ${nextStint.compound}`}
        </ChartTooltipValue>
        <ChartTooltipValue $color="var(--color-grey-500)">
          {`Lane duration ${pit.lane_duration ? `${pit.lane_duration} s` : 'N/D'} - pit duration ${pit.stop_duration ? `${pit.stop_duration} s` : 'N/D'}`}
        </ChartTooltipValue>
      </ChartTooltip>
    );
  }

  const { driverName, stint } = tooltip;

  return (
    <ChartTooltip>
      <ChartTooltipTitle>{driverName}</ChartTooltipTitle>
      <ChartTooltipValue $color={getCompoundTextColor(stint.compound)}>
        {`${stint.compound}: laps ${stint.lapStart}-${stint.lapEnd} (${stint.lapCount})`}
      </ChartTooltipValue>
      <ChartTooltipValue $color="var(--color-grey-500)">
        Stint #{stint.stintNumber} - tyre age {stint.tyreAgeAtStart}
      </ChartTooltipValue>
    </ChartTooltip>
  );
}

function TyreStrategyBarShape({
  x,
  y,
  width,
  height,
  payload,
  onStintHover,
  onStintChangeHover,
  onStintLeave,
}: TyreStrategyBarShapeProps) {
  const item = payload as TyreStrategyChartItem | undefined;
  if (!item || item.totalLaps <= 0 || width <= 0 || height <= 0) return null;

  return (
    <g onMouseLeave={onStintLeave}>
      {item.stints.map((stint, index) => {
        const previousLapCount = item.stints
          .slice(0, index)
          .reduce((sum, segment) => sum + segment.lapCount, 0);
        const segmentX = x + (width * previousLapCount) / item.totalLaps;
        const segmentWidth = Math.max(
          0,
          (width * stint.lapCount) / item.totalLaps
        );

        return (
          <rect
            key={stint.id}
            x={segmentX}
            y={y}
            width={segmentWidth}
            height={height}
            fill={getCompoundColor(stint.compound)}
            stroke="#111827"
            strokeWidth={1}
            onMouseEnter={(event) => onStintHover(event, item, stint)}
            onMouseMove={(event) => onStintHover(event, item, stint)}
          />
        );
      })}
      {item.stints.slice(0, -1).map((stint, index) => {
        const nextStint = item.stints[index + 1];
        const completedLapCount = item.stints
          .slice(0, index + 1)
          .reduce((sum, segment) => sum + segment.lapCount, 0);
        const separatorX = x + (width * completedLapCount) / item.totalLaps;

        return (
          <g key={`${stint.id}-separator`}>
            <line
              x1={separatorX}
              x2={separatorX}
              y1={y - 2}
              y2={y + height + 2}
              stroke="var(--color-grey-200)"
              strokeWidth={2}
            />
            <rect
              x={separatorX - 6}
              y={y - 5}
              width={12}
              height={height + 10}
              fill="transparent"
              cursor="help"
              onMouseEnter={(event) =>
                onStintChangeHover(event, item, stint, nextStint)
              }
              onMouseMove={(event) =>
                onStintChangeHover(event, item, stint, nextStint)
              }
            />
          </g>
        );
      })}
    </g>
  );
}

export function TyreStrategy() {
  const { data: stints = [], isLoading: isLoadingStints } = useFetchStints();
  const { data: drivers = [], isLoading: isLoadingDrivers } = useFetchDrivers();
  const { data: pits = [], isLoading: isLoadingPits } = useFetchPit();
  const [tooltip, setTooltip] = useState<TyreStrategyTooltipState | null>(null);

  const chartData = useMemo<TyreStrategyChartItem[]>(() => {
    const driversByNumber = new Map(
      drivers.map((driver) => [driver.driver_number, driver])
    );
    const stintsByDriver = new Map<number, typeof stints>();

    for (const stint of stints) {
      if (
        !Number.isFinite(stint.lap_start) ||
        !Number.isFinite(stint.lap_end) ||
        stint.lap_end < stint.lap_start
      ) {
        continue;
      }

      const driverStints = stintsByDriver.get(stint.driver_number) ?? [];
      driverStints.push(stint);
      stintsByDriver.set(stint.driver_number, driverStints);
    }

    return Array.from(stintsByDriver.entries())
      .sort(([driverNumberA], [driverNumberB]) => driverNumberA - driverNumberB)
      .map(([driverNumber, driverStints]) => {
        const driver = driversByNumber.get(driverNumber);
        const driverName = driver?.full_name ?? `Driver #${driverNumber}`;
        const driverLabel = `${driver?.name_acronym ?? 'DRV'} #${driverNumber}`;
        const sortedStints = [...driverStints].sort(
          (a, b) => a.stint_number - b.stint_number || a.lap_start - b.lap_start
        );
        const stintsSegments = sortedStints.map((stint) => {
          const lapStart = stint.lap_start;
          const lapEnd = stint.lap_end;

          return {
            id: `${driverNumber}-${stint.stint_number}-${lapStart}-${lapEnd}`,
            driverNumber,
            stintNumber: stint.stint_number,
            compound: stint.compound,
            tyreAgeAtStart: stint.tyre_age_at_start,
            lapStart,
            lapEnd,
            lapCount: lapEnd - lapStart + 1,
          };
        });
        const chartItem: TyreStrategyChartItem = {
          id: String(driverNumber),
          driverLabel,
          driverName,
          driverNumber,
          stints: stintsSegments,
          totalLaps: stintsSegments.reduce(
            (sum, stint) => sum + stint.lapCount,
            0
          ),
        };

        return chartItem;
      });
  }, [drivers, stints]);

  const driverCount = useMemo(
    () => new Set(chartData.map((item) => item.driverNumber)).size,
    [chartData]
  );

  const maxLap = useMemo(
    () => Math.max(...chartData.map((item) => item.totalLaps), 0),
    [chartData]
  );

  const visibleCompounds = useMemo(
    () =>
      Array.from(
        new Set(
          chartData.flatMap((item) =>
            item.stints.map((stint) => stint.compound)
          )
        )
      ).sort((a, b) => {
        const aOrder = compoundOrder.indexOf(a);
        const bOrder = compoundOrder.indexOf(b);

        return (
          (aOrder === -1 ? compoundOrder.length : aOrder) -
            (bOrder === -1 ? compoundOrder.length : bOrder) ||
          a.localeCompare(b)
        );
      }),
    [chartData]
  );

  if (isLoadingDrivers || isLoadingStints || isLoadingPits) return <Spinner />;

  const handleStintHover = (
    event: ReactMouseEvent<SVGRectElement>,
    item: TyreStrategyChartItem,
    stint: TyreStrategyStintSegment
  ) => {
    setTooltip({
      type: 'stint',
      x: event.clientX,
      y: event.clientY,
      driverName: item.driverName,
      stint,
    });
  };

  const handleStintChangeHover = (
    event: ReactMouseEvent<SVGRectElement>,
    item: TyreStrategyChartItem,
    previousStint: TyreStrategyStintSegment,
    nextStint: TyreStrategyStintSegment
  ) => {
    const pit =
      pits
        .filter((p) => p.driver_number === item.driverNumber)
        .find(
          (l) =>
            l.lap_number === previousStint.lapEnd ||
            l.lap_number === nextStint.lapStart
        ) ?? ({} as pitType);
    setTooltip({
      type: 'stint-change',
      x: event.clientX,
      y: event.clientY,
      driverName: item.driverName,
      previousStint,
      nextStint,
      pit,
    });
  };

  const handleStintLeave = () => {
    setTooltip(null);
  };

  return (
    <StyledToolContainer>
      <StyledTitle>TYRE STRATEGY</StyledTitle>

      <StyledTyreStrategyPanel>
        {chartData.length === 0 ? (
          <p>No tyre stint data available.</p>
        ) : (
          <>
            <StyledTyreStrategyLegend>
              {visibleCompounds.map((compound) => (
                <StyledTyreStrategyLegendItem key={compound}>
                  <StyledTyreStrategyLegendSwatch
                    $color={getCompoundColor(compound)}
                  />
                  {compound}
                </StyledTyreStrategyLegendItem>
              ))}
            </StyledTyreStrategyLegend>

            <StyledTyreStrategyChartArea>
              <ResponsiveContainer
                width="100%"
                height={Math.max(360, driverCount * 34 + 96)}
              >
                <BarChart
                  data={chartData}
                  layout="vertical"
                  barCategoryGap={6}
                  margin={{ top: 8, right: 24, left: 8, bottom: 28 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    domain={[0, maxLap]}
                    allowDecimals={false}
                    tickCount={10}
                  >
                    <Label
                      value="Laps"
                      position="insideBottom"
                      offset={-12}
                      fontSize={12}
                    />
                  </XAxis>
                  <YAxis
                    type="category"
                    dataKey="driverLabel"
                    width={92}
                    allowDuplicatedCategory={false}
                  />
                  <Bar
                    dataKey="totalLaps"
                    barSize={18}
                    isAnimationActive={false}
                    shape={(props: BarShapeProps) => (
                      <TyreStrategyBarShape
                        {...props}
                        onStintHover={handleStintHover}
                        onStintChangeHover={handleStintChangeHover}
                        onStintLeave={handleStintLeave}
                      />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            </StyledTyreStrategyChartArea>

            {tooltip && (
              <div
                style={{
                  left: tooltip.x + 12,
                  pointerEvents: 'none',
                  position: 'fixed',
                  top: tooltip.y + 12,
                  zIndex: 9999,
                }}
              >
                <TyreStrategyTooltip tooltip={tooltip} />
              </div>
            )}
          </>
        )}
      </StyledTyreStrategyPanel>
    </StyledToolContainer>
  );
}
