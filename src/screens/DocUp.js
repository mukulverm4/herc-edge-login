import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, ScrollView, TouchableHighlight, Alert, StatusBar, Clipboard } from 'react-native';
import { connect } from 'react-redux';
import styles from '../assets/styles';
import { addDoc } from '../actions/AssetActions';
import newOriginator from "../components/buttons/originatorButton.png"; // todo: turn into vector
import newRecipient from "../components/buttons/recipientButton.png"; // todo: turn into vector
// import submit from "../components/buttons/submit.png"; // todo: turn into vector
var RNFS = require('react-native-fs')

import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
class DocUp extends Component {

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

      headerTitle:
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
    }
  }
  state = {
    name: null,
    uri: null,
    size: null
  }

  _onSubmit = () => {
    const { navigate } = this.props.navigation;
    let uri = this.state.uri;
    let docName = this.state.name;
    let docSize = this.state.size;
    let docContent = this.state.content;
    let doc = Object.assign({}, this.state, {
      uri: uri,
      size: docSize,
      name: docName,
      content: docContent
    })

    this.props.addDoc(doc);

    navigate('SupplyChainReview', { logo: this.props.logo, name: this.props.name });
  };


  _pickDocument = () => {
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.allFiles()],
    }, (error, res) => {
      //this if(res) allows user to use native android back button to exit docpicker
      if(res){
        if (error) Alert.alert("Something Went Wrong! Error: " + error);
        // Android
        RNFS.readFile(res.uri, 'base64')
        .then(contents => {
          this.setState({
            uri: res.uri,
            name: res.fileName,
            size: res.fileSize,
            type: res.type,
            content: contents
          });
        })
      }
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    let locationImage = this.props.transInfo.location === 'recipient' ? newRecipient : newOriginator;

    return (
      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <View style={{ margin: 25 }}></View>
          <Image source={locationImage} style={[localStyles.assetLocationLabel, { marginTop: 5, marginBottom: 50 }]} />

          <TouchableHighlight onPress={() => this._pickDocument()}>
            <View style={localStyles.menuItemField}>
              <View style={localStyles.menuItemField__textBox}>
                <Text style={localStyles.assetLabel}>Upload Document</Text>
              </View>
            </View>
          </TouchableHighlight>

          {this.state && <View style={localStyles.docContainer}>
            <Text style={localStyles.TransactionReviewTime}>Documents</Text>
            <Text style={localStyles.text}>{this.state.name}</Text>
            <Text style={localStyles.text}>{(this.state.size / 1024).toFixed(3)} kb</Text>
          </View>
          }

          <TouchableHighlight
          style={[localStyles.submitButton, { backgroundColor: 'white' }]}
            onPress={() => this._onSubmit()}
          >
            <Text>Submit</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  transInfo: state.AssetReducers.trans.header,
  logo: state.AssetReducers.selectedAsset.Logo,
  name: state.AssetReducers.selectedAsset.Name
});

const mapDispatchToProps = (dispatch) => ({
  addDoc: (doc) =>
    dispatch(addDoc(doc)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DocUp);

const localStyles = StyleSheet.create({
  submitButton: {
    width: 80,
    borderColor: "black",
    borderWidth: 2,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  assetLocationLabel: {
    height: 30,
    width: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 80
  },
  menuItemField: {
    display: "flex",
    flexDirection: "row",
    width: 200,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 2,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    margin: 10,
    paddingLeft: 3
  },
  assetLabel: {
    color: "black",
    alignSelf: "center",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "normal",
    margin: 2,
    fontFamily: "dinPro"
  },
  menuItemField__textBox: {
    flex: 1
  },
  docContainer: {
    width: "100%",
    height: 75,
  },
  text: {
    color: "white",
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "normal",
    margin: 2,
    fontFamily: "dinPro"
  },
  TransactionReviewTime: {
    color: "#f3c736",
    fontFamily: "dinPro",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold"
  },
});
