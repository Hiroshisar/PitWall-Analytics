import mqtt, { type IClientOptions, type MqttClient } from 'mqtt';
import type { QueryClient, QueryKey } from '@tanstack/react-query';
import { WEBSOCKET_URL } from './endpoints';
import { getAccessToken, getOpenF1Username } from './telemetryApi';
import { latestOpenF1Key } from '../utils/helpers';
import type {
  CarType,
  IntervalType,
  LapType,
  LocationType,
  PitType,
  PositionType,
  RaceControlType,
  StartingGridType,
  StintType,
  TeamRadioType,
  WeatherType,
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
  'v1/car_data': CarType & OpenF1RealtimeFields;
  'v1/intervals': IntervalType & OpenF1RealtimeFields;
  'v1/laps': LapType & OpenF1RealtimeFields;
  'v1/location': LocationType & OpenF1RealtimeFields;
  'v1/pit': PitType & OpenF1RealtimeFields;
  'v1/position': PositionType & OpenF1RealtimeFields;
  'v1/race_control': RaceControlType & OpenF1RealtimeFields;
  'v1/starting_grid': StartingGridType & OpenF1RealtimeFields;
  'v1/stints': StintType & OpenF1RealtimeFields;
  'v1/team_radio': TeamRadioType & OpenF1RealtimeFields;
  'v1/weather': WeatherType & OpenF1RealtimeFields;
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
const MAX_RECENT_LOCATION_SAMPLES_PER_DRIVER = 90;
const MAX_RECENT_CAR_SAMPLES_PER_DRIVER = 90;
const MAX_RACE_CONTROL_MESSAGES = 80;

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

function hasDriverNumber(
  payload: OpenF1LivePayload
): payload is OpenF1LivePayload & { driver_number: number } {
  return (
    'driver_number' in payload && typeof payload.driver_number === 'number'
  );
}

function getPayloadSemanticKey(
  topic: OpenF1LiveTopic,
  payload: OpenF1LivePayload
) {
  if (hasDriverNumber(payload)) {
    if (topic === 'v1/position' || topic === 'v1/intervals') {
      return `driver:${payload.driver_number}`;
    }

    if (topic === 'v1/laps' && 'lap_number' in payload) {
      return `driver:${payload.driver_number}:lap:${payload.lap_number}`;
    }

    if (topic === 'v1/pit' && 'lap_number' in payload && 'date' in payload) {
      return `driver:${payload.driver_number}:pit:${payload.lap_number}:${payload.date}`;
    }

    if (topic === 'v1/stints' && 'stint_number' in payload) {
      return `driver:${payload.driver_number}:stint:${payload.stint_number}`;
    }

    if (topic === 'v1/starting_grid') {
      return `driver:${payload.driver_number}`;
    }
  }

  if (
    topic === 'v1/race_control' &&
    'date' in payload &&
    'message' in payload
  ) {
    return `race-control:${payload.date}:${payload.message}`;
  }

  return null;
}

function getPayloadIdentity(
  topic: OpenF1LiveTopic,
  payload: OpenF1LivePayload
) {
  const semanticKey = getPayloadSemanticKey(topic, payload);
  if (semanticKey) return `${topic}:${semanticKey}`;
  if (payload._key) return `${topic}:key:${payload._key}`;
  if (payload._id) return `${topic}:id:${payload._id}`;

  return null;
}

function upsertPayload(
  topic: OpenF1LiveTopic,
  current: OpenF1LivePayload[],
  payload: OpenF1LivePayload
) {
  const identity = getPayloadIdentity(topic, payload);
  if (!identity) return [...current, payload];

  return [
    ...current.filter((item) => getPayloadIdentity(topic, item) !== identity),
    payload,
  ];
}

function compactByDriverNumber(
  items: OpenF1LivePayload[],
  maxItemsPerDriver: number
) {
  const groupedItems = new Map<number, OpenF1LivePayload[]>();

  for (const item of items) {
    if (!hasDriverNumber(item)) continue;

    const driverItems = groupedItems.get(item.driver_number) ?? [];
    driverItems.push(item);

    if (driverItems.length > maxItemsPerDriver) {
      driverItems.splice(0, driverItems.length - maxItemsPerDriver);
    }

    groupedItems.set(item.driver_number, driverItems);
  }

  return Array.from(groupedItems.values()).flat();
}

function compactPayloads(topic: OpenF1LiveTopic, items: OpenF1LivePayload[]) {
  switch (topic) {
    case 'v1/location':
      return compactByDriverNumber(
        items,
        MAX_RECENT_LOCATION_SAMPLES_PER_DRIVER
      );
    case 'v1/car_data':
      return compactByDriverNumber(items, MAX_RECENT_CAR_SAMPLES_PER_DRIVER);
    case 'v1/position':
    case 'v1/intervals':
      return compactByDriverNumber(items, 1);
    case 'v1/race_control':
      return items.slice(-MAX_RACE_CONTROL_MESSAGES);
    default:
      return items;
  }
}

function upsertPayloads(
  topic: OpenF1LiveTopic,
  current: OpenF1LivePayload[],
  payloads: OpenF1LivePayload[]
) {
  const next = payloads.reduce(
    (updatedItems, payload) => upsertPayload(topic, updatedItems, payload),
    current
  );

  return compactPayloads(topic, next);
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
  cacheOpenF1LiveMessages(queryClient, [message]);
}

export function cacheOpenF1LiveMessages(
  queryClient: QueryClient,
  messages: OpenF1LiveMessage[]
) {
  const groupedMessages = new Map<
    string,
    {
      keyRoot: string;
      sessionKey: number;
      topic: OpenF1LiveTopic;
      messages: OpenF1LiveMessage[];
    }
  >();

  for (const message of messages) {
    const keyRoot = topicQueryKeyRoots[message.topic];
    const sessionKey = message.payload.session_key;
    if (!keyRoot || !sessionKey) continue;

    const groupKey = `${message.topic}:${sessionKey}`;
    const group = groupedMessages.get(groupKey) ?? {
      keyRoot,
      sessionKey,
      topic: message.topic,
      messages: [],
    };

    group.messages.push(message);
    groupedMessages.set(groupKey, group);
  }

  for (const group of groupedMessages.values()) {
    const queries = [group.sessionKey, latestOpenF1Key].flatMap((sessionKey) =>
      queryClient.getQueryCache().findAll({
        queryKey: [group.keyRoot, sessionKey],
      })
    );

    for (const query of queries) {
      const payloads = group.messages
        .filter((message) =>
          queryKeyMatchesPayload(query.queryKey, message.payload)
        )
        .map((message) => message.payload);

      if (payloads.length === 0) continue;

      queryClient.setQueryData<OpenF1LivePayload[]>(
        query.queryKey,
        (current = []) => upsertPayloads(group.topic, current, payloads)
      );
    }
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
    username: options.username ?? getOpenF1Username() ?? DEFAULT_USERNAME,
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
