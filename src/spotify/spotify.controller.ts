import { Request, Response, NextFunction } from 'express';
import SpotifyService from './spotify.service.ts';
import logger from '../common/logger.ts';
import { SpotifyTokens, SpotifyPlaylist } from './spotify.interfaces.ts';

class SpotifyController {
    static tempCodeVerifier: string = '';
    static accessToken: string = '';  // Static variable for access token
    static refreshToken: string = ''; // Static variable for refresh token

    static async authorize(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const codeVerifier = SpotifyService.generateCodeVerifier();
            const codeChallenge = await SpotifyService.generateCodeChallenge(codeVerifier);

            req.session.codeVerifier = codeVerifier;
            SpotifyController.tempCodeVerifier = codeVerifier; // Temporary storage
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect(SpotifyService.getAuthUrl(codeChallenge));
            });
        } catch (error) {
            next(error);
        }
    }

    static async callback(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const codeVerifier = req.session.codeVerifier || SpotifyController.tempCodeVerifier;
            if (!codeVerifier) {
                throw new Error('Invalid code or code verifier');
            }

            const tokens: SpotifyTokens = await SpotifyService.getTokens(req.query.code as string, codeVerifier);
            logger.debug(`Retrieved tokens: ${JSON.stringify(tokens)}`);
            
            SpotifyController.accessToken = tokens.access_token;
            SpotifyController.refreshToken = tokens.refresh_token;
            logger.info('Successfully retrieved and stored Spotify tokens');
            res.redirect('/');
        } catch (error) {
            next(error);
        }
    }

    static async getUserPlaylists(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const accessToken = SpotifyController.accessToken;
            if (!accessToken) {
                throw new Error('Access token is missing.');
            }

            const playlists: SpotifyPlaylist[] = await SpotifyService.getUserPlaylists(accessToken);
            res.json(playlists);
        } catch (error) {
            logger.error('Error fetching playlists: %o', error);
            next(error);
        }
    }

    static async getUserPlaylistsWithItems(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const accessToken = SpotifyController.accessToken;
            const playlistId = req.params.playlistId;

            if (!accessToken || !playlistId) {
                throw new Error('Missing access token or playlist ID');
            }

            const items = await SpotifyService.getPlaylistItems(accessToken, playlistId);
            res.json({ items });
        } catch (error) {
            logger.error('Error fetching playlist items: %o', error);
            next(error);
        }
    }

    static async transferPlaylist(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const accessToken = SpotifyController.accessToken;
            const { playlistId, destination } = req.body;
            if (!accessToken || !playlistId || !destination) {
                throw new Error('Missing required parameters.');
            }
            const result = await SpotifyService.transferPlaylist(accessToken, playlistId, destination);
            res.json(result);
        } catch (error) {
            logger.error('Error transferring playlist: %o', error);
            next(error);
        }
    }
}

export default SpotifyController;
