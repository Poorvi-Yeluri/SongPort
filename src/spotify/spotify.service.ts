import { got, Response } from 'got';
import { SpotifyTokens, SpotifyPlaylist, PlaylistTrack } from './spotify.interfaces.ts';
import logger from '../common/logger.ts';

class SpotifyService {

    static generateCodeVerifier(): string {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        return Array.from(crypto.getRandomValues(new Uint8Array(64)))
            .map(x => possible[x % possible.length])
            .join('');
    }

    static async generateCodeChallenge(verifier: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return SpotifyService.base64URLEncode(new Uint8Array(digest));
    }

    private static base64URLEncode(buffer: Uint8Array): string {
        return btoa(String.fromCharCode(...buffer))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    static getAuthUrl(codeChallenge: string): string {
        const clientId = process.env.SPOTIFY_CLIENT_ID ?? '';
        const redirectUri = process.env.SPOTIFY_REDIRECT_URI ?? '';
        const scopes = 'user-library-read playlist-read-private playlist-modify-public';
    
        if (!clientId || !redirectUri) {
            throw new Error('Missing required Spotify environment variables.');
        }
    
        return `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
    }
    

    static async getTokens(code: string, codeVerifier: string): Promise<SpotifyTokens> {
        try {
            const response = await got.post<SpotifyTokens>('https://accounts.spotify.com/api/token', {
                form: {
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
                    client_id: process.env.SPOTIFY_CLIENT_ID!,
                    code_verifier: codeVerifier,
                },
                responseType: 'json',
            });
            return response.body;
        } catch (error) {
            logger.error('Failed to retrieve Spotify tokens: %o', error);
            throw error;
        }
    }

    static async getUserPlaylists(accessToken: string): Promise<SpotifyPlaylist[]> {
        const playlists: SpotifyPlaylist[] = [];
        let nextUrl: string | null = 'https://api.spotify.com/v1/me/playlists?limit=50';

        try {
            while (nextUrl) {
                const response: Response<{ items: SpotifyPlaylist[]; next: string | null }> = await got.get(nextUrl, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    responseType: 'json',
                });
                
                playlists.push(...response.body.items);
                nextUrl = response.body.next; // Handle pagination
            }

            logger.info(`Fetched ${playlists.length} playlists for the user`);
            return playlists;
        } catch (error) {
            logger.error('Error fetching playlists: %o', error);
            throw error;
        }
    }


    // Fetch items (tracks) for a specific playlist

    static async getPlaylistItems(accessToken: string, playlistId: string): Promise<PlaylistTrack[]> {
        const items: PlaylistTrack[] = [];
        let nextUrl: string | null = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

        try {
            while (nextUrl) {
                const response: Response<{ items: PlaylistTrack[]; next: string | null }> = await got.get(nextUrl, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    responseType: 'json',
                });

                items.push(...response.body.items);
                nextUrl = response.body.next;
            }

            logger.info(`Fetched ${items.length} items for playlist ${playlistId}`);
            return items;
        } catch (error) {
            logger.error(`Error fetching items for playlist ${playlistId}: %o`, error);
            throw error;
        }
    }


    static async transferPlaylist(accessToken: string, playlistId: string, destination: string): Promise<{ success: boolean }> {
        logger.debug(`Transferring playlist ${playlistId} to ${destination}`);
        // Placeholder for actual transfer logic
        return { success: true };
    }
}

export default SpotifyService;
