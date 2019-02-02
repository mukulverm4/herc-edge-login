import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  View,
  Image,
  TouchableHighlight,
  Alert
} from "react-native";
import { connect } from "react-redux";
import styles from "../assets/styles";
import Button from "react-native-button";
import logo from "../assets/round.png";
import { addAsset, getHercId } from "../actions/AssetActions";
import next from "../components/buttons/nextButton.png"; // todo: turn into vector
import takePhoto from "../components/buttons/takePhoto.png";
import uploadPhoto from "../components/buttons/uploadImage.png";
var ImagePicker = require('react-native-image-picker');


class NewAssetForm extends Component {
  constructor(props) {
    super(props);
    this.setImage = this.setImage.bind(this); // method to set the log from the camera component
    this.state = {}
  }

  static navigationOptions = ({ navigation }) => {

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
          <View style={headerStyles.header__container__centeredBox}>
            <View style={headerStyles.header__image__box}>
              <TouchableHighlight style={{ justifyContent: "center" }} onPress={() => navigation.navigate("MenuOptions")}>
                <Image
                  style={headerStyles.assetHeaderLogo}
                  source={logo}
                />
              </TouchableHighlight>
            </View>
            <View style={headerStyles.header__text__box}>
              <Text style={headerStyles.headerText}>Register</Text>
            </View>
          </View>
        </View>

      )
    }
  }

  setImage = (imgObj) => {
    console.log("trying to set the Logo: ", imgObj)
    this.setState({
      Logo: {
        imageString: imgObj.string,
        uri: imgObj.uri,
        fileSize: imgObj.size
      }
    })

  }

  _takePic = () => {
    const { navigate } = this.props.navigation;
    console.log("Camera: Taking pic......")
    navigate('Camera', { setPic: this.setImage, width: 200 })
  }

  _pickImage = () => {
    console.log("picking image")

    ImagePicker.launchImageLibrary({}, (response) => {
      console.log('Camera: Response = ', response);

      if (response.didCancel) {
        console.log('Camera: User cancelled image picker');
      }
      else if (response.error) {
        console.log('Camera: ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('Camera: User tapped custom button: ', response.customButton);
      }
      else {
        let source = response.uri;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          Logo: {
            imageString: "data:image/jpg;base64," + response.data,
            uri: source,
            fileSize: response.fileSize
          }
        });
      }
    });
  }

  // _pickImage = async () => {
  //   let logo = await ImagePicker.launchImageLibraryAsync({
  //     allowsEditing: false,
  //     aspect: [4, 4],
  //     base64: true
  //   });
  //   alert(logo.uri);
  //
  //   console.log(logo.uri, "logouri");
  //
  //   if (!logo.cancelled) {
  //     this.setState({
  //       Logo: "data:image/png;base64," + logo.base64
  //     });
  //     console.log("image in state");
  //   }
  // };




  _onSubmit = () => {
    const { navigate } = this.props.navigation;
    if (!this.state.Name) {
      Alert.alert("","Please provide a Name for your Asset");
    }
    if(!this.state.Password) {
      Alert.alert("","Please provide a Password for your Asset")
    }
    if (!this.state.Logo) {
      Alert.alert("", "Please select a Logo for your Asset by using the Take Photo or Upload Image buttons")
    }
    if (this.state.CoreProps) {
      let CoreProps = {};
      Object.values(this.state.CoreProps).map(x => {
        CoreProps[x] = "";
      });
      let newAsset = Object.assign({}, {
        ...this.state,
        CoreProps
      });
      if (this.state.Name && this.state.CoreProps) {
        if(this.state.Password && this.state.Logo){
          this.props.addAsset(newAsset);
          navigate("NewAssetConfirm");
        }
      }
    } else {
      Alert.alert("","Please provide a minimum of 1 metric for your Asset");
    }
  }

  // qrSnapshot = () => {
  //   const { navigate } = this.props.navigation;
  //   navigate("QRCapture");
  // };

  render() {
    let Logo;
    this.state.Logo ? Logo = this.state.Logo.uri : Logo = null
    if (this.state.Logo) { console.log("Camera: logo is here") }

    return (
      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <View style={{ flexDirection: 'row', marginBottom: 10, width: '90%', justifyContent: 'center' }}>
            <Text style={localStyles.wordsText}>Enter New </Text>
            <Text style={localStyles.yellowText}>IGVC</Text>
            <Text style={localStyles.wordsText}> Params!</Text>
          </View>
          <ScrollView style={{ alignSelf: "center", width: "100%", paddingRight: 7 }}>
            <View style={localStyles.assetMetricInputField}>
              <Text style={localStyles.text}>Asset Name</Text>
              <TextInput
                autoFocus={true}
                returnKeyType = { "next" }
                onSubmitEditing={() => {  this.asssetPasswordInput.focus() }}
                blurOnSubmit={false}
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid='transparent'
                style={localStyles.input}
                onChangeText={Name => this.setState({ Name })}
                placeholder="Required"
                placeholderTextColor="crimson"
              />
            </View>
            <View style={localStyles.assetMetricInputField}>
              <Text style={localStyles.text}>Asset Password</Text>
              <TextInput
                ref={(input) => { this.asssetPasswordInput = input; }}
                returnKeyType = { "next" }
                onSubmitEditing={() => {  this.metric1.focus() }}
                blurOnSubmit={false}
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid='transparent'
                style={localStyles.input}
                onChangeText={ pass => this.setState({ Password: pass })}
                placeholder="Required"
                placeholderTextColor="crimson"
              />
            </View>
            <View style={localStyles.assetMetricInputField}>
              <Text style={localStyles.text}>Metric 1</Text>
              <TextInput
                ref={(input) => { this.metric1 = input; }}
                blurOnSubmit={false}
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid='transparent'
                style={localStyles.input}
                onChangeText={metric1 =>
                  this.setState({
                    CoreProps: { ...this.state.CoreProps, metric1 }
                  })
                }
                placeholder="Required"
                placeholderTextColor="crimson"
              />
            </View>
            <View style={localStyles.assetMetricInputField}>
              <Text style={localStyles.text}>Metric 2</Text>
              <TextInput
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid='transparent'
                style={localStyles.input}
                onChangeText={metric2 =>
                  this.setState({
                    CoreProps: { ...this.state.CoreProps, metric2 }
                  })
                }
                // placeholder="metric2"
              />
            </View>
            <View style={localStyles.assetMetricInputField}>
              <Text style={localStyles.text}>Metric 3</Text>
              <TextInput
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid='transparent'
                style={localStyles.input}
                onChangeText={metric3 =>
                  this.setState({
                    CoreProps: { ...this.state.CoreProps, metric3 }
                  })
                }
                // placeholder="metric3"
              />
            </View>
            <View style={localStyles.assetMetricInputField}>
              <Text style={localStyles.text}>Metric 4</Text>
              <TextInput
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid='transparent'
                style={localStyles.input}
                onChangeText={metric4 =>
                  this.setState({
                    CoreProps: { ...this.state.CoreProps, metric4 }
                  })
                }
                // placeholder="metric4"
              />
            </View>
            <View style={localStyles.assetMetricInputField}>
              <Text style={localStyles.text}>Metric 5</Text>
              <TextInput
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid='transparent'
                style={localStyles.input}
                onChangeText={metric5 =>
                  this.setState({
                    CoreProps: { ...this.state.CoreProps, metric5 }
                  })
                }
                // placeholder="metric5"
              />
            </View>
            <View style={localStyles.assetMetricInputField}>
              <Text style={localStyles.text}>Metric 6</Text>
              <TextInput
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid='transparent'
                style={localStyles.input}
                onChangeText={metric6 =>
                  this.setState({
                    CoreProps: { ...this.state.CoreProps, metric6 }
                  })
                }
                // placeholder="metric6"
              />
            </View>
            <View style={localStyles.assetMetricInputField}>
              <Text style={localStyles.text}>Metric 7</Text>
              <TextInput
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid='transparent'
                style={localStyles.input}
                onChangeText={metric7 =>
                  this.setState({
                    CoreProps: { ...this.state.CoreProps, metric7 }
                  })
                }
                // placeholder="metric7"
              />
            </View>
            <View style={localStyles.assetMetricInputField}>
              <Text style={localStyles.text}>Metric 8</Text>
              <TextInput
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid='transparent'
                style={localStyles.input}
                onChangeText={metric8 =>
                  this.setState({
                    CoreProps: { ...this.state.CoreProps, metric8 }
                  })
                }
                // placeholder="metric8"
              />
            </View>


            {Logo && (
              <Image
                source={{ uri: Logo }}
                style={{
                  width: 100,
                  height: 100,
                  margin: 10,
                  alignSelf: "center"
                }}
              />
            )}

            <View style={localStyles.imageButtonContainer}>

              {/* <TouchableHighlight
                onPress={() => this.qrSnapshot()}
                style={localStyles.menuItemField__textBox}
              >
                <Image style={localStyles.qrScan} source={qrScan} />
              </TouchableHighlight> */}

              <TouchableHighlight onPress={this._takePic}>
                <Image style={styles.menuButton} source={takePhoto} />
              </TouchableHighlight>

              <TouchableHighlight onPress={this._pickImage}>
                <Image style={styles.menuButton} source={uploadPhoto} />
              </TouchableHighlight>
              <TouchableHighlight onPress={() => this._onSubmit()}>
                <Image style={localStyles.nextButtonContainer} source={next} />
              </TouchableHighlight>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
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
    height: 40,
    width: 200,
    margin: 10,
  },
  imageButtonContainer: {
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 15,
    alignItems: "center"
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
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  }
})

const mapStateToProps = state => ({
  hercId: state.AssetReducers.hercId
});
const mapDispatchToProps = dispatch => ({
  addAsset: newAsset => dispatch(addAsset(newAsset)),
  getHercId: () => dispatch(getHercId())
});

export default connect(mapStateToProps, mapDispatchToProps)(NewAssetForm);
