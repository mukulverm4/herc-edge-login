import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    TouchableHighlight,
    StatusBar,
    Alert,
    Linking,
    YellowBox,
    PermissionsAndroid
} from "react-native";
import { StackNavigator } from "react-navigation";
import hiprBtn from "../components/buttons/validate.png";
import supplyChain from "../components/buttons/supplyChainButton.png";
import track from "../components/buttons/trackButton.png";
import wallet from "../components/buttons/walletButton.png";
import settings from "../components/buttons/settingsButton.png";
import registerAsset from "../components/buttons/registerAssetButton.png"
import profileButton from "../components/buttons/profileButton.png"
import documentButton from "../components/buttons/document.png"

import styles from "../assets/styles";
import { connect } from "react-redux";
import { getHercId, getAssets, clearState } from "../actions/AssetActions";
import { getOrganization } from "../actions/WalletActActions";
import { VERSION } from '../components/settings.js'
import store from "../store";
import Wallet from "./Wallet";
import firebase from '../constants/Firebase';
const rootRef = firebase.database().ref();
import Geolocation from 'react-native-geolocation-service';


class MenuOptions extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerLeft: <View style={styles.backArrow} ></View>
    })


    componentWillMount() {
        this._requestFineLocationPermission();
        // should move the next 3 actions into Login.js
        // this.props.getHercId();
        // this.props.getAssets(this.props.username);
        // this.props.getOrganization();

        let alertLatestVersion = this.props.navigation.getParam('alertLatestVersion', 'false')

        // if alertLatestVersion is true, trigger alert.
        if (alertLatestVersion &&  alertLatestVersion == true) {
          Alert.alert(
            'You\'re not on the latest version!',
            'Download the latest version to get the best experience.' ,
            [
              {text: 'No, thanks!', onPress: () => console.log('OK Pressed'), style: 'cancel'},
              {text: 'Download Latest APK', onPress: () => Linking.openURL("https://github.com/hercone/herc-edge-login/releases")},
            ],
            { cancelable: true }
          )
        }
    }


    _requestFineLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Herc Enable Location",
            message:
              "Herc needs access to your location " +
              "to provide attestation of your supply chain data."
          }
        );
        if (granted){
          Geolocation.getCurrentPosition(
            (position) => {
              console.log("jm Geolocation Position:", position);
            },
            (error) => {
              console.log("jm Geolocation Error: ", error.code, error.message);
            }
          );
        }
        return granted;
      } catch (err) {
        console.error("Failed to request permission: jm", err);
        return null;
      }
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={[styles.containerCenter, { justifyContent: "space-around" }]}>

                    <View style={localStyles.touchableHighlight}>
                        <TouchableHighlight onPress={() => navigate('NewAssetLanding')}>
                            <Image style={localStyles.menuButton} source={registerAsset} />
                        </TouchableHighlight>
                    </View>

                    <TouchableHighlight disabled={!this.props.assets} style={localStyles.touchableHighlight}
                    onPress={() => navigate("SupplyChainAssetList")}>
                      <Image style={localStyles.menuButton} source={supplyChain} />
                    </TouchableHighlight>


                    <TouchableHighlight disabled={!this.props.assets} style={localStyles.touchableHighlight}
                        onPress={() => navigate("TrackAssetList")}>
                        <Image style={localStyles.menuButton} source={track} />
                    </TouchableHighlight>

                  {/*  <TouchableHighlight style={localStyles.touchableHighlight} onPress={() => navigate("HiprLanding")}>
                        <Image style={localStyles.menuButton} source={hiprBtn} />
                    </TouchableHighlight> */}


                    <TouchableHighlight disabled={!this.props.wallet} style={localStyles.touchableHighlight} onPress={() => navigate("Wallet")}>
                        <Image style={localStyles.menuButton} source={wallet} />
                    </TouchableHighlight>

                    {/*                    <TouchableHighlight style={localStyles.touchableHighlight} onPress={() => navigate("Profile")}>
                        <Image style={localStyles.menuButton} source={profileButton} />
                    </TouchableHighlight> */}

                    <TouchableHighlight style={localStyles.touchableHighlight} onPress={() => navigate("DocumentStorage")}>
                        <Image style={localStyles.menuButton} source={documentButton} />
                    </TouchableHighlight>

                    <Text style={{ color: "#f3c736", alignSelf: "flex-end", fontSize: 8 }}>
                        V.{VERSION}
                    </Text>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    username: state.AssetReducers.edge_account,
    assets: state.AssetReducers.assets,
    wallet: state.WalletActReducers.wallet,
})

const mapDispatchToProps = dispatch => ({
    getHercId: () => dispatch(getHercId()),
    getAssets: (name) => dispatch(getAssets(name)),
    getOrganization: () => dispatch(getOrganization()),
    clearState: () => dispatch(clearState())
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuOptions);

const localStyles = StyleSheet.create({
    touchableHighlight: {
        width: 200,
        height: 60,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    menuButton: {
        height: 60,
        width: 200,
        resizeMode: "contain",
        // borderRadius: 2,
    }
})
