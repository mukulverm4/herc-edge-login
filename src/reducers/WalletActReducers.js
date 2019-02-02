import {
    AUTH_TOKEN,
    GET_ACCOUNT,
    GET_ETH_ADDRESS,
    GETTING_ORGANIZATION,
    GET_WALLET,
    GET_BALANCE,
    UPDATE_BALANCES,
    DEBIT_TRANS,
    DELETE_WALLET,
    STORE_TRANSACTION_IDS,
    CLEAR_TRANSACTION_STORE,
    SWITCH_WALLET,
    ADD_WALLET,
    GET_USERNAME,
    CHECK_LATEST_APK
} from '../actions/types'

const INITIAL_STATE = {
  transactionIdStore: null
}


export default function WalletReducer(state = INITIAL_STATE, action) {
    switch (action.type) {

        case AUTH_TOKEN:
            let token = action.token;
            // console.log('Token captured in reducer', token);
            return Object.assign({}, state, {
                ...state,
                auth_token: token
            })


        case GET_USERNAME:
            let edge_account = action.edge_account;
            return Object.assign({}, state, {
                ...state,
                edge_account: edge_account
            })

        case GET_ACCOUNT:
            let account = action.account;
            return Object.assign({}, state, {
                ...state,
                account
            })


        case GETTING_ORGANIZATION:
            let organizationName = action.organizationName;
            return Object.assign({}, state, {
                ...state,
                organizationName: organizationName
            })

        case UPDATE_BALANCES:
             console.log('UPDATEBALANCES: chance getting balance', action.newBalances);
             return {
                 ...state,
                 watchBalance: action.newBalances
             }

        case GET_ETH_ADDRESS:
            let ethereumAddress = action.ethereumAddress;
            return Object.assign({}, state, {
                ...state,
                ethereumAddress: ethereumAddress
            })

        case GET_WALLET:
            let wallet = action.wallet;
            return Object.assign({}, state, {
                ...state,
                wallet
            })

        case DEBIT_TRANS:
            console.log('DEBIT_TRANS: updating balance', action.hercAmount);
            let newBalance = (state.currentBalance - action.hercAmount);
            console.log(newBalance, 'newBalance');
            return {
                ...state,
                currentBalance: newBalance,
                balance: newBalance
            }

        case GET_BALANCE:
            console.log('GET_BALANCE: getting balance', state);
            return {
                ...state
            }

        case ADD_WALLET:
            console.log('adding Wallet', action);
            let coinName = action.data.currency
            let balance = 0.00
            return {
                ...state,
                wallets: {
                    ...state.wallets,
                    [coinName]: {
                        balance: balance
                    }
                }
            }

        case DELETE_WALLET:
            console.log('getting balance', state, action, "state actions");
            let trimmedWallet = delete state.wallets[action.data.walletName]
            console.log(trimmedWallet, "trimmedWallet")
            return {
                ...state,
                wallets: trimmedWallet
            }


        case CLEAR_TRANSACTION_STORE:
          console.log("jm clearing transactionstore 2/2")
          return {
              ...state,
              transactionIdStore: null
          }


        case STORE_TRANSACTION_IDS:
          console.log("jm transactionIDs in reducer", action.transactionIds)
          return {
              ...state,
              transactionIdStore: action.transactionIds
          }


        case SWITCH_WALLET:
            console.log('getting balance', state);
            return {
                ...state,
                currentWallet: action.data.coin,
                balance: action.data.balance,
            }


        default:
            return state
    }
}
