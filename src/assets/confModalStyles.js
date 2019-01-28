"use strict";
import { StyleSheet } from "react-native";

module.exports = StyleSheet.create({

container: {
    flex: 1,
    // backgroundColor: "#000040",
    alignItems: "center",
    justifyContent: "center"
  },
modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '50%',
    width: '100%',
    backgroundColor: '#00000040'

},
activityIndicatorWrapper: {
    // backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
},
modalButton: {
  margin: 10,
  justifyContent: 'center',
  alignSelf: 'center',
  borderRadius:2,
  borderWidth: 2,
},
wordsText:{
  textAlign: 'center',
},
closeButtonContainer:{
  flexDirection:'row',
  justifyContent:'flex-end',
  width: '80%',
},
closeButton:{
  padding:15
}

})
