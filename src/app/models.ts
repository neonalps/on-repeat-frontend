export interface AuthUser {
    userId: string;
    username: string | null;
    email: string;
    accessToken: string;
    accessTokenExpiresAt: Date;
    refreshToken: string | null;
}

export interface OAuthConfig {
    authorizeUrl: string;
    clientId: string;
    redirectUri: string;
}

export interface LoginResponseDto {
    identity: {
        displayName: string | null;
        email: string;
        publicId: string;
    }
    token: {
        accessToken: string;
    }
}

export interface PaginatedResponseDto<T> {
    items: T[];
    nextPageKey?: string;
}

export interface PlayedTrackApiDto {
    playedTrackId: number;
    playedAt: string;
    track: TrackApiDto;
    musicProvider: MusicProviderApiDto;
    includeInStatistics: boolean;
}

export interface TrackApiDto {
    id: number;
    name: string;
    href: string;
    album: AlbumApiDto | null;
    artists: ArtistApiDto[];
}

export interface AlbumApiDto {
    id: number;
    name: string;
    href: string;
    images: ImageApiDto[];
}

export interface ImageApiDto {
    height: number;
    width: number;
    url: string;
}

export interface ArtistApiDto {
    id: number;
    name: string;
    href: string;
    images: ImageApiDto[];
}

export interface MusicProviderApiDto {
    id: number;
    name: string;
}