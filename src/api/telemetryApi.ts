import axios, { AxiosHeaders } from 'axios';
import { BASE_URL } from './endpoints';

type AccessTokenResponse = {
  access_token: string;
  expires_in: number | string;
  token_type: string;
};

let cachedAccessToken: string | null = null;
let accessTokenExpiresAt = 0;
let accessTokenRequest: Promise<string | null> | null = null;

const OPENF1_USERNAME = import.meta.env.VITE_OPENF1_USERNAME;
const OPENF1_PASSWORD = import.meta.env.VITE_OPENF1_PASSWORD;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getAccessToken() {
  const now = Date.now();
  if (cachedAccessToken && now < accessTokenExpiresAt - 60_000) {
    return cachedAccessToken;
  }

  accessTokenRequest ??= requestAccessToken();

  try {
    return await accessTokenRequest;
  } finally {
    accessTokenRequest = null;
  }
}

api.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();
  if (!accessToken) return config;

  const headers = AxiosHeaders.from(config.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);
  config.headers = headers;

  return config;
});

async function requestAccessToken() {
  if (!OPENF1_USERNAME || !OPENF1_PASSWORD) {
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
