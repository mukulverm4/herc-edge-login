// const { navigate } = this.props.navigation;
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  Alert,
  TextInput,
  Platform,
  StatusBar,
  Modal
} from "react-native";
import { createStackNavigator } from "react-navigation";
import { connect } from "react-redux";
// import submit from "../components/buttons/submit.png"; // todo: turn into vector
import styles from "../assets/styles";
import create from "../assets/createNewAssetButton.png"; // todo: turn into vector
import { getAssetDef, selectAsset } from "../actions/AssetActions";
import addIcon from "../components/buttons/addIcon.png"; // TODO: turn into vector icon
import supplyChainIcon from "../assets/supplyChainIcon.png";

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

class SupplyChainAssetList extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerTitle:
      <View style={headerStyles.header__container}>

        <View style={headerStyles.header__container__centeredBox}>
          <View style={headerStyles.header__image__box}>
            <Image
              style={headerStyles.assetHeaderLogo}
              source={supplyChainIcon}
            />
          </View>
          <View style={headerStyles.header__text__box}>
            <Text style={headerStyles.headerText}>Supply Chain</Text>
          </View>
        </View>
      </View>,
  });

  constructor(props) {
    super(props);

    this.state = {
      showPass: false
    };
  }

  componentDidMount() {
    StatusBar.setBackgroundColor("white");
    StatusBar.setBarStyle("dark-content", true);
    console.log(this.props.assets, "Supply Chain: Asset Headers From Firebase")

  }

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

  _showPass = asset => {
    console.log(asset, "asset before pw enter in SupplyChainTxRx: jm");

    this.setState({
      showPass: true,
      asset
    });
  };

  _stagingAsset = async (asset) => {
    await this.props.selectAsset(asset);
    await this.props.getAssetDef(asset.hashes.ipfsHash)
  }

  _onPasswordSubmit = () => {
    console.log("jm")
    if (this.state.password === this.state.asset.Password) {
      let asset = this.state.asset
      this._stagingAsset(asset)
      this._cancelPass();

      const { navigate } = this.props.navigation;
      navigate('SupplyChainTxRx', { logo: asset.Logo, name: asset.Name });

    } else {
      Alert.alert("Password Incorrect");
    }
  };

  _cancelPass = () => {
    this.setState({
      showPass: false,
      password: ""
    });
  };

  render() {

    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={[styles.containerCenter, { paddingTop: 25 }]}>
          <ScrollView contentContainerStyle={styles.scrollView}>

            {this._renderAssets()}

            <TouchableHighlight onPress={() => navigate('NewAssetLanding')}>

              <View style={localStyles.createNew__Box}>
                <Image style={localStyles.assetLogo} source={addIcon} />
                <Text style={localStyles.createNewText}>Create New</Text>
              </View>

            </TouchableHighlight>

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
                  onPress={() => this._onPasswordSubmit()}
                  >
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

const localStyles = StyleSheet.create({
  createNew__Box: {
    flexDirection: "row",
    width: 200,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 2,
    alignItems: "center",
    alignContent: "center",
    marginTop: 100,
    paddingLeft: 5,
  },
  createNewText: {
    flex: 1,
    color: "black",
    alignSelf: "center",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "normal",
    margin: 5,
    fontFamily: "dinPro"
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


});

const mapStateToProps = state => ({
  assets: state.AssetReducers.assets
});

const mapDispatchToProps = dispatch => ({
  selectAsset: asset => dispatch(selectAsset(asset)),
  getAssetDef: assetIpfsHash => dispatch(getAssetDef(assetIpfsHash)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SupplyChainAssetList);
