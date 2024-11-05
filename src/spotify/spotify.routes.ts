import { Router } from 'express';
import SpotifyController from './spotify.controller.ts';

const router = Router();

router.get('/authorize', SpotifyController.authorize);
router.get('/callback', SpotifyController.callback);
router.get('/playlists', SpotifyController.getUserPlaylists);
router.get('/playlists-with-items/:playlistId/items', SpotifyController.getUserPlaylistsWithItems);
router.post('/transfer', SpotifyController.transferPlaylist);

export const spotifyRoutes = router;
