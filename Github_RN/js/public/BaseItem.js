import React from 'react';
import {PropTypes} from 'prop-types';
import { exp } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class BaseItem extends React.Component {
    constructor(pros) {
        super(pros);
        isFavorite = this.props.projectModel.isFavorite
        this.state = {
            isFavorite: isFavorite,
        }
    }

    /* 
    新版React方法
    */
    static getDerivedStateFromProms(nextProps, prevState) {
        const isFavorite = nextProps.projectModel.isFavorite;
        if (prevState.isFavorite !== isFavorite) {
            return {
                isFavorite: isFavorite,
            }
        }
        return null;
    }

    // componentWillReceiveProps(nextProps) {
    //     if (this.props.projectModel.isFavorite !== nextProps.projectModel.isFavorite) {
    //         this.setState({
    //             isFavorite: nextProps.projectModel.isFavorite,
    //         })
    //     }
    // }

    setFavoriteState(isFavorite) {
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite: isFavorite,
        })
    }

    onItemClick() {
        this.props.onSelect(isFavorite => {
            this.setFavoriteState(isFavorite);
        })
    }

    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite);
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite);
    }

    _favoriteIcon() {
        return <TouchableOpacity
            style = {{padding: 6}}
            underlayColor = 'transparent'
            onPress = {() => {
                this.onPressFavorite()
            }}
        >
            <FontAwesome 
                name = {this.state.isFavorite ? 'star' : 'star-o'}
                size = {26}
                style = {{color: '#678'}}
            />
            
        </TouchableOpacity>
    }
     
}

BaseItem.PropTypes = {
    projectModel: PropTypes.object,
    onSelect: PropTypes.func,
    onFavorite: PropTypes.func,
}
