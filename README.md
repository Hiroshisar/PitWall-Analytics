# PitWall Analytics

PitWall Analytics is a personal open source project built to explore Formula 1 session data and telemetry through a focused web interface. The application uses OpenF1 data to provide a practical driver comparison workflow centered on lap-based telemetry analysis.

## What the program does

PitWall Analytics currently focuses on helping users inspect and compare telemetry from a Formula 1 session.

- It loads meeting and session data for the current season from OpenF1.
- It automatically selects the latest available meeting and the most relevant session so the user can start analyzing data with minimal setup.
- It fetches the drivers available in the selected session and lets the user choose one or more drivers to compare.
- It retrieves lap data and car telemetry samples for the selected drivers.
- It narrows telemetry samples down to a specific lap, so the comparison is based on the same lap number across the selected drivers.
- It renders reusable comparison charts for speed, brake, RPM, and gear.
- It presents session context such as circuit name, country, date, and lap selection in a dedicated session header.
- It uses driver numbers, acronyms, portraits, and team colors to make side-by-side comparisons easier to read.

## Current project scope

The main implemented area of the application is the analysis flow.

The live feature is still under development and has not been implemented yet.

The repository already contains additional service modules and structural groundwork for future sections related to weather, team radio, race control, positions, pit stops, overtakes, standings, track data, and other session resources.

## Technical overview

PitWall Analytics is a React and TypeScript single-page application built with Vite.

- React Router manages the application routes.
- Redux Toolkit stores shared session and meeting state.
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
