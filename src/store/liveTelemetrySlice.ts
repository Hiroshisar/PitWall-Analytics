import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  TelemetryState,
  RingBuffer,
  ChannelState,
  TelemetrySample,
} from "../utils/types";

/**
 *
 * FUNZIONALITA LIVE ANCORA NON IMPLEMENTATA
 *
 * NON CANCELLARE E NON MODIFICARE
 *
 */

const DEFAULT_CAPACITY = 4096;

const initialState: TelemetryState = {
  channels: {},
  lookbackMs: 30_000,
  uiFps: 15,
};

function makeRing(capacity = DEFAULT_CAPACITY): RingBuffer {
  return {
    capacity,
    head: 0,
    size: 0,
    data: Array.from({ length: capacity }, () => null),
    last: null,
  };
}

function ensureChannel(
  state: TelemetryState,
  id: string,
  capacity?: number,
): ChannelState {
  if (!state.channels[id]) {
    state.channels[id] = { id, ring: makeRing(capacity ?? DEFAULT_CAPACITY) };
  }
  return state.channels[id];
}

function pushSample(ring: RingBuffer, sample: TelemetrySample) {
  ring.data[ring.head] = sample;
  ring.head = (ring.head + 1) % ring.capacity;
  ring.size = Math.min(ring.size + 1, ring.capacity);
  ring.last = sample;
}

export const liveTelemetrySlice = createSlice({
  name: "telemetry",
  initialState,
  reducers: {
    upsertChannel(
      state,
      action: PayloadAction<{ id: string; capacity?: number }>,
    ) {
      ensureChannel(state, action.payload.id, action.payload.capacity);
    },
    ingestSample(
      state,
      action: PayloadAction<{ id: string; sample: TelemetrySample }>,
    ) {
      const ch = ensureChannel(state, action.payload.id);
      pushSample(ch.ring, action.payload.sample);
    },
    ingestBatch(
      state,
      action: PayloadAction<{ id: string; samples: TelemetrySample[] }>,
    ) {
      const ch = ensureChannel(state, action.payload.id);
      for (const s of action.payload.samples) pushSample(ch.ring, s);
    },
    setLookbackMs(state, action: PayloadAction<number>) {
      state.lookbackMs = action.payload;
    },
    setUiFps(state, action: PayloadAction<number>) {
      state.uiFps = action.payload;
    },
    resetChannel(state, action: PayloadAction<{ id: string }>) {
      const ch = state.channels[action.payload.id];
      if (!ch) return;
      ch.ring = makeRing(ch.ring.capacity);
    },
  },
});

export const {
  upsertChannel,
  ingestSample,
  ingestBatch,
  setLookbackMs,
  setUiFps,
  resetChannel,
} = liveTelemetrySlice.actions;

export default liveTelemetrySlice.reducer;

// Selectors
export const selectTelemetry = (state: { telemetry: TelemetryState }) =>
  state.telemetry;
export const selectChannel = (
  state: { telemetry: TelemetryState },
  id: string,
) => state.telemetry.channels[id];

export const makeSelectWindowSeries = () =>
  createSelector(
    [
      (state: { telemetry: TelemetryState }, id: string) =>
        selectChannel(state, id),
      (_state: { telemetry: TelemetryState }, _id: string, fromTs: number) =>
        fromTs,
      (
        _state: { telemetry: TelemetryState },
        _id: string,
        _fromTs: number,
        maxPoints = 600,
      ) => maxPoints,
    ],
    (ch, fromTs, maxPoints): TelemetrySample[] => {
      if (!ch || ch.ring.size === 0) return [];

      const { ring } = ch;
      const out: TelemetrySample[] = [];

      // ordine cronologico: dal più vecchio al più nuovo
      const start = (ring.head - ring.size + ring.capacity) % ring.capacity;
      for (let i = 0; i < ring.size; i++) {
        const idx = (start + i) % ring.capacity;
        const s = ring.data[idx];
        if (s && s.t >= fromTs) out.push(s);
      }

      if (out.length <= maxPoints) return out;

      // downsampling semplice per non saturare il render
      const stride = Math.ceil(out.length / maxPoints);
      const compact: TelemetrySample[] = [];
      for (let i = 0; i < out.length; i += stride) compact.push(out[i]);
      const last = out[out.length - 1];
      if (compact[compact.length - 1] !== last) compact.push(last);

      return compact;
    },
  );
