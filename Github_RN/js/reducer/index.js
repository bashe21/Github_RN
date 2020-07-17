import {combineReducers} from 'redux';
import theme from './theme';
import popular from './popular'
import trending from './trending'
import favorite from './favorite'

const index = combineReducers({
    theme: theme,
    popular: popular,
    trending: trending,
    favorite: favorite,
});

export default index;