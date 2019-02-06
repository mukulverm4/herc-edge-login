import React, { Component } from 'react';
import { StyleSheet, Platform, TextInput, Text, View, Image, ScrollView, TouchableHighlight, Alert, TouchableNativeFeedback } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Swiper from '../components/TxSwiper';
import { connect } from "react-redux";
import styles from '../assets/styles';

class TxSwiperContainer extends Component {
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
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            transactions: Object.values(this.props.asset.transactions) || ["Data Loading","Please Be Patient"]
        }
    }
    componentDidMount() {
        // console.log(this.state.transactions, 'TxSwiperContainer: state transactions')

    }
    // _renderCards() {
    //     if(this.props.asset.hasOwnProperty('transactions')){
    //         this.setState({
    //             transactions: Object.values(this.props.assets.transactions)
    //         })
    //     }
    //     this.setState({
    //         transactions: ["Data Loading","Please Be Patient"]
    //     })
    // }

    // _goToWebView = () => {
    //   console.log('chance clicked webview')
    //   console.log(this.props,'chance props')
    //   this.props.navigation.navigate('Welcome');
    // }

    render() {
      let hashes = this.props.asset.hashes
      let cards = this.state.transactions.map(x => x);
        return (<Swiper navigation={this.props.navigation} cards={cards} hashes={hashes}/>)}
    }

const mapStateToProps = (state) => ({
    asset: state.AssetReducers.selectedAsset
})

export default connect(mapStateToProps)(TxSwiperContainer);

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
    imageButtons: {
        height: 40,
        width: 175,
        alignSelf: "center",
        margin: 7

    },
})
