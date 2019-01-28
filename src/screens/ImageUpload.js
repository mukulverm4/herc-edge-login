import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, ScrollView, TouchableHighlight, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';
import styles from '../assets/styles';
import { connect } from 'react-redux';
import newOriginator from "../components/buttons/originatorButton.png"; // todo: turn into vector
import newRecipient from "../components/buttons/recipientButton.png"; // todo: turn into vector
// import submit from "../components/buttons/submit.png"; // todo: turn into vector
import uploadImage from "../components/buttons/uploadImage.png";
import takePhoto from "../components/buttons/takePhoto.png";
import { addPhoto } from '../actions/AssetActions';
var ImagePicker = require('react-native-image-picker');

class ImageUpload extends Component {
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
      </View>,

      headerTitleStyle: {
        textAlign: 'center',
        alignSelf: 'center',
        backgroundColor: '#021227',
      }
    }
  }
  constructor(props){
    super(props)
    this.setImage = this.setImage.bind(this);
    this.state = {
      image: null,
    }
  }

  async componentWillMount() {
    // const { status } = await Permissions.askAsync(Permissions.CAMERA).then(await Permissions.askAsync(Permissions.CAMERA_ROLL));
    // this.setState({ permissionsGranted: 'granted' });
  }

  setImage = (imgObj) => {
    if(imgObj) console.log("trying to set the Image");

    this.setState({
      image: imgObj.string,
      size: imgObj.size,
      uri: imgObj.path
    })

  }
  _pickImage = () => {
    console.log("ImageUpload Camera: picking image")

    ImagePicker.launchImageLibrary({}, (response) => {

      if (response.didCancel) {
        console.log('ImageUpload Camera: User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImageUpload Camera: ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('ImageUpload Camera: User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };
        this.setState({
          image: "data:image/jpg;base64," + response.data,
          size: response.fileSize,
          uri: source
        });
      }
    });
  }
  _takePic = () => {
    const { navigate } = this.props.navigation;
    console.log("ImageUpload Camera: takingpic")
    navigate('Camera',{ setPic: this.setImage})

  }

  _onSubmit = () => {
    const { navigate } = this.props.navigation;
    let image = this.state;
    this.props.addPhoto(image);
    navigate('SupplyChainReview', { logo: this.props.logo, name: this.props.name })
  };

  render() {
    let image = this.state;
    console.log(Object.keys(image), 'ImageUpload Camera: should be this state');
    let transInfo = this.props.transInfo;
    let locationImage = this.props.transInfo.location === 'recipient' ? newRecipient : newOriginator;
    let logo = this.props.logo;

    return (
      <View style={styles.container} >
        <View style={styles.containerCenter} >
          <View style={{ margin: 25 }}></View>
          <Image source={locationImage} style={[localStyles.assetLocationLabel, { marginTop: 5, marginBottom: 50 }]} />

          {
            image &&
            <Image source={{ uri: image.image }} style={{ width: 200, height: 200, margin: 10 }} />
          }

          <TouchableHighlight onPress={() => this._pickImage()}>
            <Image style={styles.menuButton} source={uploadImage} />
          </TouchableHighlight>

          <TouchableHighlight onPress={() => this._takePic()}>
            <Image style={styles.menuButton} source={takePhoto} />
          </TouchableHighlight>

          <TouchableHighlight
          style={[localStyles.submitButton, { backgroundColor: 'white' }]}
          onPress={() => this._onSubmit()}>
            <Text>Submit</Text>
          </TouchableHighlight>

        </View >
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
  addPhoto: (image) =>
    dispatch(addPhoto(image)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageUpload);

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
});
