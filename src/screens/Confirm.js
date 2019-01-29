import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableHighlight, Alert } from 'react-native';
import originator from "../components/buttons/originatorButton.png";// todo: turn into vector
import recipient from "../components/buttons/recipientButton.png"; // todo: turn into vector
import { StackNavigator } from 'react-navigation';
import { connect } from "react-redux";
import styles from "../assets/styles";
import fee from "../assets/hercLogoPillar.png";
import { addMetrics } from '../actions/AssetActions'
{/* <Image style={styles.assetFee} source={fee} /> */ }



class Confirm extends Component {

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
            // <View style={localStyles.headerField}>
            //     <Image
            //         style={localStyles.hercLogoHeader}
            //         source={{ uri: params.logo }}
            //     />
            //     <Text style={localStyles.registerHeaderText}>{params.name}</Text>
            // </View>

            <View style={headerStyles.header__container}>
                <View style={headerStyles.header__container__centeredBox}>
                    <View style={headerStyles.header__image__box}>
                        {/* <TouchableHighlight style={{justifyContent: "center"}} onPress={() => navigation.navigate("MenuOptions")}>
                 </TouchableHighlight> */}
                        <Image
                            style={headerStyles.assetHeaderLogo}
                            source={{ uri: params.logo }}
                        />
                    </View>
                    <View style={headerStyles.header__text__box}>
                        <Text style={headerStyles.headerText}>{params.name}</Text>
                    </View>
                </View>
            </View>

        )
    }
}

  constructor(props) {
    super(props);

  }
  state = {};


  componentDidMount() {
    console.log(this.props.newMetrics, 'thisnewtransinfo')


  }

  render() {
    // let price = this.state.fctPrice;
    const { navigate } = this.props.navigation;
    console.log(this.props.newMetrics, "txnewMetrics")

    let locationImage = this.props.location === 'originator' ? originator : recipient;
    let logo = this.props.logo;
    // console.log(this.props.Assets);

    let list = this.props.newMetrics
      ?
      Object.keys(this.props.newMetrics).map((propName, idx) => {
        let name = propName;
        return (

          <View key={idx} style={localStyles.assetMetricInputField}>
            <Text style={localStyles.text}>{name}</Text>
            <Text style={localStyles.propVal}>{this.props.newMetrics[name]}</Text>
          </View>
        )
      })
      :
      "No Props"
      ;

    return (
      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <Image style={localStyles.assetLocationLabel} source={locationImage} />
          <ScrollView style={{ alignSelf: "center", width: "100%", paddingRight: 10 }}>
            {list}
            <TouchableHighlight style={{
              backgroundColor: 'white',
              fontSize: 18,
              height: 40,
              width: 80,
              borderColor: "black",
              borderWidth: 2,
              margin: 5,
              padding: 5,
              justifyContent: "center"
            }} onPress={() => navigate('SupplyChainReview', { logo: this.props.logo, name: this.props.name })}>
              <Text>Submit</Text>
            </TouchableHighlight>
            {/* <View style={styles.assetFee}>
            <Image style={styles.assetFeeLabel} source={fee} />
            <Text style={styles.teePrice}>{price}</Text>
          </View> */}
          </ScrollView>
        </View>
      </View>




    )
  }
}


const mapStateToProps = (state) => ({
  newMetrics: state.AssetReducers.trans.data.properties,
  location: state.AssetReducers.trans.header.tXLocation,
  logo: state.AssetReducers.selectedAsset.Logo,
  name: state.AssetReducers.selectedAsset.Name
  // newProperties: state.AssetReducers.selectedAsset.newProperties


});

// const mapDispatchToProps = (dispatch) => ({
//   addMetrics: (metrics) =>
//       dispatch(addMetrics(metrics)
//       )
// })
export default connect(mapStateToProps)(Confirm);

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
  assetLocationLabel: {
    height: 30,
    width: 150,
    resizeMode: "contain",
    marginTop: 10,
    alignSelf: "center"
    // marginRight: 10
  },

  assetMetricInputField: {
    height: 40,
    flexDirection: "row",
    width: "100%",
    borderColor: "blue",
    justifyContent: "space-between",
    margin: 5,
    marginTop: 10,
    marginBottom: 10,
    paddingRight: 5

  },
  propVal: {
    fontFamily: "dinPro",
    fontSize: 15,
    color: "#f3c736",
    margin: 2,
    textAlign: "right"
  },


    text: {
        color: "white",
        alignSelf: "center",
        fontSize: 16,
        fontWeight: "normal",
        margin: 5,
        fontFamily: "dinPro"
    },

})
