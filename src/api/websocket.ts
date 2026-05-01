import mqtt, { type IClientOptions, type MqttClient } from 'mqtt';
import type { QueryClient, QueryKey } from '@tanstack/react-query';
import { WEBSOCKET_URL } from './endpoints';
import { getAccessToken } from './telemetryApi';
import type {
  carType,
  intervalType,
  lapType,
  locationType,
  pitType,
  positionType,
  raceControlType,
  startingGridType,
  stintType,
  teamRadioType,
  weatherType,
} from '../utils/types';

export const OPENF1_LIVE_TOPICS = [
  'v1/car_data',
  'v1/intervals',
  'v1/laps',
  'v1/location',
  'v1/pit',
  'v1/position',
  'v1/race_control',
  'v1/starting_grid',
  'v1/stints',
  'v1/team_radio',
  'v1/weather',
] as const;

export type OpenF1LiveTopic = (typeof OPENF1_LIVE_TOPICS)[number];

type OpenF1RealtimeFields = {
  _id?: number;
  _key?: string;
};

type OpenF1LivePayloadByTopic = {
  'v1/car_data': carType & OpenF1RealtimeFields;
  'v1/intervals': intervalType & OpenF1RealtimeFields;
  'v1/laps': lapType & OpenF1RealtimeFields;
  'v1/location': locationType & OpenF1RealtimeFields;
  'v1/pit': pitType & OpenF1RealtimeFields;
  'v1/position': positionType & OpenF1RealtimeFields;
  'v1/race_control': raceControlType & OpenF1RealtimeFields;
  'v1/starting_grid': startingGridType & OpenF1RealtimeFields;
  'v1/stints': stintType & OpenF1RealtimeFields;
  'v1/team_radio': teamRadioType & OpenF1RealtimeFields;
  'v1/weather': weatherType & OpenF1RealtimeFields;
};

export type OpenF1LivePayload = OpenF1LivePayloadByTopic[OpenF1LiveTopic];

export type OpenF1LiveMessage<
  TTopic extends OpenF1LiveTopic = OpenF1LiveTopic,
> = {
  topic: TTopic;
  payload: OpenF1LivePayloadByTopic[TTopic];
  raw: string;
};

export type OpenF1LiveStatus =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'offline'
  | 'closed';

export type OpenF1LiveConnectionOptions = {
  accessToken?: string;
  username?: string;
  topics?: readonly OpenF1LiveTopic[];
  meetingKey?: number | null;
  sessionKey?: number | null;
  clientId?: string;
  mqttOptions?: Omit<IClientOptions, 'clientId' | 'password' | 'username'>;
  onError?: (error: Error) => void;
  onMessage?: (message: OpenF1LiveMessage) => void;
  onStatusChange?: (status: OpenF1LiveStatus) => void;
  onSubscribed?: (topic: OpenF1LiveTopic) => void;
};

export type OpenF1LiveConnection = {
  client: MqttClient;
  close: () => void;
  subscribe: (topic: OpenF1LiveTopic) => void;
  unsubscribe: (topic: OpenF1LiveTopic) => void;
};

const DEFAULT_USERNAME = 'pitwall-analytics';
const DEFAULT_RECONNECT_PERIOD_MS = 3_000;
const DEFAULT_CONNECT_TIMEOUT_MS = 30_000;
const DEFAULT_KEEPALIVE_SECONDS = 60;

const topicQueryKeyRoots: Record<OpenF1LiveTopic, string> = {
  'v1/car_data': 'cars',
  'v1/intervals': 'intervals',
  'v1/laps': 'laps',
  'v1/location': 'locations',
  'v1/pit': 'pit',
  'v1/position': 'position',
  'v1/race_control': 'race-control',
  'v1/starting_grid': 'starting-grid',
  'v1/stints': 'stints',
  'v1/team_radio': 'team-radio',
  'v1/weather': 'weather',
};

function isOpenF1LiveTopic(topic: string): topic is OpenF1LiveTopic {
  return OPENF1_LIVE_TOPICS.includes(topic as OpenF1LiveTopic);
}

function makeClientId() {
  const suffix =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(16).slice(2);

  return `pitwall-analytics-${suffix}`;
}

