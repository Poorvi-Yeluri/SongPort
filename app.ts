import express from 'express';
import spotifyRoutes from './src/spotify/spotify.routes.ts';
import { errorHandler } from './src/common/middleware/error.middleware.ts';

const app = express();

app.use(express.json());

// Register Spotify routes
app.use('/spotify', spotifyRoutes);

// Global error-handling middleware
app.use(errorHandler);

export default app;
