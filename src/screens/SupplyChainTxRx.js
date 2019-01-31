import React, { Component } from "react";
import {
  StyleSheet,
  Platform,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  Alert,
  TouchableNativeFeedback,
  StatusBar,
  TextInput
} from "react-native";
import { createStackNavigator } from "react-navigation";
import styles from "../assets/styles";
import { connect } from "react-redux";
import { startTrans } from "../actions/AssetActions";
import newOriginator from "../components/buttons/originatorButton.png";// todo: turn into vector
import newRecipient from "../components/buttons/recipientButton.png";// todo: turn into vector
// import submit from "../components/buttons/submit.png"; // todo: turn into vector

class SupplyChainTxRx extends Component {
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
  constructor(props) {
    super(props);
    this.state = {
      showPass: false,
      gotTransInfo: false
    };
  }

  _startTrans = place => {
    const { navigate } = this.props.navigation;
    let trans;
    if (place === 'Originator') {
      trans = {
        header: {
          hercId: this.props.asset.hercId ,
          password: this.state.password,
          name: this.props.asset.Name,
          tXLocation: place,
          price: 0.000125, //this is the bare starter price i'm going with which is (128b / 1024) x 0.001
          dTime: new Date().toDateString(),
          // ogEntry: this.state.originalTransInfo.entryHash,

        },
        data: {
          // Julie removed below - debugging non-zero price at TX start
          // images: {},
          // documents: {}
        }
      };
      this.props.startTrans(trans);

      navigate("SupplyChainReview", {
        logo: this.props.asset.Logo,
        name: this.props.asset.Name
      });
    } else {

      trans = {
        header: {
          // password: this.state.password,
          hercId: this.props.asset.hercId,
          name: this.props.asset.Name,
          tXLocation: place,
          price: 0.000125, //this is the bare starter price i'm going with which is (128b / 1024) x 0.001
          dTime: new Date().toDateString(),
          ogEntry: this.state.originalTransInfo.entryHash
          // ogEntry: this.state.originalTransInfo.entryHash,

        },
        data: {
          images: {},
          documents: {}
        }
      };
      this.props.startTrans(trans);

      navigate("SupplyChainReview", {
        logo: this.props.asset.Logo,
        name: this.props.asset.Name
      });

    }
  }
  _onPasswordSubmit = () => {
    if (this.state.password) {
      if (this.state.location === "Originator") {
        this._startTrans(this.state.location);
      } else {
        this._getOriginTrans(this.state.password);
      }
    } else {
      Alert.alert("Password Incorrect");
    }
  };

  _cancelPass = () => {
    this.setState({
      showPass: false,
      password: "",
      originalTransInfo: false,
    });
  };


  _getPlace = place => {
    console.log(place, "place in SupplyChainTxRx");

    this.setState({
      showPass: true,
      location: place
    });
  };

  _getOriginTrans = (password) => {
    const { navigate } = this.props.navigation;
    let originalTransInfo;
    let origTransHeader;

    for (const key of Object.keys(this.props.transactions)) {
      if (this.props.asset.transactions[key].header.password) {
        console.log("password found", this.props.asset.transactions[key].header)
        if (this.props.asset.transactions[key].header.password === password) {

          origTransHeader = this.props.transactions[key].header;
          this.setState({
            originalTransInfo: {
              // ogTransTime: origTransHeader.dTime,
              entryHash: origTransHeader.factomEntry,
              hercId: this.props.asset.hercId || null,
              txId: key
            },
            showPass: false,
            gotTransInfo: true,
          });
          return originalTransInfo;
        }
      }
    }
  };


