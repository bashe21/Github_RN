import {onThemeChange, onShowCustomThemeView, onThemeInit} from './theme';
import {onloadPopularData, onloadMorePopularData, onFlushPopularFavorite} from './popular';
import {onloadTrendingData, onloadMoreTrendingData, onFlushTrendingFavorite} from './trending';
import {onloadFavoriteData} from './favorite';
import {onLoadLanguage} from './language';

export default {
    onThemeChange,
    onloadPopularData,
    onloadMorePopularData,
    onloadTrendingData,
    onloadMoreTrendingData,
    onloadFavoriteData,
    onFlushPopularFavorite,
    onFlushTrendingFavorite,
    onLoadLanguage,
    onShowCustomThemeView,
    onThemeInit,
}