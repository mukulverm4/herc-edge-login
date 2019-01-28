import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, ScrollView, Modal, TouchableHighlight, Alert, Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
// import track from '../components/buttons/blockScannerBtn.png';
import { connect } from 'react-redux';
import styles from '../assets/styles';
import { getAssetDef, selectAsset } from '../actions/AssetActions';
import { fetchBlock } from '../actions/EthActions';
// import submit from "../components/buttons/submit.png"; // todo: turn into vector
import logo from "../assets/round.png";

class TrackAssetList extends Component {
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
        <View style={headerStyles.header__container__centeredBox}>
          <View style={headerStyles.header__image__box}>
            {/* <TouchableHighlight style={{justifyContent: "center"}} onPress={() => navigation.navigate("MenuOptions")}>
         </TouchableHighlight> */}
            <Image
              style={headerStyles.assetHeaderLogo}
              source={logo}
            />
          </View>
          <View style={headerStyles.header__text__box}>
            <Text style={headerStyles.headerText}>Track</Text>
          </View>
        </View>
      </View>
      )
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      showPass: false
    };
  }

  _showPass = asset => {
    console.log(asset, "asset before pw enter in SupplyChainTxRx");

    this.setState({
      showPass: true,
      asset
    }, () => {console.log('state in TrackAssetList jm', this.state)});
  };

  _onPasswordSubmit = () => {
    if (this.state.password === this.state.asset.Password) {
      this._selectAsset(this.state.asset);
      this._cancelPass();
    } else {
      Alert.alert("Password Incorrect");
    }
  };

  _selectAsset = asset => {
    const { navigate } = this.props.navigation;
    console.log("TrackAssetList: going to the trans")
    this.props.selectAsset(asset);
    if (asset.ipfsHash) {
      this.props.getAssetDef(asset.ipfsHash);
    }
    else {
      this.props.getAssetDef(asset.hashes.ipfsHash)
    }
    navigate('TrackAssetOptions', { name: asset.Name, logo: asset.Logo });
  }

  _cancelPass = () => {
    this.setState({
      showPass: false,
      password: ""
    });
  };

  _renderAssets = () => {
    let list = this.props.assets.map((asset, index) => {
      return (
          <TouchableHighlight style={{ borderRadius: 2 }} key={index} onPress={() => this._showPass(asset)}>
            <View style={localStyles.menuItemField}>
              <Image style={localStyles.assetLogo} source={{ uri: asset.Logo }} />
              <View style={localStyles.menuItemField__textBox}>
                <Text style={localStyles.assetLabel}>{asset.Name}</Text>
              </View>
            </View>
          </TouchableHighlight>
      )
    })

    return list;
  }


  render() {

    return (
      <View style={styles.container}>
        <View style={[styles.containerCenter, { paddingTop: 15 }]}>
          <ScrollView>

          {this._renderAssets()}

          </ScrollView>
        </View>
        <Modal
          transparent={false}
          animationType={'none'}
          visible={this.state.showPass}
          onRequestClose={() => { console.log("modal closed") }}
        >
          <View style={styles.container}>
            <View style={[styles.containerCenter, { paddingTop: 25 }]}>
              <View style={localStyles.passwordFieldContainer}>
                <Text style={localStyles.passwordLabel}>
                  Please Enter{" "}
                  Asset Password
          </Text>

                <View style={localStyles.passwordTextInputView}>
                  <TextInput
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
                  onPress={() => this._onPasswordSubmit()}>
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
            </View>
          </View>
        </Modal>
      </View>


    )
  };
}

//need to write GET_TRANS

const mapStateToProps = (state) => ({
  assets: state.AssetReducers.assets,

});

const mapDispatchToProps = (dispatch) => ({
  fetchBlock: () => dispatch(getBlock()),
  selectAsset: (asset) => dispatch(selectAsset(asset)),
  getAssetDef: assetIpfsHash => dispatch(getAssetDef(assetIpfsHash)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TrackAssetList)

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
  createButton: {
    width: 150,
    height: 50,
    borderColor: "#f3c736",
    borderWidth: 1,
  },
  menuItemField: {
    display: "flex",
    flexDirection: "row",
    width: 250,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 3,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    margin: 12,
    paddingLeft: 3,
  },
  assetLogo: {
    height: 25,
    width: 25,
    marginLeft: 2,
    borderRadius: 25 / 2,
    alignSelf: "center"
  },
  assetLabel: {
    color: "black",
    alignSelf: "center",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "normal",
    margin: 2,
    fontFamily: "dinPro"
  },
  menuItemField__textBox: {
    flex: 1
  },
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
    height: 30,
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
    paddingTop: 20,
  },
  buttonField: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
    margin: 5,
    paddingBottom: 20
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
