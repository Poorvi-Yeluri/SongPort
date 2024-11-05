import express from 'express';
import session from 'express-session';
import MemoryStore from 'memorystore';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';

import { spotifyRoutes } from './src/spotify/spotify.routes.ts';
import { errorHandler } from './src/common/middleware/error.middleware.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

const allowedOrigins = [
    'https://127.0.0.1:3001', 
    'https://localhost:3001', 
    'https://song-port.vercel.app'
];
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // Allow cookies to be sent
    })
);

// Serve static files directly from the root directory
app.use(express.static(__dirname));

// Default route to serve index.html
app.get('/', (req, res) => {
    if (req.session.accessToken) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.redirect('/spotify/authorize');
    }
});

const MemStore = MemoryStore(session);

// Single session configuration using MemoryStore
app.use(
    session({
        store: new MemStore({ checkPeriod: 86400000 }), // Prune expired entries every 24h
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: { 
            secure: process.env.NODE_ENV === 'production', // Set to true in production only
            sameSite: 'lax'
        }
    })
);

// Middleware for JSON parsing
app.use(express.json());

// Register Spotify routes
app.use('/spotify', spotifyRoutes);

// Global error-handling middleware
app.use(errorHandler);

export default app;
