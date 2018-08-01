import React, { Component } from '../../../../../.cache/typescript/2.9/node_modules/@types/react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableHighlight, Alert, Platform } from 'react-native';
import { StackNavigator } from '../../../../../.cache/typescript/2.9/node_modules/@types/react-navigation';
import { STATUS_BAR_HEIGHT } from '../constants';
import { connect } from '../../../../../.cache/typescript/2.9/node_modules/@types/react-redux';
import hiprLogo from "../assets/hiprLogo.png";
import styles from '../assets/styles';


class HiprAssets extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let headerStyles = StyleSheet.create({
      header__container: {
        // borderColor: "green",
        // borderWidth: 3,
        display: "flex",
        // resizeMode: "contain",
        height: 80,
        alignSelf: "center",
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        marginTop: 40,
        paddingBottom: 20

      },
      header__container__centeredBox: {
        // borderColor: "purple",
        // borderWidth: 3,
        height: "100%",
        alignItems: "center",
        flexDirection: 'row'
      },
      header__text__box: {
        // borderColor: "blue",
        // borderWidth: 3,
        height: "100%",
        marginBottom: 5,
        marginLeft: 12,

      },
      header__image__box: {
        // borderColor: "yellow",
        // borderWidth: 3,
        height: "100%",
        borderRadius: 100
        // width: 50
      },
      assetHeaderLogo: {
        height: 35,
        width: 35,
        borderRadius: 50,
        // resizeMode: "contain",
      },
      headerText: {
        fontFamily: "dinPro",
        fontSize: 26,
        alignSelf: "center",
        fontWeight: "normal",
        color: "black",
        textAlign: "center",
        marginTop: 2,
        // paddingTop: 5
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
                  source={hiprLogo}
                />
              </TouchableHighlight>
            </View>
            <View style={headerStyles.header__text__box}>
              <Text style={headerStyles.headerText}>Validate</Text>
            </View>
          </View>
        </View>

      ),
      headerTitleStyle: {
        height: 50,
        width: 200,
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "row",
        marginLeft: 20
      }
    };
  };
  constructor(props) {
    super(props);

  }

  componentDidMount() {


  }

  _onPress = (asset) => {
    const { navigate } = this.props.navigation;
    navigate('Hipr', { logo: asset.logo, name: asset.name });
  }

  render() {
    const { navigate } = this.props.navigation;
    console.log(this.props)
    let list = this.props.assets.map((asset, index) => {
      return (
        <TouchableHighlight style={{ borderRadius: 2 }} key={index} onPress={() => this._onPress(asset)}>
          <View style={localStyles.menuItemField}>
            {/* <Button onPress={() => this._onDelete(asset.key)} style={styles.assetDeleteButton}>Delete</Button> */}
            <Image style={localStyles.assetLogo} source={{ uri: asset.logo }} />
            <View style={localStyles.menuItemField__textBox}>
              <Text style={localStyles.assetLabel}>{asset.name}</Text>
            </View>
          </View>
        </TouchableHighlight>
      );
    });

    return (

      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            {list}
          </ScrollView>
        </View>
      </View>


    )
  };
}

const mapStateToProps = (state) => ({
  assets: state.Assets,

});

export default connect(mapStateToProps)(HiprAssets);

const localStyles = StyleSheet.create({
  createNew__Box: {
    flexDirection: "row",
    width: 200,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 2,
    alignItems: "center",
    alignContent: "center",
    marginTop: 100,
    paddingLeft: 5,
    // justifyContent: "space-between"
  },
 
  menuItemField: {
    display: "flex",
    flexDirection: "row",
    width: 240,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 3,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    margin: 15,
    // marginTop: 10,
    paddingLeft: 3,
    // borderWidth: 2,
    // borderColor: "black"
  },
  assetLogo: {
    // borderColor: "green",
    // borderWidth: 3,
    height: 25,
    width: 25,
    marginLeft: 2,
    borderRadius: 25 / 2,
    alignSelf: "center"
    // resizeMode: "contain"
  },
  assetLabel: {
    color: "black",
    alignSelf: "center",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "normal",
    margin: 2,
    // marginLeft: "20%",
    fontFamily: "dinPro"
  },
  menuItemField__textBox: {
    // borderColor: "orange",
    // borderWidth: 3,
    flex: 1
  },
});