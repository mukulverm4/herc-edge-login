import React, { Component } from 'react';
import { Modal, Platform, StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableHighlight, Alert, Button, ActivityIndicator, Linking } from 'react-native';
// import submit from "../components/buttons/submit.png"; // todo: turn into vector
import logo from "../assets/round.png";
import { connect } from "react-redux";
import styles from "../assets/styles";
import hercPillar from "../assets/hercLogoPillar.png";
import { incHercId, confirmAssetStarted, confirmAssetComplete, settingHeader, settingHeaderError } from "../actions/AssetActions"
import modalStyle from "../assets/confModalStyles";
import { TOKEN_ADDRESS, DEVELOPERS } from "../components/settings"
import BigNumber from 'bignumber.js';
import firebase from "../constants/Firebase";

class NewAssetConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            loading: false,
            confirmComplete: false,
            balance: 'madeupBalance',
            transactionId: null
        }
    }


    static navigationOptions = ({ navigation }) => {
        return {
            headerTitleStyle:
                { justifyContent: "space-around" },
            headerTitle: (
                <View style={localStyles.headerField}>
                    <Image
                        style={localStyles.hercLogoHeader}
                        source={logo}
                    />
                    <Text style={localStyles.registerHeaderText}>Register</Text>
                </View>
            )
        }
    }

    componentWillMount() {
        try {
          let balance = new BigNumber(this.props.watchBalance["HERC"])
          this.setState({ balance: balance.times(1e-18).toFixed(6) })
        } catch(e) {
          if (this.props.wallet.balances['HERC']) {
            let balance =  new BigNumber(this.props.wallet.balances['HERC'])
            this.setState({ balance: balance.times(1e-18).toFixed(6) })
          }
          else {
            let balance =  new BigNumber('0')
            this.setState({ balance: balance.times(1e-18).toFixed(6) })
          }
        }
        this.setState({
            hercId: this.props.hercId
        })
        // if (this.props.dataFlags.confirmStarted) {
        //     this.setState({ loading: true })
        // }
    }
    // componentWillMount() {
    //     // debugger
    //     console.log(this.props.dataFlags, "chance repeat")
    //     if (this.props.dataFlags.confAssetComplete) {
    //         this.setState({ confirmComplete: true })
    //         //   this.props.navigation.navigate('MenuOptions')
    //     }
    // }

    _changeModalVisibility = (visible) => {
        this.setState({
            modalVisible: visible
        })
    }

    async uploadImageAsync(uri) {
        const { navigate } = this.props.navigation;
        let newAsset = this.props.newAsset;
        const response = await fetch(uri);
        const blob = await response.blob();

        let logoLocation = firebase.storage().ref('assets')
            .child(this.props.edgeAccount)
            .child(newAsset.Name)
            .child("Logo");

        let assetLocation = firebase.database().ref('assets')
            .child(this.props.edgeAccount);

        const snapshot = await logoLocation.put(blob);
        let downloadURL = snapshot.downloadURL;
        let fbAsset, ipfsAsset;


        ipfsAsset = Object.assign({}, {
            Name: newAsset.Name,
            CoreProps: newAsset.CoreProps,
            hercId: this.props.hercId,
        });

        fbAsset = {
            hercId: this.props.hercId,
            Name: newAsset.Name,
            Logo: downloadURL,
            Password: newAsset.Password
        }

        console.log("Right before sending to send_trans: jm", ipfsAsset, fbAsset)

        this.props.settingHeader(fbAsset);
        this.props.confirmAssetStarted(ipfsAsset);
        this.props.incHercId(this.props.hercId);
    }
    _sendNewAsset(){
      this._changeModalVisibility(true);
      if (this.props.newAsset.Logo) {
          this.uploadImageAsync(this.props.newAsset.Logo.uri)
      } else {
        let newAsset = this.props.newAsset;
        let fbAsset, ipfsAsset;

        ipfsAsset = Object.assign({}, {
            Name: newAsset.Name,
            CoreProps: newAsset.CoreProps,
            hercId: this.props.hercId,
        });

        fbAsset = {
            hercId: this.props.hercId,
            Name: newAsset.Name,
            // Logo: downloadURL,
            Password: newAsset.Password
        }

        console.log("Right before send_trans: jm\n", ipfsAsset, fbAsset)

        this.props.settingHeader(fbAsset);
        this.props.confirmAssetStarted(ipfsAsset);
        this.props.incHercId(this.props.hercId);

        // this.props.confirmAssetStarted(this.props.newAsset); // Non-Logo makes malformed assets
        const { navigate } = this.props.navigation;
        navigate('MenuOptions');
      }
    }

    async _checkBalance(){
      if (DEVELOPERS.includes(this.props.edgeAccount)){
        // this is a developer
        console.log("You are a developer. jm")
        this._sendNewAsset()
      } else {
        console.log("jm checkbalance()", this.state.balance)
        debugger;
        // this is a non-developer
        console.log("You are NOT a developer. jm")
        let price = new BigNumber(1000)
        let balance = new BigNumber(this.state.balance)
        let newbalance = balance.minus(price)

        console.log('do you have enough?', newbalance.isPositive())

        if (newbalance.isNegative()){
          Alert.alert(
            'Insufficient Funds',
            'Current Balance: '+ this.state.balance + ' HERC' ,
            [
              {text: 'Top Up Hercs', onPress: () => Linking.openURL("https://purchase.herc.one/"), style: 'cancel'},
              {text: 'Ok', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: true }
          )
        } else {
          Alert.alert(
            'You Meet the Minimum Balance!',
            'Current Balance:'+ this.state.balance + ' HERC \n Do you wish to proceed?' ,
            [
              {text: 'Cancel', onPress: () => console.log('No Pressed'), style: 'cancel'},
              {text: 'Yes, Make an Asset', onPress: () => this._sendNewAsset()},
            ],
            { cancelable: false }
          )
        }
      }
    }


    _onPressSubmit() {
        Alert.alert(
          'Minimum Balance Requirement: 1000 HERC',
          'Current Balance: \n'+ this.state.balance + ' HERC \nDo you wish to check if your balance meets the minimum requirement?' ,
          [
            {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
            {text: 'Yes', onPress: () => {this._checkBalance()} },
          ],
          { cancelable: false }
        )
    }


    _goToMenu = () => {
        const { navigate } = this.props.navigation;
        this._changeModalVisibility(false);
        navigate('MenuOptions');

    }
    render() {
        const { navigate } = this.props.navigation;
        let price = this.state.fctPrice;
        let hercId = this.props.hercId;
        let newAsset = this.props.newAsset;
        let Logo, list;
        let Name = newAsset.Name;
        let password = this.props.newAsset.Password

        if (newAsset.Logo) {
            Logo = (<Image style={styles.assetHeaderImage} source={{ uri: newAsset.Logo.uri }} />);
        } else {
            Logo = (<Text style={styles.label}>No Image</Text>)
        }

        if (newAsset.hasOwnProperty('CoreProps')) {
            list = Object.getOwnPropertyNames(newAsset.CoreProps).map((x, i) => {
                let num = (i + 1);
                return (
                    <View key={i} style={localStyles.assetMetricInputField}>
                        <Text style={localStyles.text}>Metric: {num}</Text>
                        <Text style={localStyles.input}>{x}</Text>
                    </View>
                )
            })
        } else { list = (<Text style={styles.label}>No Properties</Text>) }




        return (
            <View style={styles.container}>
                <View style={styles.containerCenter}>

                    <Text style={styles.assetHeaderLabel}>{Name}</Text>
                    {Logo}
                    <Text style={styles.assetHeaderLabel}>HercID: {hercId}</Text>
                    <Text style={styles.assetHeaderLabel}>Password: {password}</Text>
                    <ScrollView style={{ paddingRight: 5, alignSelf: "center", width: "100%" }}>

                        {list}

                    </ScrollView>

                    <TouchableHighlight
                    style={[localStyles.button, { backgroundColor: 'white' }]}
                    onPress={this._onPressSubmit}>
                      <Text>Submit</Text>
                    </TouchableHighlight>

                    <View style={localStyles.newAssetFeeContainer}>
                        <Image style={localStyles.assetFeePillarLogo} source={hercPillar} />
                        <Text style={localStyles.assetFeePrice}>1,000</Text>
                    </View>

                </View>
                <Modal
                    transparent={false}
                    animationType={'none'}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { console.log("modal closed") }}
                >
                    <View style={modalStyle.container}>
                        <View style={modalStyle.modalBackground}>
                        <View style={modalStyle.closeButtonContainer}>
                            <TouchableHighlight
                              style={modalStyle.closeButton}
                              onPress={() => this._changeModalVisibility(false)}>
                            <Text style={{ margin: 5, fontSize: 30, color: '#00000070'} }>X</Text>
                            </TouchableHighlight>
                        </View>
                            {!this.props.dataFlags.confirmAssetComplete &&
                                <Text style={modalStyle.wordsText}>Your Asset Information Is Being Written To The Blockchain. {"\n"}This may take a while. Please be patient. At this point, you cannot cancel the transaction. You may return to Main Menu if you wish.</Text>
                            }

                            <View style={modalStyle.activityIndicatorWrapper}>
                                <ActivityIndicator
                                    animating={this.props.dataFlags.confirmStarted} size="large" color="#091141" />
                            </View>

                            {this.props.dataFlags.confAssetComplete &&
                                <View>
                                    <Text style={modalStyle.wordsText}>Your Transaction Has Completed!</Text>
                                    <TouchableHighlight
                                      style={modalStyle.modalButton}
                                      onPress={() => this._goToMenu()}>
                                    <Text style={{ margin: 5} }>Back to Menu</Text>
                                    </TouchableHighlight>
                                </View>
                            }

                        </View>
                    </View>
                </Modal>
            </View>



        )
    }


}
const mapStateToProps = (state) => ({
    newAsset: state.AssetReducers.newAsset,
    hercId: state.AssetReducers.hercId,
    edgeAccount: state.WalletActReducers.edge_account,
    wallet: state.WalletActReducers.wallet,
    dataFlags: state.AssetReducers.dataFlags,
    watchBalance: state.WalletActReducers.watchBalance,
});

