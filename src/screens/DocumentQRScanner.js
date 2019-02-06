import React from 'react';
import { ScrollView, StyleSheet, View, Text, Button, Linking } from 'react-native';
// import { Constants, BarCodeScanner, Permissions, FileSystem, WebBrowser } from "expo";
import { RNCamera } from "react-native-camera";


export default class LinksScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            result: ""
        };
    }
    static navigationOptions = {
        title: null,
    };

    _requestCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === "granted"
        });
    };

    _handleBarCodeRead = payload => {
        const scanResult = payload.data;
        this.setState(
            {
                result: scanResult
            }, () => this._downloadFromURL()
        )
    };

    _downloadFromURL = async (remoteUrl) => {
        console.log("running download from url")
        // FileSystem.downloadAsync(
        //     'http://techslides.com/demos/sample-videos/small.mp4',
        //     FileSystem.documentDirectory + 'sample-video/' + 'small.mp4'
        // )
        //     .then(({ uri }) => {
        //         // let direct = FileSystem.documentDirectory + 'sample-video/';
        //         // console.log('Finished downloading to ', uri);
        //         Expo.FileSystem.getInfoAsync(uri, contents)
        //     })
        //     .catch(error => {
        //         console.error(error);
        //     });
        // WebBrowser.openBrowserAsync(this.state.result)

        Linking.openURL(this.state.result).catch(err => console.error('An error occurred', err));

    }

    render() {
        return (
            <View style={localStyles.container}>

                <RNCamera
                    barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    style={localStyles.preview}
                    onBarCodeRead={this._handleBarCodeRead}
                    ref={cam => (this.camera = cam)}
                >
                </RNCamera>
                {/* <Button
                    onPress={() => {
                        this._handleBarCodeRead();
                    }}
                    title="click to simulate scan"
                    color="#841584"
                    accessibilityLabel="click to simulate scan"
                /> */}

                <Text>{this.state.result && JSON.stringify(this.state.result)}</Text>
            </View>
        );
    }
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
        justifyContent: "center",
        alignItems: "center",
    },
    preview: {
        flex: 1,
        width: "100%",
        justifyContent: "flex-end",
        alignItems: "center"
    }
});
