import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SavedTrack } from '../types';

const FAVORITES_KEY = '@trektaiwan/favorites';
const TRACKS_KEY = '@trektaiwan/tracks';

interface AppDataContextValue {
  favorites: string[];
  toggleFavorite: (trailId: string) => void;
  isFavorite: (trailId: string) => boolean;
  savedTracks: SavedTrack[];
  addSavedTrack: (track: SavedTrack) => void;
  deleteSavedTrack: (trackId: string) => void;
  loaded: boolean;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [savedTracks, setSavedTracks] = useState<SavedTrack[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [favRaw, tracksRaw] = await Promise.all([
          AsyncStorage.getItem(FAVORITES_KEY),
          AsyncStorage.getItem(TRACKS_KEY),
        ]);
        if (favRaw) setFavorites(JSON.parse(favRaw));
        if (tracksRaw) setSavedTracks(JSON.parse(tracksRaw));
      } catch (e) {
        console.warn('Failed to load stored data', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persistFavorites = useCallback((next: string[]) => {
    setFavorites(next);
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const persistTracks = useCallback((next: SavedTrack[]) => {
    setSavedTracks(next);
    AsyncStorage.setItem(TRACKS_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const toggleFavorite = useCallback(
    (trailId: string) => {
      setFavorites((prev) => {
        const next = prev.includes(trailId)
          ? prev.filter((id) => id !== trailId)
          : [...prev, trailId];
        AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    []
  );

  const isFavorite = useCallback((trailId: string) => favorites.includes(trailId), [favorites]);

  const addSavedTrack = useCallback(
    (track: SavedTrack) => {
      persistTracks([track, ...savedTracks]);
    },
    [savedTracks, persistTracks]
  );

  const deleteSavedTrack = useCallback(
    (trackId: string) => {
      persistTracks(savedTracks.filter((t) => t.id !== trackId));
    },
    [savedTracks, persistTracks]
  );

  const value = useMemo(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite,
      savedTracks,
      addSavedTrack,
      deleteSavedTrack,
      loaded,
    }),
    [favorites, toggleFavorite, isFavorite, savedTracks, addSavedTrack, deleteSavedTrack, loaded]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
