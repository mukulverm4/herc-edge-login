import {
    AUTH_TOKEN,
    GET_ACCOUNT,
    GET_USERNAME,
    GET_ETH_ADDRESS,
    GET_ORGANIZATION,
    GETTING_ORGANIZATION,
    UPDATE_BALANCES,
    GET_WALLET,
    GET_BALANCE,
    DEBIT_TRANS,
    DELETE_WALLET,
    SWITCH_WALLET,
    ADD_WALLET,
    STORE_TRANSACTION_IDS,
    CLEAR_TRANSACTION_STORE
}
    from './types';
import store from "../store";
import firebase from "../constants/Firebase";
const rootRef = firebase.database().ref();


export function authToken(token) {
    return {
        type: AUTH_TOKEN,
        token
    };
}

export function getAccount(account) {
  return {
    type: GET_ACCOUNT,
    account
  };
}

export function getUsername(edge_account) {
  return {
    type: GET_USERNAME,
    edge_account
  };
}

export function getEthAddress(ethereumAddress) {
  return {
    type: GET_ETH_ADDRESS,
    ethereumAddress
  };
}

export function updateBalances(newBalances) {
    return {
      type: UPDATE_BALANCES,
      newBalances
    };
  }

export function gettingOrganization(organizationName){
  return {
      type: GETTING_ORGANIZATION,
      organizationName
  }
}

export function getOrganization() {
  return dispatch => {
    let username = store.getState().WalletActReducers.edge_account;
    let organizationName;
    rootRef.child('idology').child(username).once('value').then(snapshot => {
      organizationName = snapshot.val().organizationName;
      dispatch(gettingOrganization(organizationName))
    })
  }
}

export function getWallet(wallet) {
    return {
        type: GET_WALLET,
        wallet
    }
}

export function getBalance() {
    return {
        type: GET_BALANCE
    }
}

export function debitTrans(amount) {
    return {
        type: DEBIT_TRANS,
        hercAmount: amount
    }
}

export function deleteWallet(walletName) {

    return {
        type: DELETE_WALLET,
        data: walletName

    }
}

export function clearTransactionStore() {
  console.log("jm clearing transaction store.... 1/2")
  return {
    type: CLEAR_TRANSACTION_STORE
  };
}

export function storeTransactionIds(transactionIds) {
  return {
    type: STORE_TRANSACTION_IDS,
    transactionIds
  };
}

export function switchWallet(walletName) {
    return {
        type: SWITCH_WALLET,
        data: walletName
    }
}

export function addWallet(walletObject) {
    return {
        type: ADD_WALLET,
        data: walletObject

    }
}

export function creditTrans(amount) {
  // this action is unlisted
    return {
        type: CREDIT_TRANS,
        hercAmount: amount
    }
}
