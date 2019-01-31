import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableHighlight } from 'react-native';
import styles from "../assets/styles";
import originator from "../components/buttons/originatorButton.png";// todo: turn into vector
import recipient from "../components/buttons/recipientButton.png";// todo: turn into vector
import { StackNavigator, } from 'react-navigation';
import { connect } from "react-redux";
import { addMetrics } from "../actions/AssetActions";
import review from "../components/buttons/reviewBtn.png"; // todo: turn into vector

class MetricInput extends Component {

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
        this.state = {};
    }

    _onSubmit = () => {
        const { navigate } = this.props.navigation;
        let attributes = this.state;
        this.props.addMetrics(attributes);
        navigate('Confirm', { logo: this.props.logo, name: this.props.name });
    }
    render() {

        let locationImage = this.props.location === 'Originator' ? originator : recipient;
        let logo = this.props.logo;

        let list = Object.keys(this.props.coreProps).map((propName, idx) => {
            let name = propName;
            return (
                <View key={idx} style={localStyles.assetMetricInputField}>
                    <Text style={localStyles.text}>{name}</Text>
                    <TextInput
                        style={localStyles.input}
                        onChangeText={text => this.setState({ [propName]: text })}
                        placeholder={name}
                    />
                </View>
            )
        })

        return (
            <View style={styles.container}>
                <View style={[styles.containerCenter, { paddingRight: 5 }]}>
                    <ScrollView style={{ alignSelf: "center", width: "100%" }}>
                        <Image style={localStyles.assetLocationSmall} source={locationImage} />

                        {list}

                        <TouchableHighlight style={{ marginTop: 15 }} onPress={() => this._onSubmit()}>
                            <Image style={localStyles.nextButtonContainer} source={review} />
                        </TouchableHighlight>
                    </ScrollView>
                </View>
            </View>)
    }
}

const mapStateToProps = (state) => ({
    name: state.AssetReducers.selectedAsset.Name,
    logo: state.AssetReducers.selectedAsset.Logo,
    location: state.AssetReducers.trans.header.tXLocation,
    coreProps: state.AssetReducers.selectedAsset.ipfsDef.CoreProps,
});

const mapDispatchToProps = (dispatch) => ({
    addMetrics: (attributes) =>
        dispatch(addMetrics(attributes))
})
export default connect(mapStateToProps, mapDispatchToProps)(MetricInput);


const localStyles = StyleSheet.create({
    assetLocationSmall: {
        height: 30,
        width: 150,
        resizeMode: "contain",
        marginTop: 10,
        alignSelf: "center"
    },
    assetHeaderLogo: {
        height: 35,
        width: 35,
        borderRadius: 35 / 2,
        resizeMode: "contain",
    },
    headerTitle: {
        fontFamily: "dinPro",
        height: 33,
        fontSize: 20,
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
        height: 36,
        textAlign: "center",
        backgroundColor: "#ffffff",
        fontSize: 15,
        fontWeight: "200",
        borderColor: "blue",
        color: "black",
        borderWidth: 1,
        alignSelf: "center",
        borderRadius: 3
    },
    nextButtonContainer: {
        width: 200,
        height: 45,
        alignSelf: "center",
        resizeMode: "contain"
    }
})
