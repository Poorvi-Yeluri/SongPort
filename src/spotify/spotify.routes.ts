import { Router } from 'express';
import SpotifyController from './spotify.controller.ts';

const router = Router();

router.get('/login', SpotifyController.login);
router.get('/callback', SpotifyController.callback);
router.get('/playlists', SpotifyController.getUserPlaylists);
router.post('/transfer', SpotifyController.transferPlaylist);

export default router;
