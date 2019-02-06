import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableHighlight,
  Alert,
  ScrollView,
  WebView,
  Linking
} from "react-native";
import styles from "../assets/styles";
import { VERSION } from '../components/settings.js'
import contributeIcon from "../assets/icons/contributeIcon.png";
import discordIcon from "../assets/icons/discordIcon.png";
import emailUsIcon from "../assets/icons/emailUsIcon.png"; //todo: turn into vector
import facebookIcon from "../assets/icons/facebookIcon.png"; //todo: turn into vector
import networkIcon from "../assets/icons/networkIcon.png";
import privacyPolicyIcon from "../assets/icons/privacyPolicyIcon.png";
import profileIcon from "../assets/icons/profileIcon.png";
import settingsIcon from "../assets/icons/settingsIcon.png";
import telegramIcon from "../assets/icons/telegramIcon.png"; //todo: turn into vector
import termsAndConditionsIcon from "../assets/icons/termsAndConditionsIcon.png";
import twitterIcon from "../assets/icons/twitterIcon.png"; //todo: turn into vector
import versionIcon from "../assets/icons/versionIcon.png";
import { connect } from "react-redux";
import firebase from '../constants/Firebase';
import store from '../store';


export class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accountName: this.props.edge_account
    }
  }

  onLogOut = () => {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
    }).catch(err => {
      console.log(err)
      // An error happened.
    })

    this.props.account.logout(function () {
      console.log('hooray im out!')
    })
    this.props.navigation.navigate('Login');
  };


  static navigationOptions = ({ navigation }) => {
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
        fontWeight: "normal",
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
              <View style={headerStyles.header__image__box}>
                <Image
                  style={headerStyles.assetHeaderLogo}
                  source={settingsIcon}
                />
              </View>
              <View style={headerStyles.header__text__box}>
                <Text style={headerStyles.headerText}>Settings</Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      ),
      headerRight: <View></View>
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={localStyles.container}>
          <ScrollView>
            <View style={localStyles.divider}>
              <View style={localStyles.block}>
                <Image style={localStyles.block__icon} source={profileIcon} />
                <View style={localStyles.block__textBlock}>
                  <Text style={localStyles.title__Text}> Profile </Text>
                  <View style={localStyles.profileBlock}>
                    <Text style={localStyles.subInfo__TextUserName}>
                      {/* {" "} */}
                      {/* {this.props.displayName}{" "} */}
                      {this.state.accountName}
                    </Text>
                    <TouchableHighlight onPress={() => this.onLogOut()}>
                      <View>
                        <Text style={localStyles.profileBlock__logoutText}>
                          LOGOUT
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </View>
            <View style={localStyles.divider}>
              <View style={localStyles.block}>
                <Image style={localStyles.block__icon} source={networkIcon} />
                <View style={localStyles.block__textBlock}>
                  <Text style={localStyles.title__Text}> Network </Text>
                  <Text style={localStyles.subInfo__Text}>
                    Mainnet
                  </Text>
                </View>
              </View>
            </View>
            <View style={localStyles.divider}>
              <TouchableHighlight
                onPress={() => {
                  Linking.openURL("https://twitter.com/HERC_HERCULES");
                }}
              >
                <View style={localStyles.block}>
                  <Image style={localStyles.block__icon} source={twitterIcon} />
                  <View style={localStyles.block__textBlock}>
                    <Text style={localStyles.title__Text}> Twitter </Text>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
            <TouchableHighlight
              onPress={() => {
                Linking.openURL("https://t.me/joinchat/E_FZdg4HNKlqnxKXEEeYxw");
              }}
            >
              <View style={localStyles.divider}>
                <View style={localStyles.block}>
                  <Image style={localStyles.block__icon} source={telegramIcon} />
                  <View style={localStyles.block__textBlock}>
                    <Text style={localStyles.title__Text}> Telegram Group</Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
            <View style={localStyles.divider}>
              <TouchableHighlight onPress={() => {
                Linking.openURL("https://www.facebook.com/HERCTOKEN/");
              }}>
                <View style={localStyles.block}>
                  <Image style={localStyles.block__icon} source={facebookIcon} />
                  <View style={localStyles.block__textBlock}>
                    <Text style={localStyles.title__Text}> Facebook </Text>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
            <TouchableHighlight onPress={() => {
              Linking.openURL("https://discord.gg/ntWZ53W");
            }}>
              <View style={localStyles.block}>
                <Image style={localStyles.block__icon} source={discordIcon} />
                <View style={localStyles.block__textBlock}>
                  <Text style={localStyles.title__Text}> Discord </Text>
                </View>
              </View>
            </TouchableHighlight>
            <Text style={localStyles.sectionHeader}> Support </Text>
            <View style={localStyles.divider}>
              <TouchableHighlight onPress={() => {
                Linking.openURL("mailto:social@herc.one?subject=Feedback");
              }}>

                <View style={localStyles.block}>
                  <Image style={localStyles.block__icon} source={emailUsIcon} />
                  <View style={localStyles.block__textBlock}>
                    <Text style={localStyles.title__Text}> Email Us  </Text>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
            <View style={localStyles.divider}>
              <TouchableHighlight
                onPress={() => {
                  Linking.openURL("https://purchase.herc.one");
                }}
              >
                <View style={localStyles.block}>
                  <Image
                    style={localStyles.block__icon}
                    source={contributeIcon}
                  />
                  <View style={localStyles.block__textBlock}>
                    <Text style={localStyles.title__Text}>
                      Top up HERCs
                    </Text>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
            <View style={localStyles.divider}>
              <TouchableHighlight
                onPress={() => {
                  Linking.openURL("https://herc.one/policy");
                }}
              >
                <View style={localStyles.block}>
                  <Image
                    style={localStyles.block__icon}
                    source={privacyPolicyIcon}
                  />
                  <View style={localStyles.block__textBlock}>
                    <Text style={localStyles.title__Text}> Privacy Policy</Text>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
            <TouchableHighlight
              onPress={() => {
                Linking.openURL("https://herc.one/terms");
              }}
            >
              <View style={localStyles.divider}>
                <View style={localStyles.block}>
                  <Image
                    style={localStyles.block__icon}
                    source={termsAndConditionsIcon}
                  />
                  <View style={localStyles.block__textBlock}>
                    <Text style={localStyles.title__Text}> Terms of Service</Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
            <View style={localStyles.divider}>
              <View style={localStyles.block}>
                <Image style={localStyles.block__icon} source={versionIcon} />
                <View style={localStyles.block__textBlock}>
                  <Text style={localStyles.title__Text}> Version </Text>
                  <Text style={localStyles.subInfo__Text}> Version {VERSION} </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View >
    );
  }
}

