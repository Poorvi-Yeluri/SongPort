export interface SpotifyTokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

export interface SpotifyUser {
    id: string;
    display_name?: string | null;
    uri: string;
    href: string;
    external_urls: ExternalUrls;
    followers: { total: number };
    type: 'user';
}

export interface PlaylistTrack {
    added_at?: string;
    track: SimplifiedTrackObject;
}

export interface Paginated<T> {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: T[];
}

export interface SpotifyPlaylist {
    id: string;
    name: string;
    public?: boolean | null;
    snapshot_id: string;
    uri: string;
    external_urls: ExternalUrls;
    owner: SpotifyUser;
    followers: { total: number };
    tracks: Paginated<PlaylistTrack>;
    type: 'playlist';
}

export interface ImageObject {
    url: string;
    height: number | null;
    width: number | null;
}

export interface ExternalUrls {
    spotify: string;
}

export interface CopyrightObject {
    text: string;
    type: 'C' | 'P';
}

export interface ExternalIds {
    isrc?: string;
    ean?: string;
    upc?: string;
}

export interface SimplifiedArtistObject {
    id: string;
    name: string;
    type: 'artist';
    uri: string;
    external_urls: ExternalUrls;
}

export interface SimplifiedTrackObject {
    id: string;
    name: string;
    uri: string;
    type: 'track';
    duration_ms: number;
    explicit: boolean;
    artists: SimplifiedArtistObject[];
    external_urls: ExternalUrls;
}

export type AlbumTracksObject = Paginated<SimplifiedTrackObject>;

export interface Album {
    album_type: 'album' | 'single' | 'compilation';
    total_tracks: number;
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    release_date: string;
    release_date_precision: 'year' | 'month' | 'day';
    restrictions?: { reason: 'market' | 'product' | 'explicit' };
    type: 'album';
    uri: string;
    artists: SimplifiedArtistObject[];
    tracks: AlbumTracksObject;
    copyrights: CopyrightObject[];
    external_ids: ExternalIds;
    genres: string[];
    label: string;
    popularity: number;
}
