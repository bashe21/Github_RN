import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import NavigatorBar from '../public/NavigatorBar';
import ViewUtils from '../util/ViewUtils';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DeviceInfo from 'react-native-device-info';
import NavigationUtils from '../util/NavigationUtils';
import {WebView} from 'react-native-webview';
import FavoriteDao from '../dao/expand/FavoriteDao';
import {FLAG_STORAGE} from '../dao/expand/DataStorage';
import {connect} from 'react-redux';
import SafeAreaViewPlus from '../public/SafeAreaViewPlus';

const THEME_COLOR = '#678';

class WebViewPage extends React.Component {
    constructor(props) {
        super(props);
        const {projectMode, flag} = props.route.params;
        const {title, url} = props.route.params;
        this.state = {
            title: title,
            url: url,
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


    render() {
        const {theme} = this.props;

        let navigatorBar = <NavigatorBar 
            title = {this.state.title}
            style = {theme.styles.navBar}
            leftButton = {ViewUtils.getLeftBackButton(() => this.onBack())}
        />;   

        return (
            <SafeAreaViewPlus
                topColor = {theme.themeColor}
            >
                {navigatorBar}
                <WebView 
                    ref = {webView => this.webView = webView}
                    startInLoadingState = {true}
                    onNavigationStateChange = {e => this.onNavigationStateChange(e)}
                    source = {{uri: this.state.url}}
                />
            </SafeAreaViewPlus>
            // <View style={styles.container}>
                
            // </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //marginTop: DeviceInfo.hasNotch() ? 30 : 0,
    },
});

const mapStateToProps = state => ({
    theme: state.theme.theme,
});

export default connect(mapStateToProps)(WebViewPage);