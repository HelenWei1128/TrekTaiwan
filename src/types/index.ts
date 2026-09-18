export type Difficulty = 'easy' | 'moderate' | 'hard' | 'expert';

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface ElevationPoint {
  distanceKm: number;
  elevationM: number;
}

export interface Trail {
  id: string;
  name: string;
  nameEn: string;
  region: string;
  county: string;
  difficulty: Difficulty;
  distanceKm: number;
  elevationGainM: number;
  elevationLossM: number;
  minElevationM: number;
  maxElevationM: number;
  estimatedDurationMin: number;
  description: string;
  path: LatLng[];
  elevationProfile: ElevationPoint[];
  tags: string[];
  permitRequired: boolean;
  season: string;
}

export interface TrackPoint extends LatLng {
  timestamp: number;
  altitude?: number | null;
  speed?: number | null;
}

export interface SavedTrack {
  id: string;
  name: string;
  startedAt: number;
  finishedAt: number;
  points: TrackPoint[];
  distanceKm: number;
  elevationGainM: number;
  durationSec: number;
  linkedTrailId?: string;
}
