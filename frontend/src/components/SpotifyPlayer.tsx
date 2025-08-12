import React, { useState, useEffect } from 'react';
import { 
  startPlayback, 
  pausePlayback, 
  skipToNext, 
  skipToPrevious,
  getAvailableDevices,
  getCurrentPlaybackState,
  transferPlayback
} from '../services/spotifyApi';
import { Button } from '../ui/Button';

interface Device {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
}

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

export const SpotifyPlayer: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load available devices on component mount
  useEffect(() => {
    loadDevices();
    loadPlaybackState();
    
    // Poll for playback state updates
    const interval = setInterval(loadPlaybackState, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadDevices = async () => {
    try {
      const deviceList = await getAvailableDevices();
      setDevices(deviceList);
      
      // Auto-select active device or first available device
      const activeDevice = deviceList.find(d => d.is_active);
      if (activeDevice) {
        setSelectedDevice(activeDevice.id);
      } else if (deviceList.length > 0) {
        setSelectedDevice(deviceList[0].id);
      }
    } catch (err) {
      setError('Failed to load devices');
      console.error('Error loading devices:', err);
    }
  };

  const loadPlaybackState = async () => {
    try {
      const state = await getCurrentPlaybackState();
      setPlaybackState(state);
    } catch (err) {
      // Don't show error for playback state, just log it
      console.error('Error loading playback state:', err);
    }
  };

  const handlePlay = async () => {
    if (!selectedDevice) {
      setError('Please select a device first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Example: Play a specific track (you can modify this)
      await startPlayback({
        trackId: '4iV5W9uYEdYUVa79Axb7Rh', // Example track ID
        deviceId: selectedDevice
      });
      
      // Refresh playback state
      await loadPlaybackState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start playback');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = async () => {
    if (!selectedDevice) {
      setError('Please select a device first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await pausePlayback(selectedDevice);
      await loadPlaybackState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause playback');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (!selectedDevice) {
      setError('Please select a device first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await skipToNext(selectedDevice);
      await loadPlaybackState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to skip to next track');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = async () => {
    if (!selectedDevice) {
      setError('Please select a device first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await skipToPrevious(selectedDevice);
      await loadPlaybackState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to skip to previous track');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeviceChange = async (deviceId: string) => {
    setSelectedDevice(deviceId);
    
    try {
      // Transfer playback to the selected device
      await transferPlayback(deviceId, false);
      await loadPlaybackState();
    } catch (err) {
      console.error('Error transferring playback:', err);
      // Don't show error for device transfer
    }
  };

  const handlePlayContext = async (contextUri: string) => {
    if (!selectedDevice) {
      setError('Please select a device first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await startPlayback({
        contextUri,
        deviceId: selectedDevice
      });
      
      await loadPlaybackState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start playback');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Spotify Player</h2>
      
      {/* Device Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Device
        </label>
        <select
          value={selectedDevice}
          onChange={(e) => handleDeviceChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {devices.map((device) => (
            <option key={device.id} value={device.id}>
              {device.name} ({device.type}) {device.is_active ? '(Active)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Current Track Info */}
      {playbackState?.item && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-900">Now Playing</h3>
          <p className="text-sm text-gray-700">{playbackState.item.name}</p>
          <p className="text-sm text-gray-600">{playbackState.item.artists[0]?.name}</p>
          <p className="text-xs text-gray-500">{playbackState.item.album.name}</p>
        </div>
      )}

      {/* Playback Controls */}
      <div className="flex justify-center space-x-2 mb-4">
        <Button
          onClick={handlePrevious}
          disabled={isLoading || !selectedDevice}
          variant="outline"
          size="sm"
        >
          ⏮
        </Button>
        
        {playbackState?.is_playing ? (
          <Button
            onClick={handlePause}
            disabled={isLoading || !selectedDevice}
            variant="outline"
            size="sm"
          >
            ⏸
          </Button>
        ) : (
          <Button
            onClick={handlePlay}
            disabled={isLoading || !selectedDevice}
            variant="outline"
            size="sm"
          >
            ▶
          </Button>
        )}
        
        <Button
          onClick={handleNext}
          disabled={isLoading || !selectedDevice}
          variant="outline"
          size="sm"
        >
          ⏭
        </Button>
      </div>

      {/* Quick Play Examples */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Play Examples</h3>
        <div className="space-y-2">
          <Button
            onClick={() => handlePlayContext('spotify:album:5ht7ItJgpBH7W6vJ5BqpPr')}
            disabled={isLoading || !selectedDevice}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Play Album
          </Button>
          <Button
            onClick={() => handlePlayContext('spotify:playlist:6YHoO8ETcwxgq5WTjDpyAQ')}
            disabled={isLoading || !selectedDevice}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Play Playlist
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center text-sm text-gray-500">
          Loading...
        </div>
      )}

      {/* Refresh Button */}
      <Button
        onClick={() => {
          loadDevices();
          loadPlaybackState();
        }}
        variant="outline"
        size="sm"
        className="w-full"
      >
        Refresh
      </Button>
    </div>
  );
};
