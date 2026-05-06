import { useEffect, useId, useRef, useState } from 'react';
import Coloris from '@melloware/coloris';
import {
  ColoredCircle,
  DriverNumber,
  DriverPortrait,
  StyledDriverMain,
  StyledDriverRow,
  StyledDriverSecondary,
} from '../style/styles';
import type { DriversListVariant } from '../style/styles';
import type { driverType } from '../utils/types';
import RemoveButton from '../ui/RemoveButton';
import { normalizeHexColor } from '../utils/helpers';

const getPublicImageSrc = (fileName: string) =>
  `${import.meta.env.BASE_URL}${fileName}`;

const fallbackDriverImage = getPublicImageSrc('unknown.png');
const getDriverImageSrc = (driverNumber: number) =>
  getPublicImageSrc(`${driverNumber}.png`);

type LoadedDriverImage = {
  driverNumber: number;
  src: string;
};

function Driver({
  driver,
  isItemSelected,
  type = 'main',
  onRemove,
  onColorChange,
}: {
  type?: DriversListVariant;
  driver: driverType;
  isItemSelected: boolean;
  onRemove?: (driverNumber: number) => void;
  onColorChange?: (driverNumber: number, color: string) => void;
}) {
  const colorInputId = useId();
  const colorInputRef = useRef<HTMLInputElement>(null);
  const colorCircleRef = useRef<HTMLLabelElement>(null);
  const colorValue = normalizeHexColor(driver.team_colour) ?? '#000000';
  const pendingColorRef = useRef<string | null>(null);
  const [loadedDriverImage, setLoadedDriverImage] =
    useState<LoadedDriverImage | null>(null);
  const driverImageSrc =
    loadedDriverImage?.driverNumber === driver.driver_number
      ? loadedDriverImage.src
      : fallbackDriverImage;

  useEffect(() => {
    let isCurrentDriver = true;
    const driverNumber = driver.driver_number;
    const imageSrc = getDriverImageSrc(driver.driver_number);
    const image = new Image();

    image.onload = () => {
      if (isCurrentDriver)
        setLoadedDriverImage({ driverNumber, src: imageSrc });
    };

    image.onerror = () => {
      if (isCurrentDriver) {
        setLoadedDriverImage({ driverNumber, src: fallbackDriverImage });
      }
    };

    image.src = imageSrc;

    return () => {
      isCurrentDriver = false;
    };
  }, [driver.driver_number]);

  useEffect(() => {
    const input = colorInputRef.current;
    if (!input) return;

    Coloris({
      el: input,
      wrap: false,
      themeMode: 'dark',
      format: 'hex',
      alpha: false,
      margin: 8,
      defaultColor: colorValue,
      closeButton: true,
      closeLabel: 'Conferma',
    });
  }, [colorValue, type]);

  useEffect(() => {
    const input = colorInputRef.current;
    if (input) input.value = colorValue;

    if (colorCircleRef.current) {
      colorCircleRef.current.style.backgroundColor = colorValue;
    }

    pendingColorRef.current = null;
  }, [colorValue]);

  useEffect(() => {
    const input = colorInputRef.current;
    if (!input) return;

    const handleColorPick = (event: Event) => {
      const { color, currentEl } = (
        event as CustomEvent<{
          color: string;
          currentEl?: HTMLElement;
        }>
      ).detail;

      if (currentEl !== input) return;

      pendingColorRef.current = color;

      if (colorCircleRef.current) {
        colorCircleRef.current.style.backgroundColor = color;
      }
    };

    const handleColorClose = () => {
      const pendingColor = pendingColorRef.current;
      if (!pendingColor) return;

      onColorChange?.(driver.driver_number, pendingColor.replace('#', ''));
      pendingColorRef.current = null;
    };

    document.addEventListener('coloris:pick', handleColorPick);
    input.addEventListener('close', handleColorClose);

    return () => {
      document.removeEventListener('coloris:pick', handleColorPick);
      input.removeEventListener('close', handleColorClose);
    };
  }, [driver.driver_number, onColorChange]);

  if (type === 'secondary') {
    return (
      <StyledDriverSecondary>
        <ColoredCircle
          as="label"
          ref={colorCircleRef}
          htmlFor={colorInputId}
          $color={colorValue}
          onClick={(event) => event.stopPropagation()}
        >
          <input
            ref={colorInputRef}
            id={colorInputId}
            aria-label={`Choose ${driver.name_acronym} chart color`}
            type="text"
            defaultValue={colorValue}
          />
        </ColoredCircle>
        <h3>{`${driver.name_acronym} ${driver.driver_number}`}</h3>
        <RemoveButton
          className="remove-button"
          onClick={() => {
            onRemove?.(driver.driver_number);
          }}
        />
      </StyledDriverSecondary>
    );
  }

  return (
    <StyledDriverMain $selected={isItemSelected}>
      <DriverPortrait>
        <img
          src={driverImageSrc}
          alt={`${driver.name_acronym}-${driver.driver_number}`}
          width={150}
        />
      </DriverPortrait>
      <StyledDriverRow>
        <h3>{driver.last_name.toLocaleUpperCase()}</h3>
      </StyledDriverRow>
      <DriverNumber>
        <h2>{driver.driver_number}</h2>
      </DriverNumber>
    </StyledDriverMain>
  );
}

export default Driver;
