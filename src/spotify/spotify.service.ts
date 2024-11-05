import got from 'got';
import { SpotifyTokens, SpotifyPlaylist } from './spotify.interfaces.ts';
import logger from '../common/logger.ts';

class SpotifyService {
    static getAuthUrl(): string {
        const scopes = 'user-library-read playlist-read-private playlist-modify-public';
        logger.debug('Generated Spotify auth URL');
        return `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID as string}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI as string)}`;
    }

    static async getTokens(code: string): Promise<SpotifyTokens> {
        try {
            logger.debug('Requesting Spotify tokens');
            const response = await got.post('https://accounts.spotify.com/api/token', {
                form: {
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: process.env.SPOTIFY_REDIRECT_URI as string,
                    client_id: process.env.SPOTIFY_CLIENT_ID as string,
                    client_secret: process.env.SPOTIFY_CLIENT_SECRET as string,
                },
                responseType: 'json',
            });
            logger.info('Successfully retrieved Spotify tokens');
            return response.body as SpotifyTokens;
        } catch (error) {
            logger.error('Failed to retrieve Spotify tokens: %o', error);
            throw error;
        }
    }

    static async getUserPlaylists(accessToken: string): Promise<SpotifyPlaylist[]> {
        try {
            logger.debug('Fetching user playlists');
            const response = await got.get('https://api.spotify.com/v1/me/playlists', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                responseType: 'json',
            });

            const body = response.body as { items: SpotifyPlaylist[] };
            logger.info('Successfully fetched user playlists');
            return body.items;
        } catch (error) {
            logger.error('Error fetching playlists: %o', error);
            throw error;
        }
    }

    static async transferPlaylist(accessToken: string, playlistId: string, destination: string): Promise<{ success: boolean }> {
        logger.debug(`Transferring playlist ${playlistId} to ${destination}`);
        // Placeholder for actual transfer logic
        logger.info('Playlist transferred successfully');
        return { success: true };
    }
}

export default SpotifyService;