function errorFromUnknown(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

function parseMessage(
  topic: string,
  message: Buffer
): OpenF1LiveMessage | null {
  if (!isOpenF1LiveTopic(topic)) return null;

  const raw = message.toString();
  const payload = JSON.parse(raw) as OpenF1LivePayload;

  return { topic, payload, raw } as OpenF1LiveMessage;
}

function isMessageInScope(
  payload: OpenF1LivePayload,
  meetingKey?: number | null,
  sessionKey?: number | null
) {
  if (meetingKey && payload.meeting_key !== meetingKey) return false;
  if (sessionKey && payload.session_key !== sessionKey) return false;

  return true;
}

function upsertPayload<TPayload extends OpenF1RealtimeFields>(
  current: TPayload[],
  payload: TPayload
) {
  const existingIndex = current.findIndex((item) => {
    if (item._key && payload._key) return item._key === payload._key;
    if (item._id && payload._id) return item._id === payload._id;

    return false;
  });

  if (existingIndex === -1) return [...current, payload];

  const existing = current[existingIndex];
  if (existing._id && payload._id && existing._id > payload._id) {
    return current;
  }

  const next = [...current];
  next[existingIndex] = payload;
  return next;
}

function queryKeyMatchesPayload(
  queryKey: QueryKey,
  payload: OpenF1LivePayload
) {
  const driverNumbers = queryKey.find((part) => Array.isArray(part));
  if (!Array.isArray(driverNumbers) || !('driver_number' in payload)) {
    return true;
  }

  return driverNumbers.includes(payload.driver_number);
}

export function cacheOpenF1LiveMessage(
  queryClient: QueryClient,
  message: OpenF1LiveMessage
) {
  const keyRoot = topicQueryKeyRoots[message.topic];
  const sessionKey = message.payload.session_key;
  if (!keyRoot || !sessionKey) return;

  const queries = queryClient
    .getQueryCache()
    .findAll({ queryKey: [keyRoot, sessionKey] });

  for (const query of queries) {
    if (!queryKeyMatchesPayload(query.queryKey, message.payload)) continue;

    queryClient.setQueryData<OpenF1LivePayload[]>(
      query.queryKey,
      (current = []) => upsertPayload(current, message.payload)
    );
  }
}

export async function connectOpenF1LiveWebSocket(
  options: OpenF1LiveConnectionOptions = {}
): Promise<OpenF1LiveConnection> {
  const accessToken = options.accessToken ?? (await getAccessToken());
  if (!accessToken) {
    throw new Error('OpenF1 access token is required for live data streaming.');
  }

  const topics = options.topics ?? OPENF1_LIVE_TOPICS;
  const client = mqtt.connect(WEBSOCKET_URL, {
    clean: true,
    connectTimeout: DEFAULT_CONNECT_TIMEOUT_MS,
    keepalive: DEFAULT_KEEPALIVE_SECONDS,
    reconnectPeriod: DEFAULT_RECONNECT_PERIOD_MS,
    ...options.mqttOptions,
    clientId: options.clientId ?? makeClientId(),
    password: accessToken,
    username: options.username ?? DEFAULT_USERNAME,
  });

  const subscribe = (topic: OpenF1LiveTopic) => {
    client.subscribe(topic, (error) => {
      if (error) {
        options.onError?.(errorFromUnknown(error));
        return;
      }

      options.onSubscribed?.(topic);
    });
  };

  const unsubscribe = (topic: OpenF1LiveTopic) => {
    client.unsubscribe(topic, (error) => {
      if (error) options.onError?.(errorFromUnknown(error));
    });
  };

  options.onStatusChange?.('connecting');

  client.on('connect', () => {
    options.onStatusChange?.('connected');
    topics.forEach(subscribe);
  });

  client.on('message', (topic, message) => {
    try {
      const parsedMessage = parseMessage(topic, message);
      if (!parsedMessage) return;

      if (
        !isMessageInScope(
          parsedMessage.payload,
          options.meetingKey,
          options.sessionKey
        )
      ) {
        return;
      }

      options.onMessage?.(parsedMessage);
    } catch (error) {
      options.onError?.(errorFromUnknown(error));
    }
  });

  client.on('error', (error) => {
    options.onError?.(errorFromUnknown(error));
  });

  client.on('close', () => {
    options.onStatusChange?.('closed');
  });

  client.on('offline', () => {
    options.onStatusChange?.('offline');
  });

  client.on('reconnect', () => {
    options.onStatusChange?.('reconnecting');
  });

  return {
    client,
    close: () => client.end(true),
    subscribe,
    unsubscribe,
  };
}
