import React, { Component } from 'react';
import { Modal, Platform, StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableHighlight, Alert, Button, ActivityIndicator } from 'react-native';
import submit from "../components/buttons/submit.png";
import logo from "../assets/round.png";
import { connect } from "react-redux";
import styles from "../assets/styles";
import hercPillar from "../assets/hercLogoPillar.png";
// import Loader from "../components/Loader"
import { incHercId, confirmAssetStarted, confirmAssetComplete, settingHeader, settingHeaderError } from "../actions/AssetActions"
import modalStyle from "../assets/confModalStyles";
import firebase from "../constants/Firebase";

class NewAssetConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            loading: false,
            confirmComplete: false,
        }
    }


    static navigationOptions = ({ navigation }) => {
        return {
            headerTitleStyle:
                { justifyContent: "space-around" },
            headerTitle: (
                <View style={localStyles.headerField}>
                    <Image
                        style={localStyles.hercLogoHeader}
                        source={logo}
                    />
                    <Text style={localStyles.registerHeaderText}>Register</Text>
                </View>
            )
        }
    }

    componentDidMount() {
        this._getOrgName(this.props.edgeAccount)
        this.setState({
            hercId: this.props.hercId
        })
        // if (this.props.dataFlags.confirmStarted) {
        //     this.setState({ loading: true })
        // }
    }
    // componentWillMount() {
    //     // debugger
    //     console.log(this.props.dataFlags, "chance repeat")
    //     if (this.props.dataFlags.confAssetComplete) {
    //         this.setState({ confirmComplete: true })
    //         //   this.props.navigation.navigate('MenuOptions')
    //     }
    // }

    _changeModalVisibility = (visible) => {
        this.setState({
            modalVisible: visible
        })
    }


    _getOrgName(edgeName) {
        var organization_name;

        var rootRef = firebase.database().ref('idology');

        rootRef.child(edgeName)
            .child('organizationName')
            .once('value')
            .then(snapshot => {
                organization_name = snapshot.toJSON();
            }).then(() => {

                console.log(organization_name, 'dddddddddddddddddddddddddddddddd');
                this.setState({
                    orgName: organization_name
                });
            })
    }

    async uploadImageAsync(uri) {
        const { navigate } = this.props.navigation;
        let newAsset = this.props.newAsset;
        const response = await fetch(uri);
        const blob = await response.blob();

        let logoLocation = firebase.storage().ref('assets')
            .child(this.props.edgeAccount)
            .child(newAsset.Name)
            .child("Logo");

        let assetLocation = firebase.database().ref('assets')
            .child(this.props.edgeAccount);

        const snapshot = await logoLocation.put(blob);
        let downloadURL = snapshot.downloadURL;
        let fbAsset, ipfsAsset;


        ipfsAsset = Object.assign({}, {
            url: newAsset.Url || 'No URL',
            Name: newAsset.Name,
            CoreProps: newAsset.CoreProps,
            hercId: this.props.hercId,
        });

        fbAsset = {
            hercId: this.props.hercId,
            Name: newAsset.Name,
            Logo: downloadURL,
            registeredUnder: this.state.orgName
        }

        console.log(ipfsAsset, fbAsset, "right before the send chance")

        this.props.settingHeader(fbAsset);
        this.props.confirmAssetStarted(ipfsAsset);
        this.props.incHercId(this.props.hercId);
        // navigate('ConfirmConf');
    }

    _onPressSubmit() {
        this._changeModalVisibility(true);
        const { navigate } = this.props.navigation;
        let newAsset = this.props.newAsset;
        let hercId = this.state.hercId;
        let edgeAccount = this.props.edgeAccount;
        let fbAssetHdr, ipfsAsset;

        if (this.props.newAsset.Logo) {
            this.uploadImageAsync(this.props.newAsset.Logo.uri)
        } else {
            fbAssetHdr = {
                Name: newAsset.Name,
                hercId: this.props.hercId,
                registeredUnder: this.state.orgName

            }
            ipfsAsset = Object.assign({}, {
                Name: newAsset.Name,
                url: newAsset.Url || "no url",
                CoreProps: newAsset.CoreProps,
                hercId: hercId,
                registeredUnder: this.state.orgName
            });
            this.props.settingHeader(fbAssetHdr);
            this.props.confirmAssetStarted(ipfsAsset);
            this.props.incHercId(this.props.hercId)
            // navigate('ConfirmConf');
        }
    }


    _goToMenu = () => {
        const { navigate } = this.props.navigation;
        this._changeModalVisibility(false);
        navigate('MenuOptions');

    }
    render() {
        const { navigate } = this.props.navigation;
        let price = this.state.fctPrice;
        let hercId = this.props.hercId;
        let newAsset = this.props.newAsset;
        let Logo, Url, list;
        let Name = newAsset.Name;

        console.log(newAsset, "newAsset, look at Logo")
        if (newAsset.Logo) {
            Logo = (<Image style={styles.assetHeaderImage} source={{ uri: newAsset.Logo.uri }} />);
        } else {
            Logo = (<Text style={styles.label}>No Image</Text>)
        }


        if (newAsset.hasOwnProperty('Url')) {
            Url = (<Text style={styles.label}>{newAsset.Url}</Text>);
        } else {
            Url = (<Text style={styles.label}>No Url</Text>)
        }

        if (newAsset.hasOwnProperty('CoreProps')) {
            list = Object.getOwnPropertyNames(newAsset.CoreProps).map((x, i) => {
                let num = (i + 1);
                return (
                    <View key={i} style={localStyles.assetMetricInputField}>
                        <Text style={localStyles.text}>Metric: {num}</Text>
                        <Text style={localStyles.input}>{x}</Text>
                    </View>
                )
            })
        } else { list = (<Text style={styles.label}>No Properties</Text>) }




        return (
            <View style={styles.container}>
                <View style={styles.containerCenter}>

                    <Text style={styles.assetHeaderLabel}>{Name}</Text>
                    {Logo}
                    <Text style={styles.assetHeaderLabel}>{Url}</Text>
                    <Text style={styles.assetHeaderLabel}>HercID: {hercId}</Text>
                    <ScrollView style={{ paddingRight: 5, alignSelf: "center", width: "100%" }}>

                        {list}

                    </ScrollView>

                    <TouchableHighlight onPress={() => this._onPressSubmit()}>
                        <Image source={submit} style={localStyles.imageButtons} />
                    </TouchableHighlight>

                    <View style={localStyles.newAssetFeeContainer}>
                        <Image style={localStyles.assetFeePillarLogo} source={hercPillar} />
                        <Text style={localStyles.assetFeePrice}>1,000</Text>
                    </View>

                </View>
                <Modal
                    transparent={false}
                    animationType={'none'}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { console.log("modal closed") }}
                >
                    <View style={modalStyle.container}>
                        <View style={modalStyle.modalBackground}>
                        <View style={modalStyle.closeButtonContainer}>
                            <TouchableHighlight
                              style={modalStyle.closeButton}
                              onPress={() => this._changeModalVisibility(false)}>
                            <Text style={{ margin: 5, fontSize: 30, color: '#00000070'} }>X</Text>
                            </TouchableHighlight>
                        </View>
                            {!this.props.dataFlags.confirmAssetComplete &&
                                <Text style={modalStyle.wordsText}>Your Asset Information Is Being Written To The Blockchain</Text>
                            }

                            <View style={modalStyle.activityIndicatorWrapper}>
                                <ActivityIndicator
                                    animating={this.props.dataFlags.confirmStarted} size="large" color="#091141" />
                            </View>

                            {this.props.dataFlags.confAssetComplete &&
                                <View>
                                    <Text style={modalStyle.wordsText}>Your Transaction Has Completed!</Text>
                                    <TouchableHighlight
                                      style={modalStyle.modalButton}
                                      onPress={() => this._goToMenu()}>
                                    <Text style={{ margin: 5} }>Back to Menu</Text>
                                    </TouchableHighlight>
                                </View>
                            }

                        </View>
                    </View>
                </Modal>
            </View>



        )
    }


}
const mapStateToProps = (state) => ({
    newAsset: state.AssetReducers.newAsset,
    hercId: state.AssetReducers.hercId,
    edgeAccount: state.WalletActReducers.edge_account,
    dataFlags: state.AssetReducers.dataFlags
});

