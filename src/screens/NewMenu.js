import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    ScrollView,
    Linking
} from "react-native";
import { VERSION } from '../components/settings.js'
import profileIcon from "../assets/icons/profileIcon.png";
import { connect } from "react-redux";
import firebase from '../constants/Firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class NewMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accountName: this.props.edge_account
        }
    }

    componentDidMount() {
        console.log('****SETTINGS.jS *****', VERSION)
        console.log(this.props.navigation);
    }

    onLogOut = () => {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            console.log("Firebase Sign-out successful.")
        }).catch(err => {
            console.log(err)
            // An error happened.
        })

        this.props.account.logout(function () {
            console.log('hooray im out!')
        })
        this.props.navigation.navigate('Login');
    };


    render() {
        return (
            <View style={localStyles.container}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={localStyles.blockContainer}>
                        <View style={localStyles.block}>
                            <Image style={localStyles.block__icon} source={profileIcon} />
                            <View style={localStyles.block__textBlock}>
                                <Text style={localStyles.subInfo__Text}>Profile</Text>
                                <View style={localStyles.profileBlock}>
                                    <Text style={localStyles.subInfo__TextUserName}>
                                        {this.state.accountName}
                                    </Text>
                                </View>
                            </View>
                        </View>


                        <View style={localStyles.block}>
                            <View style={localStyles.block__bullet}>
                                <Icon name='circle' color="#d7daeb" size={12} />
                            </View>
                            <View style={localStyles.block__textBlock}>
                                <TouchableHighlight onPress={() => { this.props.onItemSelected('MenuOptions'); }}>
                                    <Text style={localStyles.title__Text}>Main</Text>
                                </TouchableHighlight>
                            </View>
                        </View>

                        <View style={localStyles.block}>
                            <View style={localStyles.block__bullet}>
                                <Icon name='circle' color="#d7daeb" size={12} />
                            </View>
                            <View style={localStyles.block__textBlock}>
                                <TouchableHighlight onPress={() => { this.props.onItemSelected('NewAssetLanding'); }}>
                                    <Text style={localStyles.title__Text}>Register Asset</Text>
                                </TouchableHighlight>
                            </View>
                        </View>

                        <View style={localStyles.block}>
                            <View style={localStyles.block__bullet}>
                                <Icon name='circle' color="#d7daeb" size={12} />
                            </View>
                            <View style={localStyles.block__textBlock}>
                                <TouchableHighlight onPress={() => { this.props.onItemSelected('SupplyChainAssetList'); }}>
                                    <Text style={localStyles.title__Text}>Supply Chain</Text>
                                </TouchableHighlight>
                            </View>
                        </View>

                        <View style={localStyles.block}>
                            <View style={localStyles.block__bullet}>
                                <Icon name='circle' color="#d7daeb" size={12} />
                            </View>
                            <View style={localStyles.block__textBlock}>
                                <TouchableHighlight onPress={() => { this.props.onItemSelected('TrackAssetList'); }}>
                                    <Text style={localStyles.title__Text}>Track</Text>
                                </TouchableHighlight>
                            </View>
                        </View>

                        <View style={localStyles.block}>
                            <View style={localStyles.block__bullet}>
                                <Icon name='circle' color="#d7daeb" size={12} />
                            </View>
                            <View style={localStyles.block__textBlock}>
                                <TouchableHighlight onPress={() => { }}>
                                    <Text style={localStyles.title__Text}>Validate</Text>
                                </TouchableHighlight>
                            </View>
                        </View>

                        <View style={localStyles.block}>
                            <View style={localStyles.block__bullet}>
                                <Icon name='circle' color="#d7daeb" size={12} />
                            </View>
                            <View style={localStyles.block__textBlock}>
                                <TouchableHighlight onPress={() => { this.props.onItemSelected('Wallet'); }}>
                                    <Text style={localStyles.title__Text}>Wallet</Text>
                                </TouchableHighlight>
                            </View>
                        </View>

                        <View style={localStyles.block}>
                            <View style={localStyles.block__bullet}>
                                <Icon name='circle' color="#d7daeb" size={12} />
                            </View>
                            <View style={localStyles.block__textBlock}>
                                <TouchableHighlight onPress={() => { this.props.onItemSelected('DocumentStorage'); }}>
                                    <Text style={localStyles.title__Text}>Documents</Text>
                                </TouchableHighlight>
                            </View>
                        </View>

                        <View style={localStyles.block}>
                            <View style={localStyles.block__bullet}>
                                <Icon name='circle' color="#d7daeb" size={12} />
                            </View>
                            <View style={localStyles.block__textBlock}>
                                <TouchableHighlight onPress={() => { }}>
                                    <Text style={localStyles.title__Text}>Retrieve</Text>
                                </TouchableHighlight>
                            </View>
                        </View>

                        <View style={localStyles.block}>
                            <View style={localStyles.block__bullet}>
                                <Icon name='circle' color="#d7daeb" size={12} />
                            </View>
                            <View style={localStyles.block__textBlock}>
                                <TouchableHighlight onPress={() => { Linking.openURL("mailto:social@herc.one?subject=Feedback"); }}>
                                    <Text style={localStyles.title__Text}>Email us</Text>
                                </TouchableHighlight>
                            </View>
                        </View>

                        <View style={localStyles.block}>
                            <View style={localStyles.block__bullet}>
                                <Icon name='circle' color="#d7daeb" size={12} />
                            </View>
                            <View style={localStyles.block__textBlock}>
                                <TouchableHighlight onPress={() => { Linking.openURL("https://herc.one/policy"); }}>
                                    <Text style={localStyles.title__Text}>Privacy Policy</Text>
                                </TouchableHighlight>
                            </View>
                        </View>

                        <View style={localStyles.block}>
                            <View style={localStyles.block__bullet}>
                                <Icon name='circle' color="#d7daeb" size={12} />
                            </View>
                            <View style={localStyles.block__textBlock}>
                                <TouchableHighlight onPress={() => { Linking.openURL("https://herc.one/terms"); }}>
                                    <Text style={localStyles.title__Text}>Terms of Service</Text>
                                </TouchableHighlight>
                            </View>
                        </View>

                        <View style={localStyles.block}>
                            <View style={localStyles.block__bullet}>
                                <Icon name='circle' color="#d7daeb" size={12} />
                            </View>
                            <View style={localStyles.block__textBlock}>
                                <TouchableHighlight onPress={() => this.onLogOut()}>
                                    <Text style={localStyles.logout__Text}>Logout</Text>
                                </TouchableHighlight>
                            </View>
                        </View>

                        <View style={localStyles.footerBlock}>
                            <View>
                                <TouchableHighlight onPress={() => { Linking.openURL("https://www.facebook.com/HERCTOKEN/"); }}>
                                    <Icon name='facebook' style={localStyles.socialIcon} size={24} />
                                </TouchableHighlight>
                            </View>
                            <View>
                                <TouchableHighlight onPress={() => { Linking.openURL("https://twitter.com/HERC_HERCULES"); }}>
                                    <Icon name='twitter' style={localStyles.socialIcon} size={24} />
                                </TouchableHighlight>
                            </View>
                            <View>
                                <TouchableHighlight onPress={() => { Linking.openURL("https://t.me/joinchat/E_FZdg4HNKlqnxKXEEeYxw"); }}>
                                    <Icon name='telegram' style={localStyles.socialIcon} size={24} />
                                </TouchableHighlight>
                            </View>
                            <View>
                                <TouchableHighlight onPress={() => { Linking.openURL("https://discord.gg/ntWZ53W"); }}>
                                    <Icon name='discord' style={localStyles.socialIcon} size={24} />
                                </TouchableHighlight>
                            </View>
                        </View>

                        <View style={localStyles.footerBlock}>
                            <View style={localStyles.footer__textBlock}>
                                <Text style={localStyles.subInfo__Text}> Version {VERSION} </Text>
                                <Text style={localStyles.subInfo__Text}> Mainnet </Text>
                            </View>
                        </View>

                    </View>
                </ScrollView>
            </View>

        );
    }
}

const localStyles = StyleSheet.create({
    block: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 6,
    },
    footerBlock: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignContent: "center",
        alignItems: "center",
        marginVertical: 6,
        marginHorizontal: 12

    },
    profileBlock: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center"
    },
    block__icon: {
        flex: 1,
        height: 48,
        width: 48,
        resizeMode: "contain",
        paddingTop: 4,
    },
    block__bullet: {
        flex: 1,
        alignItems: 'center'
    },
    block__textBlock: {
        flex: 3,
        flexDirection: "column"
    },
    footer__textBlock: {
        flexDirection: "row"
    },
    title__Text: {
        color: "#000000",
        fontSize: 24
    },
    logout__Text: {
        color: "#f6666b",
        fontSize: 24
    },
    subInfo__Text: {
        color: "#8e94af",
        fontSize: 18
    },
    subInfo__TextUserName: {
        color: "#7384e4",
        fontSize: 22
    },
    container: {
        flex: 1,
        backgroundColor: "#f2f3fb",
    },
    blockContainer: {
        marginVertical: 10,
        flex: 1,
    },
    socialIcon: {
        color: '#8e94af'
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
)(NewMenu);
