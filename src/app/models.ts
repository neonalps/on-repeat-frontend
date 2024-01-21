export interface AuthUser {
    userId: string;
    username: string | null;
    email: string;
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
}

export interface OAuthConfig {
    authorizeUrl: string;
    clientId: string;
    redirectUri: string;
}

export interface TokenResponseDto {
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponseDto {
    identity: {
        displayName: string | null;
        email: string;
        publicId: string;
    }
    token: TokenResponseDto,
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

export interface AccountTokenApiDto {
    publicId: string;
    provider: string;
    scopes: string[];
    createdAt: Date;
}

export interface CreateAccountTokenResponseDto {
    success: boolean;
    error?: string;
}

export type ChartApiItem = ChartTrackApiDto | ChartArtistApiDto;

export interface BasicDashboardInformationApiDto {
    charts: {
        tracks: {
            allTime: ChartApiDto<ChartTrackApiDto>,
            current: ChartApiDto<ChartTrackApiDto>,
        },
        artists: {
            allTime: ChartApiDto<ChartArtistApiDto>,
            current: ChartApiDto<ChartArtistApiDto>,
        },
    },
    stats: {
        playedTracks: {
            allTime: PlayedStatsApiDto,
            current: PlayedStatsApiDto,
        },
    },
}

export interface ChartApiDto<T> {
    type: string;
    from?: Date;
    to?: Date;
    items: T[];
}

export interface ChartTrackApiDto {
    position: number;
    delta: number | null;
    track: TrackApiDto;
    timesPlayed: number;
}

export interface ChartArtistApiDto {
    position: number;
    delta: number | null;
    artist: ArtistApiDto;
    timesPlayed: number;
}

export interface PlayedStatsApiDto {
    from?: Date;
    to?: Date;
    timesPlayed: number;
}