const mapDispatchToProps = (dispatch) => ({
    settingHeader: (fbHead) => {
        dispatch(settingHeader(fbHead))
    },
    confirmAssetStarted: (asset) =>
        dispatch(confirmAssetStarted(asset)),
    confirmAssetComplete: () =>
        dispatch(confirmAssetComplete()),

    incHercId: (hercid) =>
        dispatch(incHercId(hercid))
})

export default connect(mapStateToProps, mapDispatchToProps)(NewAssetConfirm);


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
    assetMetricInputField: {
        height: 40,
        flexDirection: "row",
        width: "100%",
        borderColor: "blue",
        justifyContent: "space-between",
        margin: 5,
        marginTop: 10,
        marginBottom: 10
    },
    text: {
        color: "white",
        alignSelf: "center",
        fontSize: 16,
        fontWeight: "normal",
        margin: 5,
        fontFamily: "dinPro"
    },
    input: {
        width: "53%",
        height: 24,
        textAlign: "center",
        backgroundColor: "#ffffff",
        fontSize: 16,
        fontWeight: "200",
        borderColor: "blue",
        color: "black",
        borderWidth: 1,
        alignSelf: "center",
        borderRadius: 3
    },
    imageButtons: {
        height: 40,
        width: 175,
        resizeMode: "contain",
        alignSelf: "center",
        margin: 7
    },
    newAssetFeeContainer: {
        height: 50,
        width: 125,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    assetFeePillarLogo: {
        height: 40,
        width: 30,
        backgroundColor: "#091141",
        resizeMode: "contain",
    },
    assetFeePrice: {
        backgroundColor: "#091141",
        textAlign: "center",
        fontSize: 20.2,
        fontWeight: "400",
        color: "white",
        height: 30
    },
    wordsText: {
        height: 23,
        fontSize: 20,
        fontWeight: "600",
        color: "white"
    },
    yellowText: {
        height: 23,
        fontSize: 20,
        fontWeight: "600",
        color: "yellow"
    },


})
