import {
  Button,
  Platform,
  StyleSheet,
  Text,
  Image,
  View,
  PermissionsAndroid
} from 'react-native';
import React, { Component } from 'react';
// import { LoginScreen } from 'edge-login-ui-rn';
import { LoginScreen } from 'herc-edge-login-ui-rn';
import { YellowBox } from 'react-native';
import { connect } from "react-redux";
import axios from 'axios';
import hercLogoPillar from "../assets/hercLogoPillar.png";
import { ethereumCurrencyPluginFactory } from 'edge-currency-ethereum';
import { getUsername, getAccount, authToken, getEthAddress, getWallet, updateBalances } from "../actions/WalletActActions";
import { getHercId, getAssets, clearState } from "../actions/AssetActions";
import { getOrganization } from "../actions/WalletActActions";
import { WEB_SERVER_API_TOKEN, WEB_SERVER_API_LATEST_APK } from "../components/settings";
import { makeEdgeContext } from 'edge-core-js';
import { EDGE_API_KEY } from '../components/settings.js'
import firebase from "../constants/Firebase";

class Login extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      context: null,
      account: null,
      walletId: null,
      wallet: null
    }
  makeEdgeContext({
    // Replace this with your own API key from https://developer.airbitz.co:
    apiKey: EDGE_API_KEY,
    appId: 'one.herc',
    // appId: 'com.mydomain.myapp',
    vendorName: 'Chain Net',
    vendorImageUrl: 'https://s3.us-east-2.amazonaws.com/hercmedia/hLogo.png',
    plugins: [ethereumCurrencyPluginFactory]
  }).then(context => {
    this.setState({ context })
  })
}



  onLogin = async (error = null, account) => {
    let tokenHerc = {
      currencyName: 'Hercules', // 0x6251583e7d997df3604bc73b9779196e94a090ce
      contractAddress: '0x6251583e7D997DF3604bc73B9779196e94A090Ce',
      currencyCode: 'HERC',
      multiplier: '1000000000000000000'
    };
    let customHercTokens = {
      tokens: [ "HERC", "HERCULES" ]
    };
    if (!this.state.account) {
      this.setState({account})
      this.props.getAccount(account);
      this.props.getUsername(account.username);

      let promiseArray = []

      promiseArray.push(axios.get(WEB_SERVER_API_TOKEN + account.username)
        .then(response => {
          let token = response.data
          this.props.authToken(token)
          firebase.auth().signInWithCustomToken(token).catch( error => { console.log(error) })
          axios.defaults.headers.common = {
            'Authorization': token,
            'Content-Type': 'application/x-www-form-urlencoded'
          };
          return response
        })
        .catch(error => { console.log(error) })
      )

      promiseArray.push(axios.get(WEB_SERVER_API_LATEST_APK)
        .then(response => { return response })
        .catch(error => { console.log(error) })
      )

      Promise.all(promiseArray)
        .then(results => {
          console.log("Is this the latest APK?", results[1].data)
          const { navigate } = this.props.navigation;

          this.props.getHercId();
          this.props.getAssets(this.props.username);
          this.props.getOrganization();

          if (results[1].data && results[1].data == true) {
            navigate('MenuOptions') // pass in T/F response from /latest/apk
          } else {
            navigate('MenuOptions', {alertLatestVersion: true})
          }

        })
        .catch(err => {
          console.log(err)
        })

    }
    if (!this.state.walletId) {
      // Check if there is a wallet, if not create it
      let walletInfo = account.getFirstWalletInfo('wallet:ethereum')
      if (walletInfo) {
        this.setState({walletId: walletInfo.id})
        account.waitForCurrencyWallet(walletInfo.id)
          .then(async wallet => {
            wallet.watch('balances', (newBalances) =>
            {
              console.log('NewBalances in login.js: jm', newBalances)
              this.props.updateBalances(newBalances)
            }
          );
            const tokens = await wallet.getEnabledTokens()

            this.props.getEthAddress(wallet.keys.ethereumAddress)
            this.props.getWallet(wallet)
            wallet.addCustomToken(tokenHerc)
            wallet.enableTokens(customHercTokens).catch(err => {console.log("Enable Token Err: jm", err)})
            return wallet
          })
      } else {
        account.createCurrencyWallet('wallet:ethereum', {
          name: 'My First Wallet',
          fiatCurrencyCode: 'iso:USD'
        }).then(async wallet => {
          wallet.watch('balances', (newBalances) => this.props.updateBalances(newBalances));
          this.props.getEthAddress(wallet.keys.ethereumAddress)
          this.props.getWallet(wallet)
          wallet.addCustomToken(tokenHerc)
          wallet.enableTokens(customHercTokens).catch(err => {console.log("Enable Token Err: jm", err)})
          this.setState({walletId: wallet.id})
        })
      }
    }
  }

  renderLoginApp = () => {
    if (this.state.context && !this.state.account) {
      return (
        <LoginScreen
          context={this.state.context}
          onLogin={this.onLogin}
          accountOptions={{}}
        />
      );
    }
    return   <Image source={hercLogoPillar} />;
  };

  render() {
      return (
        <View style={styles.container}>{this.renderLoginApp()}</View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  }
});

const mapStateToProps = (state) => ({
    edge_account: state.AssetReducers.edge_account,
});

const mapDispatchToProps = (dispatch) => ({
    getHercId: () => dispatch(getHercId()),
    getAssets: (name) => dispatch(getAssets(name)),
    getOrganization: () => dispatch(getOrganization()),
    clearState: () => dispatch(clearState()),

    updateBalances: (newBalances) => dispatch(updateBalances(newBalances)),
    getUsername: (edge_account) => dispatch(getUsername(edge_account)),
    authToken: (auth_token) => dispatch(authToken(auth_token)),
    getEthAddress: (ethereumAddress) => dispatch(getEthAddress(ethereumAddress)),
    getWallet: (wallet) => dispatch(getWallet(wallet)),
    getAccount: (account) => dispatch(getAccount(account)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Login);
