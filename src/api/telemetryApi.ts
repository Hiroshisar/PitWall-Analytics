import axios, {
  AxiosHeaders,
  isAxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { BASE_URL } from './endpoints';

type AccessTokenResponse = {
  access_token: string;
  expires_in: number | string;
  token_type: string;
};

type OpenF1RequestConfig = InternalAxiosRequestConfig & {
  openF1AuthRetry?: boolean;
};

let cachedAccessToken: string | null = null;
let accessTokenExpiresAt = 0;
let accessTokenRequest: Promise<string | null> | null = null;

const OPENF1_ACCESS_TOKEN = normalizeAccessToken(
  import.meta.env.VITE_OPENF1_ACCESS_TOKEN
);
const OPENF1_USERNAME = import.meta.env.VITE_OPENF1_USERNAME?.trim();
const OPENF1_PASSWORD = import.meta.env.VITE_OPENF1_PASSWORD?.trim();
const OPENF1_MQTT_USERNAME = import.meta.env.VITE_OPENF1_MQTT_USERNAME?.trim();

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

export const authenticatedApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

function normalizeAccessToken(token: string | undefined) {
  const trimmedToken = token?.trim().replace(/^['"]|['"]$/g, '');
  if (!trimmedToken) return null;

  return trimmedToken.replace(/^Bearer\s+/i, '').trim() || null;
}

function hasOpenF1Credentials() {
  return Boolean(OPENF1_USERNAME && OPENF1_PASSWORD);
}

function hasOpenF1Auth() {
  return Boolean(OPENF1_ACCESS_TOKEN || hasOpenF1Credentials());
}

export async function getAccessToken() {
  const now = Date.now();
  if (cachedAccessToken && now < accessTokenExpiresAt - 60_000) {
    return cachedAccessToken;
  }

  if (!hasOpenF1Credentials()) {
    return OPENF1_ACCESS_TOKEN || null;
  }

  accessTokenRequest ??= requestAccessToken();

  try {
    return (await accessTokenRequest) ?? OPENF1_ACCESS_TOKEN ?? null;
  } finally {
    accessTokenRequest = null;
  }
}

export function getOpenF1Username() {
  return OPENF1_MQTT_USERNAME || OPENF1_USERNAME || undefined;
}

async function setAuthorizationHeader(config: InternalAxiosRequestConfig) {
  const accessToken = await getAccessToken();
  if (!accessToken) return config;

  const headers = AxiosHeaders.from(config.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);
  config.headers = headers;

  return config;
}

api.interceptors.response.use(undefined, async (error) => {
  if (!isAxiosError(error)) return Promise.reject(error);

  const status = error.response?.status;
  const config = error.config as OpenF1RequestConfig | undefined;

  if (
    !config ||
    config.openF1AuthRetry ||
    !hasOpenF1Auth() ||
    (status !== 401 && status !== 403)
  ) {
    return Promise.reject(error);
  }

  config.openF1AuthRetry = true;

  return api.request(await setAuthorizationHeader(config));
});

api.interceptors.request.use(async (config) => {
  if (!hasOpenF1Auth()) return config;

  return setAuthorizationHeader(config);
});

authenticatedApi.interceptors.request.use(setAuthorizationHeader);

authenticatedApi.interceptors.response.use(undefined, async (error) => {
  if (!isAxiosError(error)) return Promise.reject(error);

  const status = error.response?.status;
  const config = error.config as OpenF1RequestConfig | undefined;

  if (
    !config ||
    config.openF1AuthRetry ||
    !hasOpenF1Auth() ||
    (status !== 401 && status !== 403)
  ) {
    return Promise.reject(error);
  }

  if (hasOpenF1Credentials()) {
    cachedAccessToken = null;
    accessTokenExpiresAt = 0;
  }
  config.openF1AuthRetry = true;

  return authenticatedApi.request(await setAuthorizationHeader(config));
});

async function requestAccessToken() {
  if (!hasOpenF1Credentials()) {
    console.error(
      'Missing OpenF1 credentials. Set VITE_OPENF1_USERNAME and VITE_OPENF1_PASSWORD.'
    );
    return null;
  }

  const tokenUrl = `${BASE_URL}/token`;
  const params = new URLSearchParams();
  params.append('username', OPENF1_USERNAME);
  params.append('password', OPENF1_PASSWORD);

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      console.error(
        'Error obtaining OpenF1 access token:',
        response.status,
        await response.text()
      );
      return null;
    }

    const tokenData = (await response.json()) as AccessTokenResponse;
    const expiresInMs = Number(tokenData.expires_in) * 1000;

    cachedAccessToken = tokenData.access_token;
    accessTokenExpiresAt =
      Date.now() + (Number.isFinite(expiresInMs) ? expiresInMs : 3_600_000);

    return cachedAccessToken;
  } catch (error) {
    console.error('Network error while obtaining OpenF1 access token:', error);
    return null;
  }
}
