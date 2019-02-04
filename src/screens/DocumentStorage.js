import React from "react";
import { connect } from "react-redux";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  CameraRoll,
  PixelRatio,
  TouchableHighlight,
  Clipboard,
  Alert,
  Share,
  ActivityIndicator,
  Button,
  PermissionsAndroid
} from "react-native";
import firebase from "firebase";
import Firebase from "../constants/Firebase";
import hercLogo from "../assets/hercLogoBreak.png";
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
var RNFS = require("react-native-fs");
import QRCode from "react-qr-code";
import styles from "../assets/styles";
import { RNCamera } from "react-native-camera";
import axios from "axios";
import { WEB_SERVER_API_SHORTEN_URL } from "../components/settings";
import store from "../store";
import BigNumber from "bignumber.js";
import { addDocStorage, sendTrans } from "../actions/AssetActions";
import { TOKEN_ADDRESS } from "../components/settings";
import { captureRef } from "react-native-view-shot";

console.disableYellowBox = true;

class DocumentStorage extends React.Component {
  state = {
    hasCameraRollPermission: null,
    document: {
      uri: "",
      name: "",
      size: "",
      type: "",
      content: ""
    },
    uploadDoc: null,
    uploadHistory: [],
    showLoader: true
  };

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
        flexDirection: "row"
      },
      header__text__box: {
        height: "100%",
        marginBottom: 5,
        marginLeft: 12
      },
      header__image__box: {
        height: "100%",
        borderRadius: 100
      },
      assetHeaderLogo: {
        height: 35,
        width: 35,
        borderRadius: 50
      },
      headerText: {
        fontFamily: "dinPro",
        fontSize: 26,
        alignSelf: "center",
        fontWeight: "bold",
        color: "black",
        textAlign: "center",
        marginTop: 2
      }
    });

    return {
      headerTitle: (
        <View style={headerStyles.header__container}>
          <TouchableHighlight
            style={{ justifyContent: "center" }}
            onPress={() => navigation.navigate("MenuOptions")}
          >
            <View style={headerStyles.header__container__centeredBox}>
              <View style={headerStyles.header__image__box} />
              <View style={headerStyles.header__text__box}>
                <Text style={headerStyles.headerText}>Document Storage</Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      ),
      headerTitleStyle: {
        height: 50,
        width: 200,
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "row",
        marginLeft: 20
      }
    };
  };

  componentDidMount() {
    this._requestExternalStoragePermission();
    this._mapUploadHistory();

    try {
      let balance = new BigNumber(this.props.watchBalance["HERC"]);
      this.setState({ balance: balance.times(1e-18).toFixed(6) });
    } catch (e) {
      let balance = new BigNumber(this.props.wallet.balances["HERC"]);
      this.setState({ balance: balance.times(1e-18).toFixed(6) });
    }
  }

  _writeToClipboard = async data => {
    await Clipboard.setString(data);
    Alert.alert("Copied to Clipboard!", data);
  };

  _pickDocument = () => {
    this.setState({ uploadDoc: true });
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {
        //this if(res) allows user to use native android back button to exit docpicker
        if (res) {
          if (error) Alert.alert("Something Went Wrong! Error: " + error);
          // Android
          RNFS.readFile(res.uri, "base64").then(contents => {
            this.setState({
              document: {
                uri: res.uri,
                name: res.fileName,
                size: res.fileSize,
                type: res.type,
                content: contents
              }
            });
          });
        }
      }
    );
  };

  _executeUpload = async () => {
    let f = this.state.document.uri;
    uploadURL = await this._uploadFile(f);
  };

  _share = async () => {
    const downloadUrl = this.state.document.downloadURL;
    Share.share(
      {
        message: "Herc Document Storage Link: " + downloadUrl,
        url: downloadUrl,
        title: "Herc Document Storage Link"
      },
      {
        // Android only:
        dialogTitle: "Herc Document Storage Link"
        // iOS only:
        // excludedActivityTypes: ["com.apple.UIKit.activity.PostToTwitter"]
      }
    );
  };

  _uploadFile = async uri => {
    let docName = this.state.document.name;
    let storageRef = firebase.storage().ref();
    let testTextRef = storageRef.child(docName);
    let testTextDocRef = storageRef.child("documents/" + docName);
    var bindedThis = this;
    //****this is where the file needs to be converted and push to storage */
    const response = await fetch(uri);
    const blob = await response.blob();
    const snapshot = await testTextDocRef
      .put(blob)
      .then(snapshot => {
        return snapshot.ref.getDownloadURL();
      })
      .then(downloadURL => {
        axios
          .post(WEB_SERVER_API_SHORTEN_URL, {
            longURL: downloadURL
          })
          .then(response => {
            let shortenedURL = response.data.url;
            bindedThis.setState(
              {
                document: { ...this.state.document, downloadURL: shortenedURL }
              },
              () => this._updateHistory()
            );
          });
      })
      .catch(error => {
        // Use to signal error if something goes wrong.
        console.log(`Failed to upload file and get link - ${error}`);
      });
  };

  _scanQR = () => {
    this.setState({ uploadDoc: false });
  };

  _openCameraView = () => {
    return (
      <View style={localStyles.container}>
        <RNCamera
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          flashMode={RNCamera.Constants.FlashMode.on}
          style={localStyles.preview}
          onBarCodeRead={this.onBarCodeRead}
          ref={cam => (this.camera = cam)}
        />
      </View>
    );
  };

  _mapUploadHistory = name => {
    let userID = this.props.account.username;
    database = firebase.database();
    var ref = database.ref("documents/" + userID);

    errData = err => {
      console.log("Error!", err);
    };

    gotData = data => {
      this.setState(
        {
          uploadHistory: data.val()
        }
      );
    };

    ref.on("value", gotData, errData);
  };

  _updateHistory = () => {
    //after a successful document upload to Firebase Storage, this function updates the history for each user. This information is stored on Firebase DB
    let filename = this.state.document.name;
    let userID = this.props.account.username;
    let downloadURL = this.state.document.downloadURL;
    var dt = new Date();
    var utcDate = dt.toUTCString();
    var starCountRef = firebase
      .database()
      .ref("documents/" + userID)
      .push()
      .set({
        downloadURL: downloadURL,
        filename: filename,
        date: utcDate
      });
  };

  _takePic = () => {
    const { navigate } = this.props.navigation;
    navigate("DocumentQRScanner", { setPic: this.setImage });
  };

  _onBarCodeRead = e => {
    this.setState({ qrcode: e.data });
  };

  _showUploadHistory = () => {
    const uploadHist = this.state.uploadHistory;
    if (uploadHist) {
      let dataObjects = Object.keys(this.state.uploadHistory);
      return dataObjects.map((curr, ind) => {
        const dataObjectKeys = this.state.uploadHistory;
        const date = dataObjectKeys[curr].date;
        const filename = dataObjectKeys[curr].filename;
        const downloadURL = dataObjectKeys[curr].downloadURL;
        return (
          <View key={[ind]}>
            <Text style={{ color: "white" }}>{date}</Text>
            <Text style={{ color: "white", width: 200 }}>{filename}</Text>
            <TouchableHighlight
              onPress={() => {
                this._writeToClipboard(downloadURL);
              }}
            >
              <Text
                style={{
                  color: "white",
                  margin: 10,
                  backgroundColor: "#4c99ed",
                  width: 200,
                  lineHeight: 30,
                  height: 30,
                  borderRadius: 5,
                  textAlign: "center",
                  justifyContent: "center",
                  alignContent: "center"
                }}
              >
                {" "}
                Copy Link
              </Text>
            </TouchableHighlight>
          </View>
        );
      });
    }
  };

  _activityIdicatorOrQRCode = () => {
    const runLoaderChange = () => {
      this.setState({ showLoader: false });
    };

    setTimeout(runLoaderChange, 2 * 1000);

    if (this.state.showLoader != true) {
      return (
        <View
          style={{
            alignSelf: "center",
            height: 140,
            width: 140,
            backgroundColor: "white",
            justifyContent: "center",
            alignContent: "center"
          }}
        >
          <QRCode size={140} value={this.state.document.downloadURL} />
        </View>
      );
    } else {
      return (
        <View
          style={{
            alignSelf: "center",
            height: 140,
            width: 140,
            backgroundColor: "white",
            justifyContent: "center",
            alignContent: "center"
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  };

  //under here is copied from supply chain transaction review

  _onPressSubmit() {
    if (Object.keys(this.state.document)) {
      let total =
        parseFloat(this._getDocPrice()) + parseFloat(this._getBurnPrice());
      // let total = 0.000032 + ;

      Alert.alert(
        "Doc Fee: " +
          this._getDocPrice().toString() +
          " HERC \nBurn Amount: " +
          this._getBurnPrice().toString() +
          " HERC",
        "Total: " +
          total.toFixed(6) +
          " HERC" +
          "\nETH Gas Cost(est.): " +
          "0.000223 ETH" +
          "\nDo you authorize this payment?",
        [
          {
            text: "No",
            onPress: () => console.log("No Pressed"),
            style: "cancel"
          },
          { text: "Yes", onPress: () => this._checkBalance() }
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Oh no!",
        "This is an empty submission",
        [{ text: "Ok", onPress: () => console.log("OK Pressed") }],
        { cancelable: true }
      );
    }
  }

  async _checkBalance() {
    if (!this.state.balance) {
      return;
    }

    let dataFee = new BigNumber(this._getDocPrice());
    let preppedDataFee = new BigNumber(dataFee).multipliedBy(1000000000000000000).toFixed(0);

    let total =
      parseFloat(this._getDocPrice()) + parseFloat(this._getBurnPrice());
    let convertingPrice = new BigNumber(total); // don't have to times 1e18 because its already hercs
    let balance = new BigNumber(this.state.balance);
    let newbalance = balance.minus(convertingPrice);

    // console.log("do you have enough?", newbalance.isPositive());

    if (newbalance.isNegative()) {
      Alert.alert(
        "Insufficient Funds",
        "Balance: " + this.state.balance + " HERC",
        [
          {
            text: "Top Up Hercs",
            onPress: () => Linking.openURL("https://purchase.herc.one/"),
            style: "cancel"
          },
          { text: "Ok", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: true }
      );
    } else {
      this.setState({ modalVisible: true });
      const burnSpendInfo = {
        networkFeeOption: "standard",
        currencyCode: "HERC",
        metadata: {
          name: "Transfer From Herc Wallet",
          category: "Transfer:Wallet:Burn Amount"
        },
        spendTargets: [
          {
            publicAddress: TOKEN_ADDRESS,
            nativeAmount: "32000000000000"
          }
        ]
      };
      const dataFeeSpendInfo = {
        networkFeeOption: "standard",
        currencyCode: "HERC",
        metadata: {
          name: "Transfer From Herc Wallet",
          category: "Transfer:Wallet:Data Fee"
        },
        spendTargets: [
          {
            publicAddress: "0x1a2a618f83e89efbd9c9c120ab38c1c2ec9c4e76",
            nativeAmount: preppedDataFee.toString()
          }
        ]
      };

      // catch error for "ErrorInsufficientFunds"
      // catch error for "ErrorInsufficientFundsMoreEth"
      let wallet = this.props.wallet;
      try {
        let burnTransaction = await wallet.makeSpend(burnSpendInfo);
        await wallet.signTx(burnTransaction);
        await wallet.broadcastTx(burnTransaction);
        await wallet.saveTx(burnTransaction);
        console.log("Sent burn transaction with ID = " + burnTransaction.txid);

        let dataFeeTransaction = await wallet.makeSpend(dataFeeSpendInfo);
        await wallet.signTx(dataFeeTransaction);
        await wallet.broadcastTx(dataFeeTransaction);
        await wallet.saveTx(dataFeeTransaction);
        console.log(
          "Sent dataFee transaction with ID = " + dataFeeTransaction.txid
        );

        if (burnTransaction.txid && dataFeeTransaction.txid) {
          this._sendTrans();
        }
      } catch (e) {
        let tempBalance = new BigNumber(this.props.watchBalance["ETH"]);
        let ethBalance = tempBalance.times(1e-18).toFixed(6);
        this.setState({ modalVisible: false });
        Alert.alert(
          "Insufficient ETH Funds",
          "Balance: " + ethBalance + " ETH",
          [{ text: "Ok", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      }
    }
  }

  _sendTrans() {
    this._executeUpload();
  }

  _getDocPrice = () => {
    /// 12/16/18 docPrice of 200% of .000032 hercs.. That's .000128 hercs
    let docPrice = 0.000128;
    let convertingPrice = new BigNumber(docPrice);
    let newDocPrice = convertingPrice.toFixed(6);
    return newDocPrice;
  };

  _getBurnPrice = () => {
    let feePrice = 0.000032;
    let convertingPrice = new BigNumber(feePrice);
    let newFeePrice = convertingPrice.toFixed(6);
    return newFeePrice;
  };

  _saveToCameraRollAsync = async () => {
    const result = captureRef(this._container, {
      format: "jpg",
      quality: 0.8
    }).then(
      uri => CameraRoll.saveToCameraRoll(uri, "photo"),
      error => console.error("Oops, snapshot failed", error)
    ).then(
      result => Alert.alert("QR has been saved to gallery!")
    );
  };

  _requestExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "My App Storage Permission",
          message:
            "My App needs access to your storage " +
            "so you can save your photos"
        }
      );
      return granted;
    } catch (err) {
      console.error("Failed to request permission ", err);
      return null;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.containerCenter, { flex: 1 }]}>
          <TouchableHighlight
            style={{ marginTop: 10 }}
            onPress={() => this._pickDocument()}
          >
            <Text
              style={{
                color: "white",
                backgroundColor: "#4c99ed",
                width: 200,
                lineHeight: 30,
                height: 30,
                borderRadius: 5,
                textAlign: "center",
                justifyContent: "center",
                alignContent: "center"
              }}
            >
              Select Document
            </Text>
          </TouchableHighlight>
          {this.state.document.name ? (
            <Text style={{ color: "silver", flexWrap: "wrap" }}>
              {" "}
              file name: {this.state.document.name}{" "}
            </Text>
          ) : null}
          {this.state.document.size ? (
            <View>
              <Text style={{ color: "silver", flexWrap: "wrap" }}>
                {" "}
                file size: {this.state.document.size} kB
              </Text>
            </View>
          ) : null}
          {this.state.document.name ? (
            <TouchableHighlight onPress={() => this._onPressSubmit()}>
              <Text
                style={{
                  color: "white",
                  marginTop: 10,
                  backgroundColor: "#4c99ed",
                  width: 200,
                  lineHeight: 30,
                  height: 30,
                  borderRadius: 5,
                  textAlign: "center",
                  justifyContent: "center",
                  alignContent: "center"
                }}
              >
                Upload
              </Text>
            </TouchableHighlight>
          ) : null}

          <View style={{ alignContent: "center", alignItems: "center" }}>
            <View
              style={{
                padding: 10,
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
              collapsable={false}
            >
              {this.state.document.downloadURL ? (
                <View
                  style={{
                    width: 200,
                    alignContent: "center",
                    justifyContent: "center",
                    backgroundColor: "white",
                    borderWidth: 10,
                    borderColor: "white"
                  }}
                  ref={view => {
                    this._container = view;
                  }}
                >
                  {this._activityIdicatorOrQRCode()}
                  <Text
                    style={{
                      color: "black",
                      flexWrap: "wrap",
                      textAlign: "center"
                    }}
                  >
                    {" "}
                    {this.state.document.name}{" "}
                  </Text>
                </View>
              ) : null}

              {this.state.document.downloadURL ? (
                <Text
                  style={{
                    color: "silver",
                    flexWrap: "wrap",
                    textAlign: "center"
                  }}
                >
                  {" "}
                  {this.state.downloadURL}{" "}
                </Text>
              ) : null}
            </View>
            {this.state.document.downloadURL ? (
              <View>
                <TouchableHighlight onPress={this._saveToCameraRollAsync}>
                  <Text
                    style={{
                      color: "white",
                      marginTop: 10,
                      backgroundColor: "#4c99ed",
                      width: 200,
                      lineHeight: 30,
                      height: 30,
                      borderRadius: 5,
                      textAlign: "center",
                      justifyContent: "center",
                      alignContent: "center"
                    }}
                  >
                    Save QR
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => {
                    this._writeToClipboard(this.state.document.downloadURL);
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      marginTop: 10,
                      backgroundColor: "#4c99ed",
                      width: 200,
                      lineHeight: 30,
                      height: 30,
                      borderRadius: 5,
                      textAlign: "center",
                      justifyContent: "center",
                      alignContent: "center"
                    }}
                  >
                    Copy
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => {
                    this._share();
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      marginTop: 10,
                      backgroundColor: "#4c99ed",
                      width: 200,
                      lineHeight: 30,
                      height: 30,
                      borderRadius: 5,
                      textAlign: "center",
                      justifyContent: "center",
                      alignContent: "center"
                    }}
                  >
                    Share
                  </Text>
                </TouchableHighlight>
              </View>
            ) : null}
          </View>

          {this.state.uploadDoc === true ? null : (
            <View style={{ alignContent: "center" }}>
              <Text style={{ color: "white", textAlign: "center" }}>OR</Text>
              <TouchableHighlight
                style={{ marginTop: 10, marginBottom: 10 }}
                onPress={() => this._takePic()}
              >
                <Text
                  style={{
                    color: "white",
                    backgroundColor: "#4c99ed",
                    width: 200,
                    lineHeight: 30,
                    height: 30,
                    borderRadius: 5,
                    textAlign: "center",
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                >
                  Scan A QR
                </Text>
              </TouchableHighlight>
            </View>
          )}

          {this.state.uploadDoc === true ? null : (
            <ScrollView style={{ height: "50%" }}>
              <View style={{ marginTop: "20%", alignItems: "center" }}>
                {this.state.uploadHistory ? (
                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                      textAlign: "center",
                      marginVertical: 10
                    }}
                  >
                    HISTORY
                  </Text>
                ) : null}
                {this._showUploadHistory()}
              </View>
            </ScrollView>
          )}
          <View
            style={{
              flexDirection: "column",
              flex: 1,
              margin: 2,
              width: "100%",
              justifyContent: "flex-end",
              backgroundColor: "#091141"
            }}
          >
            <Image
              source={hercLogo}
              style={{
                resizeMode: "center",
                height: 50,
                width: "50%",
                alignSelf: "center"
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    borderColor: "red",
    borderWidth: 3,
    flex: 1,
    flexDirection: "row"
  },
  preview: {
    flex: 1
  },
  SupplyChainTransactionReviewContainer: {
    marginTop: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  submitButton: {
    height: 40,
    width: 200,
    resizeMode: "contain",
    alignSelf: "center"
  },
  assetLocationLabel: {
    height: 30,
    width: 150,
    resizeMode: "contain",
    marginTop: 10,
    alignSelf: "center"
  },
  teePrice: {
    color: "white"
  },
  docContainer: {
    width: "100%",
    height: 100
  },
  imgContainer: {
    width: "100%",
    height: 125,
    justifyContent: "center"
  },
  text: {
    color: "white",
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "normal",
    margin: 2,
    fontFamily: "dinPro"
  },
  thumb: {
    height: 50,
    width: 50,
    resizeMode: "cover",
    alignSelf: "center",
    margin: 4
  },
  editField: {
    height: 75,
    width: "100%",
    justifyContent: "center",
    padding: 3,
    margin: 10
  },
  editLabel: {
    fontFamily: "dinPro",
    fontSize: 21,
    color: "yellow",
    margin: 2,
    alignSelf: "center"
  },
  TransactionReviewTime: {
    color: "#f3c736",
    fontFamily: "dinPro",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    flexDirection: "column"
  },
  TransactionReviewName: {
    fontFamily: "dinPro",
    fontSize: 16,
    color: "white",
    margin: 2,
    textAlign: "left"
  },

  revPropField: {
    height: 20,
    width: 225,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 2,
    margin: 2,
    backgroundColor: "#021227",
    alignSelf: "center"
  },
  revPropVal: {
    fontFamily: "dinPro",
    fontSize: 15,
    color: "white",
    padding: 2,
    textAlign: "center"
  },
  listContainer: {
    margin: 10,
    flex: 1,
    justifyContent: "center"
  },
  feeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    margin: 5
  },
  teePrice: {
    fontSize: 10,
    color: "white",
    backgroundColor: "#091141",
    marginRight: 5
  },
  hercPillarIcon: {
    height: 15,
    width: 15,
    resizeMode: "contain",
    borderRadius: 15 / 2
  }
});

const mapStateToProps = state => ({
  documentStorage: state.DocumentStorage,
  wallet: state.WalletActReducers.wallet,
  watchBalance: state.WalletActReducers.watchBalance,
  account: state.WalletActReducers.account
});

const mapDispatchToProps = dispatch => ({
  addDocStorage: doc => dispatch(addDocStorage(doc)),
  sendTrans: transPrice => dispatch(sendTrans(transPrice))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentStorage);
