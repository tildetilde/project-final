import { config } from '../config/environment';
import { mockBackendTracks } from './spotifyMock'; // backend-formatet du visade
import { toTrackCard, type TrackCard } from './normalize'; // mapper till UI-formatet

const useMock = import.meta.env.VITE_USE_SPOTIFY_MOCK === '1';

// Spotify API base URL (sparas om du behöver senare)
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Interface for playback request
interface PlaybackRequest {
  trackId?: string;
  contextUri?: string;
  uris?: string[];
  deviceId?: string;
  positionMs?: number;
  offset?: {
    position?: number;
    uri?: string;
  };
}

// Interface for device information
interface Device {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
}

// Interface for playback state
interface PlaybackState {
  is_playing: boolean;
  progress_ms: number;
  item: {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: { name: string };
  } | null;
  device: Device;
}

/* ---------------------------
   Mock helpers (lokala)
---------------------------- */
const mockDevice: Device = {
  id: 'mock-device-1',
  name: 'Mock Web Player',
  type: 'Computer',
  is_active: true,
  is_private_session: false,
  is_restricted: false,
};

const first = mockBackendTracks[0];
const mockPlaybackState: PlaybackState = {
  is_playing: false,
  progress_ms: 0,
  item: first
    ? {
        id: first.trackId,
        name: first.trackTitle,
        artists: [{ name: first.trackArtist }],
        album: { name: 'Mock Album' },
      }
    : null,
  device: mockDevice,
};

/* ---------------------------
   High-level data getters
---------------------------- */

export async function getUserProfile() {
  if (useMock) {
    return { id: 'dev', display_name: 'Mock User' };
  }
  const r = await fetch(`${config.backendUrl}/user-profile`, { credentials: 'include' });
  if (!r.ok) throw new Error(`Failed to fetch user profile (${r.status})`);
  return await r.json();
}

export async function getUserTracks(): Promise<TrackCard[]> {
  if (useMock) {
    // backend -> UI
    return mockBackendTracks.map(toTrackCard);
  }
  const r = await fetch(`${config.backendUrl}/tracks`, { credentials: 'include' });
  if (!r.ok) throw new Error(`Failed to fetch user tracks (${r.status})`);
  const data = await r.json(); // BackendTrack[]
  return (data as any[]).map(toTrackCard);
}

/* ---------------------------
   Playback controls
---------------------------- */

/**
 * Start or resume playback on the user's active device
 */
export async function startPlayback(request: PlaybackRequest): Promise<boolean> {
  if (useMock) {
    console.info('[MOCK] startPlayback', request);
    return true;
  }
  try {
    const response = await fetch(`${config.backendUrl}/spotify/play`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await safeJson(response);
      throw new Error((error as any)?.error || 'Failed to start playback');
    }
    return true;
  } catch (error) {
    console.error('Error starting playback:', error);
    throw error;
  }
}

/**
 * Pause playback on the user's active device
 */
export async function pausePlayback(deviceId?: string): Promise<boolean> {
  if (useMock) {
    console.info('[MOCK] pausePlayback', { deviceId });
    return true;
  }
  try {
    const response = await fetch(`${config.backendUrl}/spotify/pause`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ deviceId }),
    });

    if (!response.ok) {
      const error = await safeJson(response);
      throw new Error((error as any)?.error || 'Failed to pause playback');
    }
    return true;
  } catch (error) {
    console.error('Error pausing playback:', error);
    throw error;
  }
}

/**
 * Skip to next track
 */
export async function skipToNext(deviceId?: string): Promise<boolean> {
  if (useMock) {
    console.info('[MOCK] skipToNext', { deviceId });
    return true;
  }
  try {
    const response = await fetch(`${config.backendUrl}/spotify/next`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ deviceId }),
    });

    if (!response.ok) {
      const error = await safeJson(response);
      throw new Error((error as any)?.error || 'Failed to skip to next track');
    }
    return true;
  } catch (error) {
    console.error('Error skipping to next track:', error);
    throw error;
  }
}

/**
 * Skip to previous track
 */
export async function skipToPrevious(deviceId?: string): Promise<boolean> {
  if (useMock) {
    console.info('[MOCK] skipToPrevious', { deviceId });
    return true;
  }
  try {
    const response = await fetch(`${config.backendUrl}/spotify/previous`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ deviceId }),
    });

    if (!response.ok) {
      const error = await safeJson(response);
      throw new Error((error as any)?.error || 'Failed to skip to previous track');
    }
    return true;
  } catch (error) {
    console.error('Error skipping to previous track:', error);
    throw error;
  }
}

/**
 * Get available devices
 */
export async function getAvailableDevices(): Promise<Device[]> {
  if (useMock) {
    return [mockDevice];
  }
  try {
    const response = await fetch(`${config.backendUrl}/spotify/devices`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await safeJson(response);
      throw new Error((error as any)?.error || 'Failed to get devices');
    }

    const data = await response.json();
    return data.devices || [];
  } catch (error) {
    console.error('Error getting devices:', error);
    throw error;
  }
}

/**
 * Get current playback state
 */
export async function getCurrentPlaybackState(): Promise<PlaybackState | null> {
  if (useMock) {
    return mockPlaybackState;
  }
  try {
    const response = await fetch(`${config.backendUrl}/spotify/playback-state`, {
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 204) {
        return null;
      }
      const error = await safeJson(response);
      throw new Error((error as any)?.error || 'Failed to get playback state');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting playback state:', error);
    throw error;
  }
}

/**
 * Transfer playback to a specific device
 */
export async function transferPlayback(deviceId: string, play: boolean = false): Promise<boolean> {
  if (useMock) {
    console.info('[MOCK] transferPlayback', { deviceId, play });
    return true;
  }
  try {
    const response = await fetch(`${config.backendUrl}/spotify/transfer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ deviceId, play }),
    });

    if (!response.ok) {
      const error = await safeJson(response);
      throw new Error((error as any)?.error || 'Failed to transfer playback');
    }

    return true;
  } catch (error) {
    console.error('Error transferring playback:', error);
    throw error;
  }
}

/* ---------------------------
   utils
---------------------------- */
async function safeJson(r: Response) {
  try {
    return await r.json();
  } catch {
    return {};
  }
}
