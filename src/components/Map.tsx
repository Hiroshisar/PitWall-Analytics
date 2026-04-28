import { useEffect, useMemo, useState } from 'react';
import type {
  DriverLocationSeries,
  driverType,
  LocationSeriesPoint,
  locationType,
} from '../utils/types';
import { normalizeHexColor } from '../utils/helpers';

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

const circuitImageRotationDeg = 240;
const mapHeight = 500;
const markerRadius = 5;
const markerStrokeWidth = 2;

type ImageSize = {
  width: number;
  height: number;
};

type CoordinateBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

type MapProps = {
  circuitImage?: string;
  locationsData: locationType[];
  selectedDrivers: driverType[];
};

function useImageSize(src?: string) {
  const [imageSize, setImageSize] = useState<
    (ImageSize & { src: string }) | null
  >(null);

  useEffect(() => {
    if (!src) return;

    let isMounted = true;
    const image = new Image();

    image.onload = () => {
      if (!isMounted) return;

      setImageSize({
        src,
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
      });
    };
    image.onerror = () => {
      if (isMounted) setImageSize(null);
    };
    image.src = src;

    return () => {
      isMounted = false;
    };
  }, [src]);

  if (!src || imageSize?.src !== src) return null;

  return imageSize;
}

function getRotationTransform(width: number, height: number) {
  return `rotate(${circuitImageRotationDeg} ${width / 2} ${height / 2})`;
}

function getMarkerPosition(
  point: LocationSeriesPoint,
  coordinateBounds: CoordinateBounds,
  width: number,
  height: number
) {
  const xRange = coordinateBounds.maxX - coordinateBounds.minX || 1;
  const yRange = coordinateBounds.maxY - coordinateBounds.minY || 1;

  return {
    x: ((point.x - coordinateBounds.minX) / xRange) * width,
    y: ((coordinateBounds.maxY - point.y) / yRange) * height,
  };
}

function Map({ circuitImage, locationsData, selectedDrivers }: MapProps) {
  const circuitImageSize = useImageSize(circuitImage);
  const width = circuitImageSize?.width ?? 1000;
  const height = circuitImageSize?.height ?? mapHeight;

  const locationData = useMemo<DriverLocationSeries[]>(() => {
    const groupedLocations: Record<number, locationType[]> = {};

    for (const locationSample of locationsData) {
      if (!groupedLocations[locationSample.driver_number]) {
        groupedLocations[locationSample.driver_number] = [];
      }
      groupedLocations[locationSample.driver_number].push(locationSample);
    }

    return selectedDrivers.map((driver, index) => {
      const driverLocationData = [
        ...(groupedLocations[driver.driver_number] ?? []),
      ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const firstSampleTime = new Date(
        driverLocationData[0]?.date ?? ''
      ).getTime();

      const points = driverLocationData.map((location) => {
        const locationTime = new Date(location.date).getTime();
        const lapTimeSec = Number.isFinite(firstSampleTime)
          ? (locationTime - firstSampleTime) / 1000
          : 0;

        return {
          lapTimeSec: Math.max(0, lapTimeSec),
          x: location.x,
          y: location.y,
          z: location.z,
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
  }, [locationsData, selectedDrivers]);

  const coordinateBounds = useMemo<CoordinateBounds | null>(() => {
    const points = locationData.flatMap((driverSeries) => driverSeries.points);
    if (points.length === 0) return null;

    return points.reduce<CoordinateBounds>(
      (bounds, point) => ({
        minX: Math.min(bounds.minX, point.x),
        maxX: Math.max(bounds.maxX, point.x),
        minY: Math.min(bounds.minY, point.y),
        maxY: Math.max(bounds.maxY, point.y),
      }),
      {
        minX: points[0].x,
        maxX: points[0].x,
        minY: points[0].y,
        maxY: points[0].y,
      }
    );
  }, [locationData]);

  const driverPositions = useMemo(() => {
    if (!coordinateBounds) return [];

    return locationData.flatMap((driverSeries) => {
      const lastPoint = driverSeries.points[driverSeries.points.length - 1];
      if (!lastPoint) return [];

      return [
        {
          driver: driverSeries.driver,
          color: driverSeries.color,
          position: getMarkerPosition(lastPoint, coordinateBounds, width, height),
        },
      ];
    });
  }, [coordinateBounds, height, locationData, width]);

  return (
    <svg
      width="100%"
      height={mapHeight}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {circuitImage && (
        <image
          href={circuitImage}
          x={0}
          y={0}
          width={width}
          height={height}
          opacity={0.16}
          preserveAspectRatio="xMidYMid meet"
          transform={getRotationTransform(width, height)}
        />
      )}
      {driverPositions.map((driverPosition) => (
        <g key={driverPosition.driver.driver_number}>
          <circle
            cx={driverPosition.position.x}
            cy={driverPosition.position.y}
            r={markerRadius}
            fill={driverPosition.color}
            stroke="#ffffff"
            strokeWidth={markerStrokeWidth}
          />
          <text
            x={driverPosition.position.x + markerRadius + 4}
            y={driverPosition.position.y + 4}
            fill={driverPosition.color}
            fontSize={16}
            fontWeight={700}
            paintOrder="stroke"
            stroke="#ffffff"
            strokeWidth={3}
          >
            {driverPosition.driver.name_acronym}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default Map;
