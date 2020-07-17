import {onThemeChange} from './theme';
import {onloadPopularData, onloadMorePopularData, onFlushPopularFavorite} from './popular';
import {onloadTrendingData, onloadMoreTrendingData, onFlushTrendingFavorite} from './trending';
import {onloadFavoriteData} from './favorite';

export default {
    onThemeChange,
    onloadPopularData,
    onloadMorePopularData,
    onloadTrendingData,
    onloadMoreTrendingData,
    onloadFavoriteData,
    onFlushPopularFavorite,
    onFlushTrendingFavorite,
}