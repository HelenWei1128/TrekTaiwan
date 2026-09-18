# TrekTaiwan

A Taiwan hiking & trail companion app built with Expo (React Native + TypeScript),
inspired by the feature set of apps like SwitzerlandMobility — trail discovery,
route details with elevation profiles, and GPS hike recording — reimagined for
Taiwan's national parks and forest trails, under original branding.

> Note: this is an original implementation, not a copy of any existing app's
> code, map data, or branding. It uses standard map SDKs (Google Maps /
> Apple Maps via `react-native-maps`) rather than proprietary map tiles, and
> a hand-curated sample dataset of well-known Taiwan trails rather than any
> third party's trail database.

## Features

- **地圖 (Map)** — Taiwan-wide map with all trailheads and routes plotted,
  live user location.
- **路線 (Trails)** — Searchable, filterable list of trails (by difficulty)
  covering easy city walks, national park trails, and permit-required 百岳
  (Hundred Peaks) routes.
- **路線詳情 (Trail detail)** — Route map, distance/elevation stats, an
  elevation profile chart, description, season guidance, and permit notices.
- **記錄 (Record)** — Live GPS hike recording (distance, duration, elevation
  gain) with start/pause/stop, saved locally, with a history list and
  per-track detail view.
- **收藏 (Favorites)** — Save trails for quick access.
- **設定 (Settings)** — App info, permission rationale, and data disclaimer.

## Tech stack

- Expo SDK 57 / React Native 0.86 / TypeScript
- `@react-navigation` (bottom tabs + native stack per tab)
- `react-native-maps` for maps, polylines and markers
- `expo-location` for foreground GPS tracking
- `@react-native-async-storage/async-storage` for local persistence
  (favorites, saved tracks)
- `react-native-svg` for the elevation profile chart

## Getting started

```bash
npm install
npx expo start
```

Or just double-click the launcher for your OS in this folder:

- **macOS** — `start-app.command`
- **Windows** — `start-app.bat`

Either one installs dependencies on first run and starts the dev server,
then shows a QR code — scan it with the **Expo Go** app on your phone to
open TrekTaiwan.

Run on a device with the Expo Go app, or `npm run ios` / `npm run android`
with a configured native toolchain. Location permission is required for the
map's "my location" and the GPS recording feature.

### Android maps

To use Google Maps on Android, replace the placeholder
`android.config.googleMaps.apiKey` in `app.json` with your own Google Maps
SDK key.

## Data

Trail data lives in `src/data/trails.ts` — a curated set of well-known
Taiwan trails (象山、七星山、合歡山、玉山、雪山、太魯閣錐麓古道等) with
approximate coordinates and stats for demonstration purposes. Distances,
elevations and trail paths are simplified/approximate and **not** a
substitute for official maps — see the in-app disclaimer under 設定.
