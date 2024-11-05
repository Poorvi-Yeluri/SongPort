// src/types.d.ts
import express from 'express';

declare module 'express-session' {
    interface SessionData {
        codeVerifier?: string,
        accessToken?: string;
        refreshToken?: string;
    }
}
