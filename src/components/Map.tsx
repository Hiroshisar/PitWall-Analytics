import { useEffect, useMemo, useState } from 'react';
import type { locationType, meetingType } from '../utils/types';
import { normalizeHexColor } from '../utils/helpers';
import { queryClient } from '../hooks/queryClient';
import { useQuery } from '@tanstack/react-query';
import { useFetchDrivers } from '../hooks/useFetchDriver';

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

const circuitImageRotationDeg = 0;
const originalCircuitImageWidth = 960;
const originalCircuitImageHeight = 720;
const mapHeight = 720;
const markerRadius = 5;
const markerStrokeWidth = 2;
const minCoordinateRange = 1_000;

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

function getRenderedMapWidth(imageSize: ImageSize | null) {
  const originalWidth = imageSize?.width ?? originalCircuitImageWidth;
  const originalHeight = imageSize?.height ?? originalCircuitImageHeight;

  return (originalWidth / originalHeight) * mapHeight;
}

function getMarkerPosition(
  point: Pick<locationType, 'x' | 'y'>,
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

function expandCoordinateBounds(bounds: CoordinateBounds): CoordinateBounds {
  const xRange = bounds.maxX - bounds.minX;
  const yRange = bounds.maxY - bounds.minY;
  const xPadding = Math.max(0, minCoordinateRange - xRange) / 2;
  const yPadding = Math.max(0, minCoordinateRange - yRange) / 2;

  return {
    minX: bounds.minX - xPadding,
    maxX: bounds.maxX + xPadding,
    minY: bounds.minY - yPadding,
    maxY: bounds.maxY + yPadding,
  };
}

function Map({ sessionKey }: { sessionKey: number }) {
  const { data: drivers } = useFetchDrivers(sessionKey);

  const meetings =
    queryClient.getQueryData<meetingType[]>([
      'meetings',
      new Date().getFullYear(),
    ]) ?? [];

  const circuitImage: string =
    meetings[meetings.length - 1]?.circuit_image ?? '';

  const circuitImageSize = useImageSize(circuitImage);
  const width = getRenderedMapWidth(circuitImageSize);
  const height = mapHeight;

  const driversNumbers = useMemo(
    () =>
      (drivers ?? [])
        .map((driver) => driver.driver_number)
        .filter((driverNumber) => driverNumber > 0)
        .sort((a, b) => a - b),
    [drivers]
  );

  const { data: locationSamples = [] } = useQuery<locationType[]>({
    queryKey: ['locations', sessionKey, driversNumbers],
    queryFn: async () => [],
    enabled: false,
    initialData: [],
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const latestLocationByDriverNumber = useMemo(() => {
    const latestLocations = new globalThis.Map<number, locationType>();

    for (const locationSample of locationSamples) {
      const currentLocation = latestLocations.get(
        locationSample.driver_number
      );

      if (
        !currentLocation ||
        new Date(locationSample.date).getTime() >=
          new Date(currentLocation.date).getTime()
      ) {
        latestLocations.set(locationSample.driver_number, locationSample);
      }
    }

    return latestLocations;
  }, [locationSamples]);

  const currentCoordinateBounds = useMemo<CoordinateBounds | null>(() => {
    const validLocations = locationSamples.filter(
      (locationSample) =>
        Number.isFinite(locationSample.x) && Number.isFinite(locationSample.y)
    );

    if (validLocations.length === 0) return null;

    const bounds = validLocations.reduce<CoordinateBounds>(
      (bounds, locationSample) => ({
        minX: Math.min(bounds.minX, locationSample.x),
        maxX: Math.max(bounds.maxX, locationSample.x),
        minY: Math.min(bounds.minY, locationSample.y),
        maxY: Math.max(bounds.maxY, locationSample.y),
      }),
      {
        minX: validLocations[0].x,
        maxX: validLocations[0].x,
        minY: validLocations[0].y,
        maxY: validLocations[0].y,
      }
    );

    return expandCoordinateBounds(bounds);
  }, [locationSamples]);

  const driverPositions = useMemo(() => {
    if (!currentCoordinateBounds) return [];

    return (drivers ?? []).flatMap((driver, index) => {
      const latestLocation = latestLocationByDriverNumber.get(
        driver.driver_number
      );
      if (!latestLocation) return [];

      const teamColor =
        normalizeHexColor(driver.team_colour) ??
        fallbackColors[index % fallbackColors.length];

      return [
        {
          driver,
          color: teamColor,
          position: getMarkerPosition(
            latestLocation,
            currentCoordinateBounds,
            width,
            height
          ),
        },
      ];
    });
  }, [
    currentCoordinateBounds,
    drivers,
    height,
    latestLocationByDriverNumber,
    width,
  ]);

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
