
import React from 'react';
import {BackHandler, Platform, View, Image, Text, Dimensions, StyleSheet} from 'react-native';
import NavigationUtils from '../../util/NavigationUtils';
import BackPressComponent from '../BackPressComponent';
import config from '../../res/data/config'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import GlobalStyles from '../../res/style/GlobalStyles';
import ViewUtils from '../../util/ViewUtils';

const THEME_COLOR = '#678';
consnt = AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 270;
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios + 20 : GlobalStyles.nav_bar_height_android;
const window = Dimensions.get('window');

export default class AboutCommon {
    constructor(props, updateState) {
        //super(props);
        this.props = props;
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
        this.updateState = updateState;
        this.updateState({
            config,
        })
    }

    onBackPress() {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    }

    componentDidMount() {
        this.backPress.componentDidMount();
        //http://www.devio.org/io/GitHubPopular/json/github_app_config.json
        const url = 'http://www.devio.org/io/GitHubPopular/json/github_app_config.json';
        fetch(url).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network Error');
        }).then(config => {
            if (config) {
                this.updateState({
                    data: config,
                });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    onShare() {

    }

    getParallaxrenderConfig(params) {
        let config = {};
        config.renderBackground = () => (
            <View key="background">
                <Image source={{uri: params.backgroundImg,
                                width: window.width,
                                height: PARALLAX_HEADER_HEIGHT}}/>
                <View style={{position: 'absolute',
                              top: 0,
                              width: window.width,
                              backgroundColor: 'rgba(0,0,0,.4)',
                              height: PARALLAX_HEADER_HEIGHT}}/>
            </View>
        );

        let avatar = typeof(params.avatar) === 'string' ? {uri: params.avatar} : params.avatar;
        config.renderForeground = () => (
            <View key="parallax-header" style={ styles.parallaxHeader }>
                <Image style={ styles.avatar } source={avatar}/>
                <Text style={ styles.sectionSpeakerText }>
                  {params.name}
                </Text>
                <Text style={ styles.sectionTitleText }>
                  {params.description}
                </Text>
            </View>
        );

        config.renderStickyHeader = () => (
            <View key="sticky-header" style={styles.stickySection}>
              <Text style={styles.stickySectionText}>{params.name}</Text>
            </View>
          )

          config.renderFixedHeader = () => (
            <View key="fixed-header" style={styles.fixedSection}>
              {ViewUtils.getLeftBackButton(() => {
                  NavigationUtils.goBack(this.props.navigation);
              })}
              {ViewUtils.getLeftShareButton(() => this.onShare())}
            </View>
          )

        return config;
    }

    render(contentView, params) {
        const renderConfig = this.getParallaxrenderConfig(params);
        return (
            <ParallaxScrollView
              backgroundColor={THEME_COLOR}
              contentBackgroundColor={GlobalStyles.backgroundColor}
              parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
              stickyHeaderHeight={STICKY_HEADER_HEIGHT}
              backgroundScrollSpeed={10}
              {...renderConfig}
              >
                  {contentView}
            </ParallaxScrollView>
          );
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black'
    },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: window.width,
      height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
      height: STICKY_HEADER_HEIGHT,
      width: 300,
      justifyContent: 'flex-end'
    },
    stickySectionText: {
      color: 'white',
      fontSize: 20,
      margin: 10
    },
    fixedSection: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      paddingRight: 8,
      paddingTop: Platform.OS === 'ios' ? 20 : 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    fixedSectionText: {
      color: '#999',
      fontSize: 20
    },
    parallaxHeader: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'column',
      paddingTop: 100
    },
    avatar: {
      marginBottom: 10,
      borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
      color: 'white',
      fontSize: 24,
      paddingVertical: 5,
      marginBottom: 10,
    },
    sectionTitleText: {
      color: 'white',
      fontSize: 16,
      marginLeft: 10,
      marginRight: 10,
    },
  });