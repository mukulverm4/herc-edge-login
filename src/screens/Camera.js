'use strict';
import React, { Component } from 'react';
import { AppRegistry, Dimensions, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, Image, ActivityIndicator, Modal } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { relative } from 'path';
import modalStyle from "../assets/confModalStyles";

export default class Camera extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: null
    }
  }

  constructor(props) {
    super(props);
    const initial = null;
    this.state = {
      capturing: false
    };
  }

  _getSize = (data) => {
    let size = atob(data);
    return (size.length);
  }

  takePicture = async () => {
    this.setState({ capturing: true })
    const { params } = this.props.navigation.state;
    if (this.camera) {
      const options = {
        quality: 0,
        base64: true,
        pauseAfterCapture: true
      }
      if (params.width){
        options.width = params.width
      }

      const data = await this.camera.takePictureAsync(options);
      let image = Object.assign({}, {
        uri: data.uri,
        size: this._getSize(data.base64),
        string: "data:image/jpg;base64," + data.base64
      })
      this.setState({ image }, () => {
        params.setPic(this.state.image)
      })
      this.setState({ capturing: false })
    };
  }

  _pressCancel(){
    this.setState({ image: null })
    if (this.camera){
      this.camera.resumePreview()
    }
  }

  renderCamera() {
    return (
      <RNCamera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={'We need your permission to use your camera phone'}
        onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
        >
        <TouchableHighlight
          style={styles.capture}
          onPress={this.takePicture.bind(this)}
          underlayColor="rgba(255, 255, 255, 0.5)"
          >
          <View/>
        </TouchableHighlight>
      </RNCamera>
    );
  }

  renderImage() {
    return (
      <View>
        <Image
          source={{ uri: this.state.image.uri }}
          style={styles.preview}/>
        <Text
          style={styles.cancel}
          onPress={this._pressCancel.bind(this)}>Cancel</Text>
        <Text
          style={styles.accept}
          onPress={() => this.props.navigation.goBack()}>Accept</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
            transparent={false}
            animationType={'none'}
            visible={this.state.capturing}
            onRequestClose={() => { console.log("modal closed") }}
        >
            <View style={modalStyle.container}>
                <View style={modalStyle.modalBackground}>
                    <View style={modalStyle.activityIndicatorWrapper}>
                    <Text>Snapping Photo</Text>
                        <ActivityIndicator
                            animating={this.state.capturing} size="large" color="#091141" />
                    </View>
                </View>
            </View>
        </Modal>
        {this.state.image ? this.renderImage() : this.renderCamera()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 400,
    width: 400
  },
  capture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#FFF',
    marginBottom: 15,
  },
  cancel: {
    position: 'absolute',
    right: 20,
    top: -5,
    backgroundColor: 'transparent',
    color: '#FFF',
    fontWeight: '600',
    fontSize: 17,
  },
  accept: {
    margin: 10,
    top: -5,
    backgroundColor: 'transparent',
    color: '#FFF',
    fontWeight: '600',
    fontSize: 17,
    alignSelf: 'center'
  }
});
