import { ChartItem } from "@src/app/components/chart-item/chart-item.component";
import { ChartArtistApiDto, ChartTrackApiDto } from "@src/app/models";

export function convertChartTrackApiDtoToChartItem(item: ChartTrackApiDto): ChartItem {
    return {
        name: item.track.name,
        artists: item.track.artists.map(artist => artist.name),
        imageUrl: item.track.album?.images[0].url || "",
        href: item.track.href,
        count: item.timesPlayed,
    }
}

export function convertChartArtistApiDtoToChartItem(item: ChartArtistApiDto): ChartItem {
    return {
        name: item.artist.name,
        artists: null,
        imageUrl: item.artist.images[0].url,
        href: item.artist.href,
        count: item.timesPlayed,
    }
}