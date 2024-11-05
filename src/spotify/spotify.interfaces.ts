export interface SpotifyTokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

export interface SpotifyPlaylist {
    id: string;
    name: string;
    description: string;
    tracks: {
        total: number;
    };
    [key: string]: any;
}
