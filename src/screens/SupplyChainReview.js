import React, { Component } from "react";
import { StyleSheet, Platform, TextInput, Text, View, Image, ScrollView, TouchableHighlight, Alert, TouchableNativeFeedback, StatusBar } from "react-native";

import { StackNavigator } from "react-navigation";
import originator from "../components/buttons/originatorButton.png";// todo: turn into vector
import recipient from "../components/buttons/recipientButton.png";// todo: turn into vector
import documents from "../components/buttons/document.png";
import camera from "../components/buttons/camera.png";
import metrics from "../components/buttons/metrics.png";
import EDIT from "../components/buttons/EDI-T.png";
import styles from "../assets/styles";
import { connect } from "react-redux";
import SupplyChainTransactionReview from "../components/SupplyChainTransactionReview";

class SupplyChainReview extends Component {
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
      }
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
      headerTitleStyle: {
        height: 50,
        width: 200,
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "row",
        marginLeft: 20
      },
    };
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    StatusBar.setBackgroundColor("#ffffff");
    StatusBar.setBarStyle("dark-content", true);
  }
  render() {
    const { navigate } = this.props.navigation;
    let locationImage =
      this.props.transHeader.tXLocation === "recipient" ? recipient : originator;
    let logo = this.props.logo;
    let asset = this.props.transHeader;
    let hercId = this.props.hercId;
    return (
      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <ScrollView contentContainerStyle={styles.scrollView}>

            <Text style={localStyles.originatorText}>{this.props.transHeader.tXLocation}</Text>
            <Text style={localStyles.hercIdText}>HERCid: {hercId}</Text>
            <TouchableHighlight
              style={{ marginTop: 8 }}
              onPress={() =>
                navigate("ImageUpload", { logo: logo, name: asset.name })}>
              <Image style={styles.menuButton} source={camera} />
            </TouchableHighlight>


            <TouchableHighlight
              onPress={() =>
                navigate("DocUp", { logo: logo, name: asset.name })}>
              <Image style={styles.menuButton} source={documents} />
            </TouchableHighlight>

            <TouchableHighlight
              onPress={() =>
                navigate("MetricInput", { logo: logo, name: asset.name })}>
              <Image style={styles.menuButton} source={metrics} />
            </TouchableHighlight>

            <TouchableHighlight
              onPress={() => navigate("EdiT", { logo: logo, name: asset.name })}>
              <Image style={styles.menuButton} source={EDIT} />
            </TouchableHighlight>

            <SupplyChainTransactionReview navigate={navigate} />
          </ScrollView>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  logo: state.AssetReducers.selectedAsset.Logo || {},
  transHeader: state.AssetReducers.trans.header || {},
  data: state.AssetReducers.trans.data || null,
  hercId: state.AssetReducers.selectedAsset.hercId || null,
});

export default connect(mapStateToProps)(SupplyChainReview);

const localStyles = StyleSheet.create({
  originatorText: {
    fontSize: 18,
    marginTop: 25,
    marginBottom: 5,
    color: "white"
  },
  hercIdText: {
    fontSize: 18,
    marginTop: 5,
    color: "white",
    fontWeight: "bold"
  }
});
