import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    TouchableHighlight,
    ScrollView,
    Alert,
    Clipboard,
    Dimensions
} from "react-native";
import React from "react";
import hercCoin from "../assets/icons/hercCoin.png";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import BigNumber from "bignumber.js";
import QRCode from "react-qr-code";
import Modal from "react-native-modal";
import CustomModal from "../components/CustomModal";
import { RNCamera } from "react-native-camera";


///////  All this wallet balance stuff,
class Wallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sendDestination: "",
            sendAmount: "",
            displayWallet: "",
            availableTokens: [],
            sendCrypto1ModalVisible: false,
            sendCrypto2ModalVisible: false,
            sendCrypto3ModalVisible: false,
            selectedCrypto: "HERC",
            receiveModalVisible: false,
            transactions: [],
            displayTransactions: true,
            QRModalVisible: false,
            successModalVisible: false,
            errorModalVisible: false,
            windowHeight:0,

        };
    }




    static navigationOptions = () => ({
        headerTitle: (
            <View style={localStyles.headerBox}>
                <Text style={localStyles.headerText}>Wallet</Text>
            </View>
        )
    });

    componentDidMount = async () => {
        if (!this.props.watchBalance || !this.props.watchBalance.ETH) {
            let light = await this.props.wallet.getEnabledTokens();
            let enabledTokens = light.reverse();
            console.log("###########" + enabledTokens);
            this.setState(
                {
                    availableTokens: enabledTokens,
                    displayWallet: enabledTokens[0] // initiate with HERC wallet
                },
                () => this._updateWallet()
            );
        } else {
            let enabledTokens = Object.keys(this.props.watchBalance).reverse();
            console.log("###########" + enabledTokens);
            this.setState(
                {
                    availableTokens: enabledTokens,
                    displayWallet: enabledTokens[0] // initiate with HERC wallet
                },
                () => this._updateWallet()
            );
        }

        this._getActivity(this.props.ethereumAddress, this.state.displayWallet);
        this.setState({windowHeight:Dimensions.get('window').height})

    };

    _requestCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === "granted"
        });
    };

    _handleBarCodeRead = data => {
        this.setState({ QRModalVisible: false })
        this.setState({ sendDestination: data.data.substring(9) })
    }

    _updateWallet = () => {
        if (!this.props.watchBalance || !this.props.watchBalance.ETH) {
            let displayWallet = this.state.displayWallet;
            console.log("Display Wallet: ", this.props.wallet.balances[displayWallet])
            let tempBalance = new BigNumber(this.props.wallet.balances[displayWallet])
                .times(1e-18)
                .toFixed(6);

            console.log(tempBalance, "***temp balance***")
            return tempBalance;
            // return "0.000000"; //don't assume it is 0
        } else {
            let displayWallet = this.state.displayWallet;
            let tempBalance = new BigNumber(this.props.watchBalance[displayWallet])
                .times(1e-18)
                .toFixed(6);
            return tempBalance;
        }

    };
    async _onPressSend() {
        console.log("here");
        const wallet = this.props.wallet;
        let sendDestination = this.state.sendDestination;
        let sendAmountInEth = new BigNumber(this.state.sendAmount);
        if (!sendDestination) Alert.alert("Missing Destination Address");
        if (!sendAmountInEth) Alert.alert("Invalid Send Amount");
        let sendAmountInWei = sendAmountInEth.times(1e18).toString();

        const abcSpendInfo = {
            networkFeeOption: "standard",
            currencyCode: "HERC",
            metadata: {
                name: "Transfer From Herc Wallet",
                category: "Transfer:Wallet:College Fund"
            },
            spendTargets: [
                {
                    publicAddress: sendDestination,
                    nativeAmount: sendAmountInWei
                }
            ]
        };
        try {
            let abcTransaction = await this.props.wallet.makeSpend(abcSpendInfo);
            await wallet.signTx(abcTransaction);
            await wallet.broadcastTx(abcTransaction);
            await wallet.saveTx(abcTransaction);
            Alert.alert(
                "Transaction ID",
                abcTransaction.txid,
                [
                    {
                        text: "Copy",
                        onPress: () => this.writeToClipboard(abcTransaction.txid),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
            this._resetSendState();
            this._toggleSendCrypto3();
            this._toggleSuccessModal();
        } catch (e) {
            this._toggleErrorModal();
        }
        // TODO: after successful transaction, reset state.

    }

    _resetSendState = () => {
        this.setState({ sendAmount: 0, sendDestination: "", })
    }

    writeToClipboard = async data => {
        await Clipboard.setString(data);
        Alert.alert("Copied to Clipboard!", data);
    };

    _toggleSendCrypto1 = () => {
        this.setState({
            sendCrypto1ModalVisible: !this.state.sendCrypto1ModalVisible
        })
    }
    _toggleSendCrypto2 = () => {
        this.setState({
            sendCrypto2ModalVisible: !this.state.sendCrypto2ModalVisible
        })
    }
    _toggleSendCrypto3 = () => {
        this.setState({
            sendCrypto3ModalVisible: !this.state.sendCrypto3ModalVisible
        })
    }

    _toggleReceiveModal = () => {
        this.setState({
            receiveModalVisible: !this.state.receiveModalVisible
        })
    }

    _toggleQRModal = () => {
        this.setState({
            QRModalVisible: !this.state.QRModalVisible
        })
    }
    _toggleSuccessModal = () => {
        this.setState({
            successModalVisible: !this.state.QRModalVisible
        })
    }

    _toggleErrorModal = () => {
        this.setState({
            errorModalVisible: !this.state.QRModalVisible
        })
    }


    _displayChangeCurreny = () => {
        if (this.state.displayWallet === "HERC") {
            return (
                <View style={localStyles.changeCurrencyContainer}>
                    <Icon name="ethereum" size={16} />
                    <Text style={localStyles.changeCurrencyText}> ETH</Text>
                </View>
            )
        }
        else {
            return (
                <View style={localStyles.changeCurrencyContainer}>
                    <Image style={localStyles.smallIcon} source={hercCoin} />
                    <Text style={localStyles.changeCurrencyText}> HERC</Text>
                </View>
            )

        }

    }

    _selectCrypto = (crypto) => {
        this.setState({
            selectedCrypto: crypto
        })
    }

    _displayActivity = (transaction, index) => {
        if (transaction.from === this.props.ethereumAddress) {
            activityType = "Sent";
        } else if (transaction.to === this.props.ethereumAddress) {
            activityType = "Received"
        }
        var t = new Date(transaction.timestamp * 1000).toString();
        var formattedTime = t.substr(4, 17);
        return (
            <View key={index} style={[localStyles.displayActivityContainer,
            this.state.displayTransactions ? localStyles.displayFlex : localStyles.displayNone,
            index % 2 === 0 ? localStyles.displayActivityContainerBG1 : localStyles.displayActivityContainerBG2]}>
                <Icon style={[{ flex: 1, alignSelf: "center" }]} name={activityType === "Sent" ? "arrow-top-right" : "arrow-bottom-left"} size={32} color={activityType === "Sent" ? "#f5565b" : "#95c260"} />
                <View style={{ flex: 4 }}>
                    <Text style={{ color: "#9398b2" }}>{activityType} {this.state.displayWallet}</Text>
                    <Text style={{ fontWeight: 'bold' }}>{transaction.value} {this.state.displayWallet}</Text>
                </View>
                <Text style={{ flex: 3, color: "#9398b2", fontSize: 12, textAlign: "right" }}>{formattedTime}</Text>
            </View>
        )
    }

    _getActivity = (address, token) => {
        let hercAddress = "0x6251583e7d997df3604bc73b9779196e94a090ce";
        let api = "";
        if (token === "ETH") {
            api = "http://api.ethplorer.io/getAddressTransactions/" + address + "?apiKey=freekey";;
        } else if (token = "HERC") {
            api = "http://api.ethplorer.io/getAddressHistory/" + address + "?apiKey=freekey&token=" + hercAddress;
        }

        fetch(api)
            .then((response) => response.json())
            .then((responseJson) => {
                if (token === "ETH") {
                    this.setState({
                        transactions: responseJson,
                        displayTransactions: true
                    })
                }
                else if (token === "HERC") {
                    this.setState({
                        transactions: responseJson.operations,
                        displayTransactions: true
                    })
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    _changeCurrency = async () => {
        await this.setState({ displayTransactions: false, displayWallet: this.state.displayWallet === "HERC" ? "ETH" : "HERC" }, () => this._updateWallet());
        this._getActivity(this.props.ethereumAddress, this.state.displayWallet);
    }

    _getUSDConversion = () => {
        let api = "https://api.coinmarketcap.com/v1/ticker/"
        if (this.state.selectedCrypto === "HERC") {
            hercApi = api + "hercules/"
            console.log("####"+hercApi)
            fetch(hercApi).then((response) => response.json())
                .then((responseJson) => {
                    this.setState({USDAmount:(responseJson[0].price_usd*this.state.sendAmount).toFixed(2)})
                });

        } else if (this.state.selectedCrypto === "ETH") {
            ethApi = api + "ethereum/"
            fetch(ethApi).then((response) => response.json())
                .then((responseJson) => {
                    this.setState({USDAmount:(responseJson[0].price_usd*this.state.sendAmount).toFixed(2)})
                });
        }
    }





    render() {
        let currencyValue = this._updateWallet();


        return (

            <View style={localStyles.walletContainer}>

                <View style={localStyles.balanceWrapperContainer}>
                    <View style={localStyles.balanceContainer}>
                        <View style={localStyles.balanceInnerContainer}>
                            <View style={localStyles.balanceInnerLeftContainer}>
                                <Text style={localStyles.balanceLabelText}>Your Balance</Text>
                                <View style={{ flexDirection: "row", alignItems: "center", }}>
                                    <Text style={localStyles.balanceText}>{currencyValue}   </Text>
                                    {this.state.displayWallet === "HERC" ? <Image style={localStyles.mediumIcon} source={hercCoin} /> : <Icon name="ethereum" size={24} />}
                                </View>
                            </View>
                            <View style={localStyles.balanceInnerRightContainer}>
                                <Text style={[localStyles.balanceLabelText, { alignSelf: "center" }]}>Choose</Text>
                                <TouchableHighlight onPress={() => { this._changeCurrency() }}>
                                    {this._displayChangeCurreny()}
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={localStyles.activityContainer}>
                    <Text>Activity</Text>
                    <ScrollView>
                        {typeof this.state.transactions !== 'undefined' ? this.state.transactions.map((transaction, index) => (this._displayActivity(transaction, index))) : null}

                    </ScrollView>
                </View>
                <View style={localStyles.actionsContainer}>
                    <TouchableHighlight style={[localStyles.actionButton, { backgroundColor: "#95c260" }]}
                        onPress={this._toggleSendCrypto1}>
                        <Text style={localStyles.actionButtonText}>Send</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={[localStyles.actionButton, { backgroundColor: "#f5565b" }]}
                        onPress={this._toggleReceiveModal}>
                        <Text style={localStyles.actionButtonText}>Receive</Text>
                    </TouchableHighlight>
                </View>

                <Modal
                    isVisible={this.state.sendCrypto1ModalVisible}
                    onBackButtonPress={() => { this._toggleSendCrypto1(); this._resetSendState() }}
                    onBackdropPress={() => { this._toggleSendCrypto1(); this._resetSendState() }}
                    style={{ margin: 0 }}
                >

                    <View style={modalStyles.modalLower}>
                        <View style={[modalStyles.sendCryptoContainer,{height:this.state.windowHeight*0.4}]}>
                            <View style={modalStyles.modalHeadingContainer}>

                                <View style={modalStyles.modalHeading}>

                                    <Text style={modalStyles.menuTitle}>Send Cryptocurrency</Text>
                                    <Text style={modalStyles.menuSubtitle}>Choose Cryptocurrency</Text>
                                </View>


                            </View>

                            <View style={modalStyles.send1LowerContainer}>
                                <View style={modalStyles.selectCryptoIconContainer}>
                                    <TouchableHighlight onPress={() => this._selectCrypto("HERC")} >
                                        <View style={[modalStyles.cryptoIconContainer, this.state.selectedCrypto === "HERC" ? modalStyles.selectedCryptoIconBackground : modalStyles.unselectedCryptoIconBackground]}>
                                            <Image style={localStyles.bigIcon} source={hercCoin} />

                                        </View>
                                    </TouchableHighlight>
                                    <Text style={[modalStyles.cryptoText, this.state.selectedCrypto === "HERC" ? modalStyles.selectedCryptoTextColor : modalStyles.unselectedCryptoTextColor]}>HERC</Text>
                                </View>

                                <View style={modalStyles.selectCryptoIconContainer}>
                                    <TouchableHighlight onPress={() => this._selectCrypto("ETH")}>
                                        <View style={[modalStyles.cryptoIconContainer, this.state.selectedCrypto === "ETH" ? modalStyles.selectedCryptoIconBackground : modalStyles.unselectedCryptoIconBackground]}>
                                            <Icon name="ethereum" size={48} />
                                        </View>
                                    </TouchableHighlight>
                                    <Text style={[modalStyles.cryptoText, this.state.selectedCrypto === "ETH" ? modalStyles.selectedCryptoTextColor : modalStyles.unselectedCryptoTextColor]}>ETH</Text>
                                </View>

                            </View>

                            <TouchableHighlight onPress={() => { this._toggleSendCrypto1(); this._toggleSendCrypto2() }} style={localStyles.nextButton}>
                                <Text style={localStyles.bigButtonText}>Next</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>


                <Modal
                    isVisible={this.state.sendCrypto2ModalVisible}
                    onBackButtonPress={() => { this._toggleSendCrypto2(); this._toggleSendCrypto1(); }}
                    onBackdropPress={() => { this._toggleSendCrypto2(); this._resetSendState() }}
                    style={{ margin: 0 }}

                >
                    <Modal isVisible={this.state.QRModalVisible}
                        onBackButtonPress={this._toggleQRModal} onBackdropPress={this._toggleQRModal}
                    >
                        <View style={{ backgroundColor: "#ffffff", borderRadius: 10, height: "50%", justifyContent: "center", alignItems: "center" }}>
                            <View style={{ flexDirection: "row", width: "90%" }}>
                                <TouchableHighlight onPress={this._toggleQRModal} style={{ justifyContent: "center", }}>
                                    <Icon name="arrow-left" size={26} />
                                </TouchableHighlight>
                                <View style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly" }}>

                                    <Text style={modalStyles.menuTitle}>Scan QR</Text>

                                </View>
                                <TouchableHighlight style={{ justifyContent: "center", }}>
                                    <Icon name="arrow-right" size={26} color="#ffffff" />
                                </TouchableHighlight>

                            </View>
                            <RNCamera
                                barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                                flashMode={RNCamera.Constants.FlashMode.on}
                                style={{ width: "90%", height: "80%", borderRadius: 10 }}
                                onBarCodeRead={this._handleBarCodeRead}
                                ref={cam => (this.camera = cam)}
                            >
                            </RNCamera>
                        </View>

                    </Modal>

                    <View style={modalStyles.modalLower}>
                        <View style={[modalStyles.sendCryptoContainer,{height:this.state.windowHeight*0.4}]}>

                            <View style={modalStyles.modalHeadingContainer}>
                                <TouchableHighlight onPress={() => { this._toggleSendCrypto2(); this._toggleSendCrypto1() }} style={{ justifyContent: "center", }}>
                                    <Icon name="arrow-left" size={26} />
                                </TouchableHighlight>
                                <View style={modalStyles.modalHeading}>

                                    <Text style={modalStyles.menuTitle}>Send Cryptocurrency</Text>
                                    <Text style={modalStyles.menuSubtitle}>Choose Cryptocurrency</Text>
                                </View>
                                <TouchableHighlight style={{ justifyContent: "center", }}>
                                    <Icon name="arrow-right" size={26} color="#ffffff" />
                                </TouchableHighlight>

                            </View>

                            <View style={modalStyles.send2LowerContainer}>
                                <View style={[localStyles.textInput, { flexDirection: "row", justifyContent: "center", alignItems: "center" }]}>
                                    <TextInput onChangeText={(text) => { this.setState({ sendDestination: text }) }} style={{ flex: 1, alignSelf: "flex-start", paddingHorizontal: 10 }}
                                        underlineColorAndroid="transparent" placeholder="Destination" defaultValue={this.state.sendDestination} />
                                    <TouchableHighlight onPress={this._toggleQRModal}>
                                        <Icon name="qrcode-scan" size={20} style={{ paddingHorizontal: 10 }} />
                                    </TouchableHighlight>
                                </View>

                                <View style={[localStyles.textInput, { flexDirection: "row", justifyContent: "center", alignItems: "center" }]}>
                                    <TextInput onChangeText={(text) => { this.setState({ sendAmount: text }) }} style={{ flex: 1, alignSelf: "flex-start", paddingHorizontal: 10 }}
                                        underlineColorAndroid="transparent" placeholder="Amount" defaultValue={this.state.sendAmount} />
                                </View>
                            </View>

                            <TouchableHighlight onPress={() => { this._toggleSendCrypto2(); this._toggleSendCrypto3();this._getUSDConversion(); }} style={localStyles.nextButton}>
                                <Text style={localStyles.bigButtonText}>Next</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>


                <Modal
                    isVisible={this.state.sendCrypto3ModalVisible}
                    onBackButtonPress={() => { this._toggleSendCrypto3(); this._toggleSendCrypto2() }}
                    onBackdropPress={() => { this._toggleSendCrypto3(); this._resetSendState() }}
                    style={{ margin: 0 }}
                >

                    <View style={modalStyles.modalLower}>
                        <View style={[modalStyles.sendCryptoContainer,{height:this.state.windowHeight*0.4}]}>

                            <View style={modalStyles.modalHeadingContainer}>
                                <TouchableHighlight onPress={() => { this._toggleSendCrypto3(); this._toggleSendCrypto2() }} style={{ justifyContent: "center", }}>
                                    <Icon name="arrow-left" size={26} />
                                </TouchableHighlight>
                                <View style={modalStyles.modalHeading}>

                                    <Text style={modalStyles.menuTitle}>Send Cryptocurrency</Text>
                                    <Text style={modalStyles.menuSubtitle}>Choose Cryptocurrency</Text>
                                </View>
                                <TouchableHighlight style={{ justifyContent: "center", }}>
                                    <Icon name="arrow-right" size={26} color="#ffffff" />
                                </TouchableHighlight>

                            </View>

                            <View style={modalStyles.send3LowerContainer}>
                                <View style={{ justifyContent: "flex-start", width: "90%" }}>
                                    <Text>Address</Text>
                                    <Text style={{ fontSize: 16, color: "#f4c736", fontWeight: "bold" }}>{this.state.sendDestination}</Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "90%" }}>
                                    <View>
                                        <Text style={modalStyles.smallGrayText}>Amount</Text>
                                        <Text>{this.state.sendAmount}</Text>

                                    </View>
                                    <View>
                                        <Text style={modalStyles.smallGrayText}>Cryptocurrency</Text>

                                        <View style={{ flexDirection: "row" }}>
                                            {this.state.selectedCrypto === "HERC" ? <Image style={localStyles.smallIcon} source={hercCoin} /> : <Icon name="ethereum" size={16} />}
                                            <Text>{this.state.selectedCrypto}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={modalStyles.smallGrayText}>US Dollars</Text>
                                        <Text>{this.state.USDAmount}</Text>

                                    </View>

                                </View>
                            </View>

                            <TouchableHighlight onPress={this._onPressSend} style={localStyles.sendButton}>
                                <Text style={localStyles.bigButtonText}>Send</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <CustomModal isVisible={this.state.errorModalVisible} modalCase="error" content="Something went wrong." dismissRejectText="Try again" closeModal={this._toggleErrorModal} />
                </Modal>
                <Modal
                    isVisible={this.state.receiveModalVisible}
                    onBackButtonPress={this._toggleReceiveModal}
                    onBackdropPress={this._toggleReceiveModal}
                    style={{ margin: 0 }}
                >

                    <View style={modalStyles.modalLower}>
                        <View style={[modalStyles.receiveContainer,{height:this.state.windowHeight*0.4}]}>
                            <Text style={modalStyles.menuTitle}>Receive Cryptocurrency</Text>

                            <QRCode size={180} value={this.props.ethereumAddress} />

                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Text style={modalStyles.menuSubtitle}>Hold to copy wallet address</Text>
                                <TouchableHighlight onPress={() => { this.writeToClipboard(this.props.ethereumAddress); }}>
                                    <View style={modalStyles.addressContainer} >
                                        <Text>Address</Text>
                                        <Text style={modalStyles.addressText}>{this.props.ethereumAddress}</Text>
                                    </View>
                                </TouchableHighlight>

                            </View>

                        </View>
                    </View>


                </Modal>
                <CustomModal isVisible={this.state.successModalVisible} modalCase="complete" content="HERC has been sent successfully." dismissAcceptText="Continue" closeModal={this._toggleSuccessModal} />

            </View>

        );
    }
}

const mapStateToProps = state => ({
    ethereumAddress: state.WalletActReducers.ethereumAddress,
    currencyCode: state.WalletActReducers.wallet.currencyInfo.currencyCode,
    availableWallets: state.WalletActReducers.walletTypes,
    wallet: state.WalletActReducers.wallet,
    balanceInWei:
        state.WalletActReducers.wallet.balances[
        state.WalletActReducers.wallet.currencyInfo.currencyCode
        ],
    account: state.WalletActReducers.account,
    watchBalance: state.WalletActReducers.watchBalance
});

export default connect(
    mapStateToProps,
    null
)(Wallet);

const localStyles = StyleSheet.create({
    walletContainer: {
        flex: 1,
        backgroundColor: "#0b0368",
        justifyContent: "center",
    },
    balanceWrapperContainer: {
        flex: 3,
    },

    balanceContainer: {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 30,
        backgroundColor: "#252079",
        borderRadius: 5
    },
    activityContainer: {
        flex: 8,
        backgroundColor: "#ffffff",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        padding: 20
    },
    actionsContainer: {
        flex: 1,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    balanceText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 28
    },
    balanceLabelText: {
        color: "#8e94af",
        fontSize: 14
    },
    balanceInnerContainer: {
        flex: 1,
        flexDirection: "row",
        marginVertical: 15,
        marginHorizontal: 20

    },
    balanceInnerLeftContainer: {
        flex: 2,
        justifyContent: "space-evenly"
    },
    balanceInnerRightContainer: {
        flex: 1,
        margin: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    changeCurrencyContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 15,
        flexDirection: "row",
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: "center",
    },

    changeCurrencyText: {
        fontSize: 10,
        fontWeight: "bold"
    },


    bigIcon: {
        height: 48,
        width: 48,
        borderRadius: 48 / 2,
        resizeMode: "contain",
        alignSelf: "center"
    },


    mediumIcon: {
        height: 24,
        width: 24,
        borderRadius: 24 / 2,
        resizeMode: "contain",
        alignSelf: "center"
    },


    smallIcon: {
        height: 16,
        width: 16,
        borderRadius: 16 / 2,
        resizeMode: "contain",
        alignSelf: "center"
    },

    actionButton: {
        flex: 1,
        margin: 10,
        borderRadius: 20,
        alignItems: "center",

    },
    actionButtonText: {
        color: "#ffffff",
        fontSize: 16,
        paddingVertical: 10,
    },


    headerBox: {
        flex: 1,
        backgroundColor: "#0b0368",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",


    },
    headerText: {
        color: "white",
        textAlign: "center",
        fontSize: 26,
    },
    text: {
        color: "black",
        textAlign: "left",
        fontSize: 22,
        fontWeight: "normal",
        margin: 5,
        fontFamily: "dinPro"
    },
    displayFlex: {
        display: "flex"
    },
    displayNone: {
        display: "none"
    },
    displayActivityContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        borderRadius: 5,
        marginTop: 5,
        padding: 10
    },
    displayActivityContainerBG1: {
        backgroundColor: "#f2f3fb",
    },
    displayActivityContainerBG2: {
        backgroundColor: "#ffffff",
    },
    nextButton: {
        margin: 5,
        backgroundColor: "#f4c736",
        justifyContent: "center",
        alignItems: "center",
        height: "15%",
        width: "90%",
        borderRadius: 5
    },
    bigButtonText: {
        color: "#ffffff",
        fontSize: 16
    },
    textInput: {
        borderRadius: 5,
        backgroundColor: "#f2f3fb",
        width: "90%"
    },
    sendButton: {
        margin: 5,
        backgroundColor: "#95c260",
        justifyContent: "center",
        alignItems: "center",
        height: "15%",
        width: "90%",
        borderRadius: 5
    },




});

const modalStyles = StyleSheet.create({

    modalLower: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        flex: 1
    },

    send1LowerContainer: {
        height: "50%",
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        backgroundColor: "#ffffff",
    },
    send2LowerContainer: {
        width: "100%",
        height: "50%",
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        backgroundColor: "#ffffff",
    },
    send3LowerContainer: {
        width: "90%",
        height: "50%",
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        backgroundColor: "#ffffff",
    },

    sendCryptoContainer: {
        flexDirection: 'column',
        backgroundColor: "#ffffff",
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    receiveContainer: {
        flexDirection: 'column',
        backgroundColor: "#ffffff",
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,

    },
    selectCryptoIconContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: "#ffffff",
        justifyContent: "center"
    },
    cryptoIconContainer: {
        padding: "10%",
        borderRadius: 50,
        justifyContent: "flex-start",
        alignItems: "baseline",
    },
    selectedCryptoIconBackground: {
        backgroundColor: "#95c260"
    },
    unselectedCryptoIconBackground: {
        backgroundColor: "#f2f3fb",
    },
    selectedCryptoTextColor: {
        color: "#95c260"
    },
    unselectedCryptoTextColor: {
        color: "#8e94af",
    },
    cryptoText: {
        fontSize: 14,
        fontWeight: "bold"
    },

    menuTitle: {
        color: "#000000",
        fontSize: 24,
        margin: 4,
    },
    menuSubtitle: {
        color: "#9398b2",
        fontSize: 16,
        margin: 2,
    },


    addressContainer: {
        backgroundColor: "#f2f3fb",
        width: "90%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 5,
        paddingHorizontal: 2
    },
    addressText: {
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center"
    },

    modalHeading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-evenly"
    },
    modalHeadingContainer: {
        flexDirection: "row",
        width: "90%"
    },
    smallGrayText: {
        fontSize: 12,
        color: "#9398b2"
    }


})

