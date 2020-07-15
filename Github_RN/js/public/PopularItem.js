import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BaseItem from './BaseItem';

export default class PopularItem extends BaseItem {
    
    render() {
        const {projectModel} = this.props;
        const {item} = projectModel;
        if (!item || !item.owner) return null;

        // let favoriteButton = 
        //     <TouchableOpacity
        //         style={{padding: 2}}
        //         onPress={() => {

        //         }}
        //         underlayColor={'transparent'}
        //     >
        //         <FontAwesome 
        //             name={'star-o'}
        //             size={26}
        //             style={{color: 'red'}}
        //         />
        //     </TouchableOpacity>

        return (
            <TouchableOpacity onPress={this.props.onSelect}>
                <View style={styles.cell_container}>
                    <Text style={styles.title}>{item.full_name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text>Author:</Text>
                            <Image 
                                source={{uri:item.owner.avatar_url}}
                                style={{width:20, height: 20}}
                            />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                            <Text>Stars:</Text>
                            <Text>{item.stargazers_count}</Text>
                        </View>
                        {/* {favoriteButton} */}
                        {this._favoriteIcon()}
                    </View>
                </View>
        </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121',
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575',
    }
});