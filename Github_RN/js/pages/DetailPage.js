import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet, WebView} from 'react-native';
import NavigatorBar from '../public/NavigatorBar';
import ViewUtils from '../util/ViewUtils';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DeviceInfo from 'react-native-device-info';

const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#678';

export default class DetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = props.navigation.state.params;
        const {projectMode} = this.params;
        this.url = projectMode.html_url || (TRENDING_URL + projectMode.fullName);
        const title = projectMode.full_name || projectMode.fullName;
        this.state = {
            title: title,
            url: this.url,
            canGoBack: false,
        }
    }
    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {

        }
    }

    onNavigationStateChange(navSate) {
        this.setState({
            canGoBack: navSate.canGoBack,
            url: navSate.url,
        });
    } 

    renderRightButton(callback) {
        return (
            <View style = {{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {

                    }}
                >
                    <FontAwesome 
                        name = {'star-o'}
                        size = {20}
                        style = {{color: 'white', marginRight: 10}}
                    />
                    {ViewUtils.getLeftShareButton(() => {

                    })}
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        let navigatorBar = <NavigatorBar 
            title = {this.state.title}
            leftButton = {ViewUtils.getLeftBackButton(() => this.onBack())}
            style = {{backgroundColor: THEME_COLOR}}
            rightButton = {this.renderRightButton(() => {

            })}
        />;   

        return (
            <View style={styles.container}>
                {navigatorBar}
                <WebView 
                    ref = {webView => this.webView = webView}
                    startInLoadState = {true}
                    onNavigationStateChange = {e => this.onNavigationStateChange(e)}
                    source = {{uri: this.state.url}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: DeviceInfo.hasNotch() ? 30 : 0,
    },
    
    
})