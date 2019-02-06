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
  Linking
} from "react-native";
import React from "react";
import styles from "../assets/styles";
import round from "../assets/round.png";
import plus from "../assets/plus.png"; // todo: turn into vector
import { connect } from "react-redux";
import BigNumber from "bignumber.js";
import QRCode from "react-qr-code";
import RadioForm from "react-native-simple-radio-button";

///////  All this wallet balance stuff,
class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      destAddress: "",
      sendAmount: "",
      displayWallet: "",
      availableTokens: []
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <View style={localStyles.headerBox}>
        <TouchableHighlight
          style={{ justifyContent: "center" }}
          onPress={() => navigation.navigate("MenuOptions")}
        >
          <Text style={localStyles.headerText}>Wallets</Text>
        </TouchableHighlight>
      </View>
    )
  });

  componentDidMount = async () => {
    if (!this.props.watchBalance || !this.props.watchBalance.ETH) {
      let light = await this.props.wallet.getEnabledTokens();
      let enabledTokens = light.reverse();
      this.setState(
        {
          availableTokens: enabledTokens,
          displayWallet: enabledTokens[0] // initiate with HERC wallet
        },
        () => this._updateWallet()
      );
    } else {
      let enabledTokens = Object.keys(this.props.watchBalance).reverse();
      this.setState(
        {
          availableTokens: enabledTokens,
          displayWallet: enabledTokens[0] // initiate with HERC wallet
        },
        () => this._updateWallet()
      );
    }
  };

  _updateWallet = () => {
    if (!this.props.watchBalance || !this.props.watchBalance.ETH) {
      let displayWallet = this.state.displayWallet;
      let tempBalance = new BigNumber(this.props.wallet.balances[displayWallet])
        .times(1e-18)
        .toFixed(18);

      return tempBalance;
      // return "0.000000"; //don't assume it is 0
    } else {
      let displayWallet = this.state.displayWallet;
      let tempBalance = new BigNumber(this.props.watchBalance[displayWallet])
        .times(1e-18)
        .toFixed(18);
      return tempBalance;
    }
  };
  async _onPressSend() {
    const wallet = this.props.wallet;
    let destAddress = this.state.destAddress;
    let sendAmountInEth = new BigNumber(this.state.sendAmount);
    if (!destAddress) Alert.alert("Missing Destination Address");
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
          publicAddress: destAddress,
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
    } catch (e) {
      let displayWallet = this.state.displayWallet;
      let tempBalance = new BigNumber(this.props.watchBalance[displayWallet])
        .times(1e-18)
        .toFixed(6);

      Alert.alert(
        "Insufficient Funds",
        "Balance: " + tempBalance + " " + displayWallet,
        [{ text: "Ok", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
    // TODO: after successful transaction, reset state.
  }

  writeToClipboard = async data => {
    await Clipboard.setString(data);
    Alert.alert("Copied to Clipboard!", data);
  };

  _addWallet = walObj => {
    this.props.addWallet(walObj);
    this.setModalVisible();
  };

  _radioButtons = () => {
    let radio_props = [];
    let walletList = this.state.availableTokens.map(
      (currentItem, currentIndex) => {
        radio_props.push({ label: currentItem, value: currentItem });
      }
    );
    return (
      <View style={{ marginBottom: "5%" }}>
        <RadioForm
          formHorizontal={true}
          labelColor={"silver"}
          selectedLabelColor={"gold"}
          radio_props={radio_props}
          initial={0}
          radioStyle={{ paddingRight: 30 }}
          onPress={value => {
            this.setState({ displayWallet: value }, () => this._updateWallet());
          }}
        />
      </View>
    );
  };

  _generateETHTextInput = () => {
    if (this.state.displayWallet === "ETH") {
      return (
        <View style={localStyles.textInputContainer}>
          <TextInput
            style={localStyles.textInputs}
            onChangeText={sendAmount => this.setState({ sendAmount })}
            placeholderTextColor="silver"
            placeholder="Send Amount (ETH)"
            underlineColorAndroid="transparent"
            selectionColor={"gold"}
          />
        </View>
      );
    }
  };

  _generateHERCTextInput = () => {
    if (this.state.displayWallet === "HERC") {
      return (
        <View style={localStyles.textInputContainer}>
          <TextInput
            style={localStyles.textInputs}
            onChangeText={sendAmount => this.setState({ sendAmount })}
            placeholderTextColor="silver"
            placeholder="Send Amount (HERC)"
            underlineColorAndroid="transparent"
            selectionColor={"gold"}
          />
        </View>
      );
    }
  };

  render() {
    let displayWallet = this.state.displayWallet;
    let testPlaceholder = "this is test" + displayWallet;
    // let currencyValue = this._updateWallet() === NaN ? '0.000000' : this._updateWallet();
    let currencyValue = this._updateWallet(); // don't assume NaN means 0. It will freak out ppl with a lot of tokens
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={[styles.containerCenter, { paddingTop: 25 }]}>
            {this._radioButtons()}

            <View style={localStyles.balanceContainer}>
              <View style={localStyles.centerBalance}>
                <Text style={localStyles.text}>
                  {this.state.displayWallet} Balance:
                </Text>
                <View style={localStyles.tokenValueContainer}>
                  <Image style={localStyles.icon} source={round} />
                  <Text style={localStyles.currencyValue}>{currencyValue}</Text>
                </View>
              </View>
            </View>
            <TextInput
              style={localStyles.textInputs}
              onChangeText={destAddress => this.setState({ destAddress })}
              placeholderTextColor="silver"
              placeholder="Destination Address"
              value={this.state.text}
              underlineColorAndroid="transparent"
              selectionColor={"gold"}
            />

            {this._generateETHTextInput()}
            {this._generateHERCTextInput()}

            <TouchableHighlight
              style={{ marginTop: 10 }}
              onPress={() => this._onPressSend()}
            >
              <Text
                style={localStyles.send_Text}
              >
                Send
              </Text>
            </TouchableHighlight>
            <View
              style={localStyles.seperatingBorder}
            />

            <View
              style={localStyles.receiveContainer}
            >
              <Text style={{ color: "white", fontSize: 18 }}>RECEIVE</Text>
              <View
                style={{
                  borderWidth: 10,
                  borderColor: "white",
                  marginTop: "5%"
                }}
              >
                <QRCode size={140} value={this.props.ethereumAddress} />
              </View>
              <Text style={{ color: "white", marginTop: 10 }}>
                {this.props.ethereumAddress}
              </Text>
              <View style={{ marginTop: "5%" }}>
                <TouchableHighlight
                  onPress={() => {
                    this.writeToClipboard(this.props.ethereumAddress);
                  }}
                >
                  <Text
                    style={localStyles.copyButton}
                  >
                    Copy
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => {
                    Linking.openURL("https://purchase.herc.one/");
                  }}
                >
                  <View>
                    <Text
                      style={localStyles.topUpHercs}
                    >
                      Top Up HERCs
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
  centerBalance: {
    height: "100%",
    alignItems: "center",
    flexDirection: "column"
  },
  balanceContainer: {
    borderColor: "gold",
    borderWidth: 3,
    borderRadius: 5,
    width: "95%",
    height: 80,
    backgroundColor: "silver",
    alignSelf: "center"
  },
  tokenValueContainer: {
    borderColor: "#091141",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: "row",
    height: "50%",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white"
  },
  icon: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    resizeMode: "contain"
  },
  currencyValue: {
    fontSize: 22,
    color: "black"
  },
  headerBox: {
    alignItems: "center",
    flex: 1
  },
  headerText: {
    color: "black",
    textAlign: "center",
    alignSelf: "center",
    fontSize: 26,
    fontWeight: "normal"
  },
  text: {
    color: "white",
    textAlign: "left",
    fontSize: 22,
    fontWeight: "normal",
    margin: 5,
    fontFamily: "dinPro"
  },
  textInputContainer: {
    width: "100%",
    height: 100,
    alignSelf: "center",
    justifyContent: "center"
  },
  textInputs: {
    alignSelf: "center",
    width: "80%",
    marginTop: "5%",
    textAlign: "center",
    borderColor: "gold",
    borderWidth: 1,
    borderRadius: 10,
    color: "white"
  },
  copyButton: {
    marginTop: 10,
    backgroundColor: "#4c99ed",
    width: 100,
    lineHeight: 30,
    height: 30,
    borderRadius: 5,
    color: "white",
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center"
  },
  send_Text: {
    backgroundColor: "green",
    width: 100,
    lineHeight: 30,
    height: 30,
    borderRadius: 5,
    color: "white",
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center"
  },
  topUpHercs: {
    marginTop: "30%",
    color: "white",
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center"
  },
  receiveContainer: {
    marginTop: "5%",
    alignContent: "center",
    alignItems: "center",
    margin: 5
  },
  seperatingBorder: {
    marginTop: "10%",
    borderBottomColor: "white",
    borderBottomWidth: 1,
    width: "100%"
  }
});
