import { Request, Response } from 'express';
import SpotifyService from './spotify.service.ts';
import logger from '../common/logger.ts';

class SpotifyController {
    static async login(req: Request, res: Response): Promise<void> {
        try {
            logger.info('Initiating Spotify login process');
            const authUrl = SpotifyService.getAuthUrl();
            res.redirect(authUrl);
        } catch (error) {
            logger.error('Error in login process: %o', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async callback(req: Request, res: Response): Promise<void> {
        try {
            const { code } = req.query;
            if (typeof code !== 'string') {
                throw new Error('Authorization code is missing or invalid.');
            }
            const tokens = await SpotifyService.getTokens(code);
            logger.info('Successfully retrieved Spotify tokens');
            res.json(tokens);
        } catch (error) {
            logger.error('Error in Spotify callback: %o', error);
            res.status(500).json({ error: 'Failed to retrieve tokens' });
        }
    }

    static async getUserPlaylists(req: Request, res: Response): Promise<void> {
        try {
            const accessToken = req.headers.authorization?.split(' ')[1];
            if (!accessToken) {
                throw new Error('Access token is missing.');
            }
            const playlists = await SpotifyService.getUserPlaylists(accessToken);
            logger.info('Fetched user playlists');
            res.json(playlists);
        } catch (error) {
            logger.error('Error fetching playlists: %o', error);
            res.status(500).json({ error: 'Failed to fetch playlists' });
        }
    }

    static async transferPlaylist(req: Request, res: Response): Promise<void> {
        try {
            const { accessToken, playlistId, destination } = req.body;
            if (!accessToken || !playlistId || !destination) {
                throw new Error('Missing required parameters.');
            }
            const result = await SpotifyService.transferPlaylist(accessToken, playlistId, destination);
            logger.info('Transferred playlist successfully');
            res.json(result);
        } catch (error) {
            logger.error('Error transferring playlist: %o', error);
            res.status(500).json({ error: 'Failed to transfer playlist' });
        }
    }
}

export default SpotifyController;
