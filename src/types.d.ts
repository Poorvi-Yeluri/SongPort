// src/types.d.ts
import express from 'express';

declare module 'express-session' {
    interface SessionData {
        accessToken?: string;
        refreshToken?: string;
    }
}