const localStyles = StyleSheet.create({
  sectionHeader: {
    color: "gold",
    fontWeight: "normal",
    fontSize: 15,
    marginTop: 10,
    marginBottom: 10
  },
  block: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12
  },
  profileBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center"
  },
  profileBlock__logoutText: {
    color: "red",
    marginRight: 8,
    borderColor: "red",
    borderWidth: 1,
    padding: 3,
    borderRadius: 5,
    textAlign: "center",
    lineHeight: 20
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: "#d3d3d3"
  },
  block__icon: {
    flex: 1,
    height: 22,
    width: 22,
    resizeMode: "contain",
    paddingTop: 4
  },
  block__textBlock: {
    flex: 3,
    flexDirection: "column"
  },
  title__Text: {
    color: "white",
    fontSize: 18
  },
  subInfo__Text: {
    color: "gray",
    fontSize: 10
  },
  subInfo__TextUserName: {
    color: "green",
    fontSize: 15
  },
  container: {
    width: "95%",
    height: "100%",
    backgroundColor: "#091141",
    justifyContent: "flex-start",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  headerText: {
    textAlign: "center",
    alignSelf: "center",
    fontSize: 26,
    fontWeight: "bold"
  },
  text: {
    color: "white",
    textAlign: "left",
    fontSize: 22,
    fontWeight: "normal",
    margin: 5,
    fontFamily: "dinPro"
  }
});

const mapStateToProps = state => ({
  account: state.WalletActReducers.account,
  edge_account: state.WalletActReducers.edge_account,
});

const mapDispatchToProps = dispatch => ({
  getAccount: (account) =>
    dispatch(getAccount(account)),
  getUsername: (edge_account) =>
    dispatch(getUsername(edge_account)),
  fetchAssets: () => dispatch(fetchAssets()),
  getHercId: () => dispatch(getHercId()),
  signOut: () => dispatch(signOut()),
  fetchData: () => dispatch(fetchData())
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
