import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import NavigatorBar from '../public/NavigatorBar';
import ViewUtils from '../util/ViewUtils';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DeviceInfo from 'react-native-device-info';
import NavigationUtils from '../util/NavigationUtils';
import {WebView} from 'react-native-webview';

const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#678';

export default class DetailPage extends React.Component {
    constructor(props) {
        super(props);
        const {projectMode} = props.route.params;
        this.url = projectMode.html_url || projectMode.repo_link;
        const title = projectMode.full_name || projectMode.repo;
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
            NavigationUtils.goBack(this.props.navigation);
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
            <View>
                <TouchableOpacity
                    onPress={() => {

                    }}
                    style = {{flexDirection: 'row'}}
                >
                    <FontAwesome 
                        name = {'star-o'}
                        size = {20}
                        style = {{color: 'white', marginRight: 15}}
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
                    startInLoadingState = {true}
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
        //marginTop: DeviceInfo.hasNotch() ? 30 : 0,
    },
    
    
})