const mapDispatchToProps = (dispatch) => ({
    settingHeader: (fbHead) => {
        dispatch(settingHeader(fbHead))
    },
    confirmAssetStarted: (asset) =>
        dispatch(confirmAssetStarted(asset)),
    confirmAssetComplete: () =>
        dispatch(confirmAssetComplete()),

    incHercId: (hercid) =>
        dispatch(incHercId(hercid))
})

export default connect(mapStateToProps, mapDispatchToProps)(NewAssetConfirm);


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
    assetMetricInputField: {
        height: 40,
        flexDirection: "row",
        width: "100%",
        borderColor: "blue",
        justifyContent: "space-between",
        margin: 5,
        marginTop: 10,
        marginBottom: 10
    },
    text: {
        color: "white",
        alignSelf: "center",
        fontSize: 16,
        fontWeight: "normal",
        margin: 5,
        fontFamily: "dinPro"
    },
    input: {
        width: "53%",
        height: 24,
        textAlign: "center",
        backgroundColor: "#ffffff",
        fontSize: 16,
        fontWeight: "200",
        borderColor: "blue",
        color: "black",
        borderWidth: 1,
        alignSelf: "center",
        borderRadius: 3
    },
    imageButtons: {
        height: 40,
        width: 175,
        resizeMode: "contain",
        alignSelf: "center",
        margin: 7
    },
    newAssetFeeContainer: {
        height: 50,
        width: 125,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    assetFeePillarLogo: {
        height: 40,
        width: 30,
        backgroundColor: "#091141",
        resizeMode: "contain",
    },
    assetFeePrice: {
        backgroundColor: "#091141",
        textAlign: "center",
        fontSize: 20.2,
        fontWeight: "400",
        color: "white",
        height: 30
    },
    wordsText: {
        height: 23,
        fontSize: 20,
        fontWeight: "600",
        color: "white"
    },
    yellowText: {
        height: 23,
        fontSize: 20,
        fontWeight: "600",
        color: "yellow"
    },
    button: {
      width: 80,
      borderColor: "black",
      borderWidth: 2,
      padding: 5,
      justifyContent: "center",
      alignItems: "center",
    }


})
