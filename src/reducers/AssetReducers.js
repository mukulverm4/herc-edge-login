import {
    ADD_ASSET,
    ADD_DOC,
    ADD_METRICS,
    ADD_PHOTO,
    SETTING_HEADER,
    SETTING_HEADER_ERROR,
    CONFIRM_STARTED,
    GOT_IPFS,
    GOT_FACT,
    CONFIRM_ASSET_COMPLETE,
    DELETE_ASSET,
    GET_HERC_ID,
    GET_ORIGIN_TRANS,
    GET_QR_DATA,
    GET_TRANS,
    GETTING_ASSET_DEF,
    GOT_ASSET_DEF,
    ASSET_DEF_ERROR,
    GOT_ASSET_TRANS,
    GOT_HERC_ID,
    GOT_LIST_ASSETS,
    INC_HERC_ID,
    SELECT_ASSET,
    SEND_TRANS,
    SET_SET,
    START_TRANS,
    TRANS_COMPLETE,
    CLEAR_STATE,
} from '../actions/types';
import axios from 'axios';
import store from "../store";
import firebase from '../constants/Firebase';
const rootRef = firebase.database().ref();

import {
    WEB_SERVER_API_IPFS_GET,
    WEB_SERVER_API_IPFS_ADD,
    WEB_SERVER_API_FACTOM_CHAIN_ADD,
    WEB_SERVER_API_FACTOM_ENTRY_ADD,
    WEB_SERVER_API_STORJ_UPLOAD,
    WEB_SERVER_API_CSV
} from "../components/settings"


//synchronous
// let assets = [];
// rootRef.child('assets').on('value', (snapshot) => {
//     snapshot.forEach((obj) => {
//         console.log(obj.toJSON(), 'object in listassets');
//         assets.push({
//             name: obj.toJSON().Name,
//             key: obj.key,
//             logo: obj.toJSON().Logo,
//             // url: obj.toJSON().url
//         });

//     })

// })



const INITIAL_STATE = {
    dataFlags: {
        confirmStarted: false,
        confAssetComplete: false,
    },
    transDataFlags: {
        transStarted: false,
        confTransComplete: false,
    }
}


const AssetReducers = (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case CLEAR_STATE:
        return Object.assign({}, {
            ...state,
            dataFlags: {
                confirmStarted: false,
                confAssetComplete: false,
            },
            transDataFlags: {
                transStarted: false,
                confTransComplete: false,
            }
        })

        case GOT_LIST_ASSETS:
            let assetLabels = action.assets;
            return Object.assign({}, state, {
                ...state,
                assets: assetLabels
            })

        case GETTING_ASSET_DEF:
            return {
                dataFlags: {
                    assetDefFetching: true
                }
            }
        case GOT_ASSET_DEF:
            return Object.assign({}, state, {
                ...state,
                dataFlags: {
                    assetDefFetching: false,
                    assetDefFetched: true,
                }, selectedAsset:
                {
                    ...state.selectedAsset,
                    ipfsDef: action.ipfsDef
                }
            })

        case ASSET_DEF_ERROR:
            return {
                type: ASSET_DEF_ERROR,
                error: action.error
            }

        case SELECT_ASSET:

            return Object.assign({}, state, {
                ...state,
                dataFlags: {
                    assetFetching: false,
                    assetFetched: true,
                },
                selectedAsset: action.selectAsset
            })

        case GOT_HERC_ID:
            let hercId = action.hercId;
            return Object.assign({}, state, {
                ...state,
                hercId
            })

        case INC_HERC_ID:
            let hercID = action.hercIdplus1;
            rootRef.child("hercID").set(hercID);
            return Object.assign({}, state, {
                ...state,
                hercId
            });

        case START_TRANS:
            let trans = action.data;

            return Object.assign({}, state, {
                ...state,
                transDataFlags: {
                    ...state.transDataFlags,
                    transSet: true
                },
                    trans

            })

        case SEND_TRANS:
            return Object.assign({}, state, {
                ...state,
                transDataFlags: {
                    transStarted: true
                },

            })

        case TRANS_COMPLETE:
            // let trans = action.data;
            return Object.assign({}, state, {
                ...state,
                transDataFlags: {
                    ...state.transDataFlags,
                    confTransComplete: true,
                },

                    trans: {
                        ...state.trans,
                }
            }
            )

        case ADD_PHOTO:
            let images = {
                image: action.data,
                size: action.size,
                uri: action.uri
            };

            // let images = [...state.selectedAsset.trans.data.images, image];
            return Object.assign({}, state, {
                ...state,


                    trans: {
                        ...state.trans,
                        data: {
                            ...state.trans.data,
                            images
                        }
                }
            })


        case ADD_DOC:
            let documents = action.document;
            // let documents = [...state.selectedAsset.trans.data.documents, doc];
            return Object.assign({}, state, {
                ...state,
                  trans: {
                      ...state.trans,
                      data: {
                          ...state.trans.data,
                          documents
                      }
                  }
            })

        case ADD_METRICS:
            const properties = action.data;
            return Object.assign({}, state, {
                ...state,

                    trans: {
                        ...state.trans,
                        data: {
                            ...state.trans.data,
                            properties
                        }

                }
            })

        case SET_SET:
            const ediT = action.item
            return Object.assign({}, state, {
                ...state,
             ...state.trans,
                    trans: {
                        ...state.trans,
                        data: {
                            ...state.trans.data,
                            ediT
                        }
                }

            })

        ///// CONFIRM ASSETS REDUCERS /////

        case ADD_ASSET:
            const newAsset = action.newAsset;
            return Object.assign({}, state, {
                ...state,
                newAsset
            })



        case SETTING_HEADER:
            return Object.assign({}, state, {
                ...state,
                dataFlags: {
                    ...state.dataFlags,
                    headerSet: true
                }
            })

        case SETTING_HEADER_ERROR:
            return Object.assign({}, state, {
                ...state,
                dataFlags: {
                    ...state.dataFlags,
                    error: {
                        type: action.type,
                        error
                    }
                }
            })

        case CONFIRM_STARTED:
            return {
                ...state,
                dataFlags: {
                    ...state.dataFlags,
                    confirmStarted: true,

                }
            }


        case GOT_IPFS:
            return {
                ...state,
                dataFlags: {
                    ...state.dataFlags,
                    gotIpfs: true,
                },
                newAsset: {
                        ...state.newAsset,
                        ipfsHash: action.ipfsHash

                    }
            }
        case GOT_FACT:
            return {
                ...state,
                dataFlags: {
                    ...state.dataFlags,
                    gotIpfs: true,
                },
                newAsset: {
                    ...state.newAsset,
                    chainId: action.chainId
                }
            }

        case CONFIRM_ASSET_COMPLETE:
            const asset = action.newAsset;

            return Object.assign({}, state, {
                ...state,
                dataFlags: {
                    ...state.dataFlags,
                    confirmStarted: false,
                    confAssetComplete: true
                }

            })




        case DELETE_ASSET:
            const key = action.delKey;
            rootRef.child('assets').child(key).remove();
            return state;


        default:
            return state;
    }
}


export default AssetReducers;
