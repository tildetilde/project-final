import { config } from '../config/environment';

// Spotify API base URL
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

/**
 * Start or resume playback on the user's active device
 * @param request - Playback configuration
 * @returns Promise<boolean> - Success status
 */
export async function startPlayback(request: PlaybackRequest): Promise<boolean> {
  try {
    const response = await fetch(`${config.backendUrl}/spotify/play`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start playback');
    }

    return true;
  } catch (error) {
    console.error('Error starting playback:', error);
    throw error;
  }
}

/**
 * Pause playback on the user's active device
 * @param deviceId - Optional device ID
 * @returns Promise<boolean> - Success status
 */
export async function pausePlayback(deviceId?: string): Promise<boolean> {
  try {
    const response = await fetch(`${config.backendUrl}/spotify/pause`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ deviceId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to pause playback');
    }

    return true;
  } catch (error) {
    console.error('Error pausing playback:', error);
    throw error;
  }
}

/**
 * Skip to next track
 * @param deviceId - Optional device ID
 * @returns Promise<boolean> - Success status
 */
export async function skipToNext(deviceId?: string): Promise<boolean> {
  try {
    const response = await fetch(`${config.backendUrl}/spotify/next`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ deviceId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to skip to next track');
    }

    return true;
  } catch (error) {
    console.error('Error skipping to next track:', error);
    throw error;
  }
}

/**
 * Skip to previous track
 * @param deviceId - Optional device ID
 * @returns Promise<boolean> - Success status
 */
export async function skipToPrevious(deviceId?: string): Promise<boolean> {
  try {
    const response = await fetch(`${config.backendUrl}/spotify/previous`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ deviceId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to skip to previous track');
    }

    return true;
  } catch (error) {
    console.error('Error skipping to previous track:', error);
    throw error;
  }
}

/**
 * Get available devices
 * @returns Promise<Device[]> - List of available devices
 */
export async function getAvailableDevices(): Promise<Device[]> {
  try {
    const response = await fetch(`${config.backendUrl}/spotify/devices`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get devices');
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
 * @returns Promise<PlaybackState | null> - Current playback state or null if not playing
 */
export async function getCurrentPlaybackState(): Promise<PlaybackState | null> {
  try {
    const response = await fetch(`${config.backendUrl}/spotify/playback-state`, {
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 204) {
        // No content - user not playing anything
        return null;
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to get playback state');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting playback state:', error);
    throw error;
  }
}

/**
 * Transfer playback to a specific device
 * @param deviceId - Device ID to transfer to
 * @param play - Whether to start playing after transfer
 * @returns Promise<boolean> - Success status
 */
export async function transferPlayback(deviceId: string, play: boolean = false): Promise<boolean> {
  try {
    const response = await fetch(`${config.backendUrl}/spotify/transfer`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ deviceId, play }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to transfer playback');
    }

    return true;
  } catch (error) {
    console.error('Error transferring playback:', error);
    throw error;
  }
}