  componentDidMount() {
    // StatusBar.setBackgroundColor("white");
    // StatusBar.setBarStyle("dark-content", true);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <Text style={{ fontSize: 15, marginTop: '10%', color: "#F3C736" }}>Where are you along the Supply Chain? </Text>
          <TouchableHighlight
            style={{ marginTop: 50 }}
            onPress={() => this._getPlace("Originator")}
          >
            <Image style={styles.menuButton} source={newOriginator} />
          </TouchableHighlight>

          <TouchableHighlight onPress={() => this._getPlace("Recipient")}>
            <Image style={styles.menuButton} source={newRecipient} />
          </TouchableHighlight>

          {this.state.showPass && (
            <View style={localStyles.passwordFieldContainer}>
              <Text style={localStyles.passwordLabel}>
                Please Enter{" "}
                <Text style={{ color: "#F3C736" }}>{this.state.location} </Text>
                Transaction Secret Code Word
              </Text>
              <View style={localStyles.passwordTextInputView}>
                <TextInput
                  ref={(input) => { this.textInput = input; }}
                  autoFocus={true}
                  autoCorrect={false}
                  spellCheck={false}
                  underlineColorAndroid="transparent"
                  style={{ fontSize: 20, textAlign: "center" }}
                  onChangeText={pass => this.setState({ password: pass })}
                />
              </View>
              <View style={localStyles.buttonField}>
                <TouchableHighlight
                style={[localStyles.button, { backgroundColor: 'white' }]}
                onPress={this._onPasswordSubmit}>
                  <Text>Submit</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={localStyles.button}
                  onPress={this._cancelPass}
                >
                  <Text>Cancel</Text>
                </TouchableHighlight>
              </View>
            </View>
          )}

          {this.state.originalTransInfo && (
            <View style={[localStyles.passwordFieldContainer, {  }]}>
              <Text style={[localStyles.passwordLabel, { marginTop: 5 }]}>
                Confirm{" "}
                <Text style={{ color: "#F3C736" }}>
                  Recipient
                  {"\n"}
                </Text>
              </Text>

              <Text style={localStyles.passwordLabel}>
                Of TXID:{" "}
                <Text style={{ color: "#F3C736" }}>
                  {this.state.originalTransInfo.txId}
                  {"\n"}
                </Text>
              </Text>

              {/* {this.state.originalTransInfo.ogTransTime && <Text style={localStyles.passwordLabel}>
                Origin Date:{" "}
                <Text style={{ color: "#F3C736" }}>
                  {this.state.originalTransInfo.ogTransTime}
                </Text>
              </Text> */}
              <Text style={localStyles.passwordLabel}>
                Originator Entry Hash:{" "}
                <Text style={{ color: "#F3C736" }}>
                  {this.state.originalTransInfo.entryHash}
                </Text>
              </Text>


              <View style={localStyles.buttonField}>
                <TouchableHighlight onPress={() => this._startTrans('Recipient')}>
                  <Image
                    style={[
                      localStyles.button,
                      { resizeMode: "cover", alignSelf: "flex-start" }
                    ]}
                    source={submit}
                  />
                </TouchableHighlight>
                <TouchableHighlight
                  style={localStyles.button}
                  onPress={this._cancelPass}
                >
                  <Text style={{ fontSize: 18 }}>Cancel</Text>
                </TouchableHighlight>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}



const mapStateToProps = state => ({
  asset: state.AssetReducers.selectedAsset,
  transactions: state.AssetReducers.selectedAsset.transactions
});

const mapDispatchToProps = dispatch => ({
  startTrans: trans => dispatch(startTrans(trans))
});

export default connect(mapStateToProps, mapDispatchToProps)(SupplyChainTxRx);

const localStyles = StyleSheet.create({

  passwordFieldContainer: {
    width: "88%",
    justifyContent: "center",
    backgroundColor: "#123C4A",
    marginTop: 17,
    paddingTop: 5,
    paddingBottom: 5,
  },
  passwordTextInput: {
    fontSize: 20,
    textAlign: "center",
    justifyContent: "center",
  },
  passwordTextInputView: {
    backgroundColor: "white",
    padding: 5,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginTop: 4,
  },
  passwordLabel: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    margin: 5,
    paddingTop:20,
  },
  buttonField: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
    margin: 5,
    paddingBottom:20
  },
  button: {
    width: 80,
    borderColor: "black",
    borderWidth: 2,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  }
});
