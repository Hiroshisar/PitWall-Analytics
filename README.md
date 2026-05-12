# PitWall Analytics

PitWall Analytics is a personal open source project built to explore Formula 1 session data, telemetry, live timing, standings, weather, and tyre strategy through a focused web interface. The application uses OpenF1 data to provide practical Formula 1 analysis tools centered on session context and driver comparison.

## Implemented features

PitWall Analytics currently includes these working areas:

- Session context: loads OpenF1 meetings and sessions, selects sensible defaults, and shows circuit, country, date, session, and lap controls.
- Telemetry analysis: lets users choose drivers, select a meeting/session/lap, fetch lap and car data, and compare speed, throttle, brake, RPM, and gear charts.
- Live timing: connects to the OpenF1 live stream during active sessions, caches live messages, and shows a session grid, track map, and race control updates; outside live sessions it shows a countdown to the next event.
- Tyre strategy: displays stint data as a compound-colored horizontal bar chart, with hover details for stint length, tyre age, compound changes, and pit stop timing.
- Standings: shows current driver and team championship positions with points, driver cards, team branding, and aligned ranking rows.
- Weather: shows weather samples for the selected session, including air and track temperature ranges and time-spaced weather cards.

## Current project scope

The main implemented areas are telemetry comparison, live timing, standings, weather, and tyre strategy.

The statistics page is still a placeholder. The repository also contains service modules and structural groundwork for future sections related to team radio, overtakes, additional session resources, and deeper race analysis.

## Technical overview

PitWall Analytics is a React and TypeScript single-page application built with Vite.

- React Router manages the application routes.
- TanStack Query handles remote data fetching, caching, and asynchronous loading states.
- Axios provides the HTTP client used to access OpenF1 endpoints.
- Recharts powers the telemetry comparison charts.
- Styled Components defines the visual layer and reusable layout primitives.

## Data source

This project is powered by OpenF1 data.

Special thanks to OpenF1 for their work in making Formula 1 data openly accessible to developers and fans.

Website: [www.openf1.org](https://www.openf1.org)

## Getting started

### Requirements

- Node.js
- npm

### Install dependencies

```bash
npm install

```

## Open source and license

PitWall Analytics is a personal open source project.

This repository is released under the MIT License. See [LICENSE](./LICENSE) for details.
