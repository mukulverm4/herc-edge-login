import React, { Component } from 'react';
import { Button, Platform, StyleSheet, Text, View, TouchableHighlight, Image, Picker, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import styles from '../assets/styles';
import { connect } from 'react-redux';
import { fetchBlock } from '../actions/EthActions';
import MagicButton from 'react-native-button';

class TrackAssetOptions extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        let headerStyles = StyleSheet.create({
            header__container: {
                display: "flex",
                height: 80,
                alignSelf: "center",
                flex: 1,
                alignContent: "center",
                alignItems: "center",
                marginTop: 40,
                paddingBottom: 20
            },
            header__container__centeredBox: {
                height: "100%",
                alignItems: "center",
                flexDirection: 'row'
            },
            header__text__box: {
                height: "100%",
                marginBottom: 5,
                marginLeft: 12,
            },
            header__image__box: {
                height: "100%",
                borderRadius: 100
            },
            assetHeaderLogo: {
                height: 35,
                width: 35,
                borderRadius: 50,
            },
            headerText: {
                fontFamily: "dinPro",
                fontSize: 26,
                alignSelf: "center",
                fontWeight: "bold",
                color: "black",
                textAlign: "center",
                marginTop: 2,
            },
        })

        return {
            headerTitle: (
              <View style={headerStyles.header__container}>
                <TouchableHighlight style={{ justifyContent: "center" }} onPress={() => navigation.navigate("MenuOptions")}>
                  <View style={headerStyles.header__container__centeredBox}>
                    <View style={headerStyles.header__image__box}>
                      <Image
                        style={headerStyles.assetHeaderLogo}
                        source={{ uri: params.logo }}
                      />
                    </View>
                    <View style={headerStyles.header__text__box}>
                      <Text style={headerStyles.headerText}>{params.name}</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              </View>
            )
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            tx: null,
        }
    }

    componentDidMount() {
        this._checkProps();
        this.props.fetchBlock();
    }

    _checkProps() {
        const { navigate } = this.props.navigation;
        if (this.props.asset.hasOwnProperty('transactions')) {
            this.setState({
                tx: <MagicButton style={localStyles.menuButton}

                    onPress={() => navigate('TxSwiperContainer', { name: this.props.name, logo: this.props.logo })}>
                    Transaction Swiper
                </MagicButton>
            })
        }
        else {
            this.setState({ tx: <Text style={styles.noTransLabel}>No Transactions</Text> });
        }
    }

    _onPress = () => {
        console.log('TrackAssetOptions: pressing blockscanner in TrackAssetOptions')
        const { navigate } = this.props.navigation;
        // this.props.fetchBlock();
        navigate('BlockScanner', { name: this.props.asset.Name, logo: this.props.asset.Logo })
    }




    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style={[styles.containerCenter, { paddingTop: 25 }]}>
                    {this.state.tx}

                    {/* <Button title={'Transaction Viewer'} onPress={() => navigate('TxSwiperContainer', { name: this.props.name, logo: this.props.logo })} /> */}

                    <MagicButton styles={localStyles.menuButton} onPress={this._onPress}>Block Scanner</MagicButton>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    asset: state.AssetReducers.selectedAsset,
    name: state.AssetReducers.selectedAsset.Name,
    logo: state.AssetReducers.selectedAsset.Logo,
});

const mapDispatchToProps = (dispatch) => ({
    fetchBlock: () => dispatch(fetchBlock())
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackAssetOptions);

const localStyles = StyleSheet.create({
    headerField: {
        flexDirection: "row",
        width: 200,
        justifyContent: "space-around",
        alignItems: "center"
    },
    hercLogoHeader: {
        height: 45,
        width: 45,
        borderRadius: 45 / 2,
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: 3,
    },
    registerHeaderText: {
        fontFamily: "dinPro",
        height: 50,
        fontSize: 30,
        alignSelf: "center",
        fontWeight: "bold",
        color: "black",
        textAlign: "center"
    },
    menuButton: {
        width: 200,
        height: 45,
        margin: 10,
        borderRadius: 2,
        color: "#f3c736"
    }
})
