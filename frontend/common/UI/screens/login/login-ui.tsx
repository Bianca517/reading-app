//import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, SafeAreaView, StatusBar, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import { login_user_service } from '../../../services/login-service';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Globals from '../../_globals/Globals';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeRedirectUri, useAuthRequest, AuthSessionRedirectUriOptions } from 'expo-auth-session';
import * as JWTDecoder from 'jwt-decode';
import { login_user_with_google_service } from '../../../services/google-auth-service';
import { ResponseType } from '../../../types';

WebBrowser.maybeCompleteAuthSession();

const PAGE_SECTIONS: string[] = ["Login", "Register"]

let userEmail: string;
let userPassword: string;

function setUserEmail(text: string) {
  console.warn("user email changed " + userEmail);
  userEmail = text;
}

function setUserPassword(text: string) {
  userPassword = text;
}

function Section({ naviagtionButtonPressed }: { naviagtionButtonPressed: string }) {
  const navigation = useNavigation();
  navigation.setOptions({
    headerShown: false,
  })

  if (PAGE_SECTIONS[0] == naviagtionButtonPressed) {
    return (
      <View style={styles.content_part}>

        <View style={styles.email_password_part}>
          <Text style={styles.email_password_text}>Email address</Text>
          <TextInput
            style={styles.email_password_text_input}
            placeholder='email@abc.com'
            placeholderTextColor='#8e8c8d'
            onChangeText={(text) => setUserEmail(text)}
            value={userEmail}
          >
          </TextInput>
        </View>

        <View style={styles.email_password_part}>
          <Text style={styles.email_password_text}>Password</Text>
          <TextInput
            style={styles.email_password_text_input}
            placeholder='Your Password'
            placeholderTextColor='#8e8c8d'
            secureTextEntry
            onChangeText={(text) => setUserPassword(text)}
            value={userPassword}
          //</View>right={<TextInput.Icon name="eye" />}
          >
          </TextInput>
        </View>

        <View style={styles.sign_in_button_part}>
          <TouchableOpacity
            onPress={() => {
              console.log("apasat " + userEmail);
              {/* login_user_service(userEmail, userPassword) */ }
              navigation.navigate('Home' as never);
            }}>
            <View style={styles.sign_in_button}>
              <Text style={styles.login_signup_signin_text}>Sign In</Text>
            </View>
          </TouchableOpacity>
          <Text style={[
            styles.login_signup_signin_text, { color: "#cc00ff" }]}>Forgot Password?</Text>
        </View>

      </View>
    )
  }
  else {
    return (
      <View style={styles.content_part}>

        <View style={styles.email_password_part}>
          <Text style={styles.email_password_text}>User name</Text>
          <TextInput style={[styles.email_password_text_input, { height: 50 }]} placeholder='Your User name' placeholderTextColor='#8e8c8d'>
          </TextInput>
        </View>

        <View style={styles.email_password_part}>
          <Text style={styles.email_password_text}>Email address</Text>
          <TextInput style={[styles.email_password_text_input, { height: 50 }]} placeholder='email@abc.com' placeholderTextColor='#8e8c8d'>
          </TextInput>
        </View>

        <View style={styles.email_password_part}>
          <Text style={styles.email_password_text}>Password</Text>
          <TextInput
            style={[styles.email_password_text_input, { height: 50 }]}
            placeholder='Your Password'
            placeholderTextColor='#8e8c8d'
            secureTextEntry
          //</View>right={<TextInput.Icon name="eye" />}
          >
          </TextInput>
        </View>

        <View style={styles.sign_in_button_part}>
          <TouchableOpacity onPress={() => navigation.navigate('Submit Interests' as never)}>
            <View style={[styles.sign_in_button, { marginTop: 15 }]}>
              <Text style={styles.login_signup_signin_text}>Register Now</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    )
  }
}

export default function LoginPageUI() {
  const [pageSection, setPageSection] = useState(PAGE_SECTIONS[0]);
  const [fontsLoaded, fontError] = useFonts({
    'DancingScript': require('../../../assets/fonts/DancingScript-Medium.ttf'),
  });

  /* ======================================================= */
  /* ---------------- GOOGLE AUTH PART ----------------------*/
  /* ======================================================= */

  const [request, response, promptAsync] = Google.useAuthRequest({
      //responseType: ResponseType.Token,
      androidClientId: '767042885599-3rr5cohpu1mmmfoapjmof89anq2q9n51.apps.googleusercontent.com',
      scopes: ['email', 'profile'],
      //redirectUri: 'face-recognition://',
    },
  );

  useEffect(() => {
    console.log("received response from google");
  
    if (response) {
      console.log(JSON.stringify(response, null, 2));
      if(response.type === 'success') {
        const token = response.params.id_token;
        console.log(token);
        getUserInfoFromToken(token);
      }
    }
  }, [response]);

  // Function to decode the Google ID token and extract user information
  async function getUserInfoFromToken (idToken) {
    const parts = idToken.split('.');
    var base64 = require('base-64');
    const decodedToken = JSON.parse(base64.decode(parts[1]));
    console.log("decoded token");
    console.log(decodedToken);
    // Extract user information from the decoded token
    const userEmail = decodedToken.email;
    const userName =  decodedToken.name;
    
    const fetchResponse: ResponseType = await login_user_with_google_service(userEmail, userName).then();
    const navigation = useNavigation();
    navigation.setOptions({
      headerShown: false,
    })
  
    if (fetchResponse.success) {
      navigation.navigate('Home' as never);
    }
  };
 

  /* ======================================================= */
  /* ---------------- END - GOOGLE AUTH PART ----------------------*/
  /* ======================================================= */
 

  function onPressNavigationButton(buttonText: string): void {
    //Alert.alert('You pressed the button ' + buttonText + ' !');
    if (PAGE_SECTIONS[0] == buttonText) {
      setPageSection(PAGE_SECTIONS[0])
    }
    else {
      setPageSection(PAGE_SECTIONS[1])
    }
    //TO DO: else(PAGESECTIONS[1] == BUTTONTEXT), ELSE...
    //to handle unexpected state in pageSection
  }


  StatusBar.setBarStyle('light-content', true);
  return (
    <SafeAreaView style={styles.fullscreen_container}>

      <View style={styles.header}>
        <Image
          style={styles.logo_image}
          source={require('../../../assets/logo.jpeg')} />
        <Text style={styles.application_name_text}>BookHub</Text>
      </View>

      <View style={styles.navigator_part_view}>
        <View style={styles.navigator_buttons_container}>

          {/* wrap the calling function with wrapper function () => to avoid function execution before onPress and type error. */}
          <TouchableOpacity
            onPress={() => onPressNavigationButton(PAGE_SECTIONS[0])}
            style={[styles.login_signup_buttons, { backgroundColor: PAGE_SECTIONS[0] == pageSection ? '#6b6b6b' : 'transparent' }]}>
            <Text
              style={styles.login_signup_signin_text}>{PAGE_SECTIONS[0]}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onPressNavigationButton(PAGE_SECTIONS[1])}
            style={[styles.login_signup_buttons, { backgroundColor: PAGE_SECTIONS[1] == pageSection ? '#6b6b6b' : 'transparent' }]}>
            <Text style={styles.login_signup_signin_text}>{PAGE_SECTIONS[1]}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Section
        naviagtionButtonPressed={pageSection}></Section>

      <View style={styles.footer}>
        <Text style={[styles.email_password_text, { color: "white" }]}>{pageSection} with</Text>

        <View style={styles.sign_in_options_container}>
          <TouchableOpacity>
            <View style={styles.sign_in_option}>
              <Image style={styles.sign_in_option_image_apple} source={require('../../../assets/apple-icon.png')} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity disabled={!request} onPress={() => {promptAsync()}}>
            <View style={styles.sign_in_option}>
              <Image style={styles.sign_in_option_image_google} source={require('../../../assets/google-icon.png')} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.sign_in_option}>
              <Image style={styles.sign_in_option_image_facebook} source={require('../../../assets/facebook-icon.png')} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullscreen_container: {
    flex: 1, //so it is fullscreen
    backgroundColor: '#0f0f0f',
    flexDirection: 'column',
  },
  //header, content part and footer are parts of fullscreen container
  //fullscr container is divided into 6+1+1 = 8 parts. header takes 1/8
  header: {
    flex: 1,
    marginHorizontal: '12%',
    paddingTop: 40,
    paddingHorizontal: '7%',
    flexDirection: 'row',
    marginBottom: 10,
  },
  content_part: {
    flex: 6,
    //backgroundColor: 'purple',
    flexDirection: 'column',
    marginHorizontal: '5%',
  },
  footer: {
    flex: 2,
    //backgroundColor: 'black',
    marginHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  navigator_part_view: {
    flex: 1,
    //backgroundColor: 'pink',
    alignItems: 'flex-start',
    paddingHorizontal: '12%',
    marginTop: 10,
    marginBottom: 50,
    marginLeft: 12
  },
  email_password_part: {
    flex: 1,
    //backgroundColor: 'green',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: '11%',
    marginBottom: 10,
  },
  sign_in_button_part: {
    flex: 1,
    //backgroundColor: 'red',
    alignItems: 'center', //vertically
    justifyContent: 'center', //horizontally
    marginTop: 5,
  },
  navigator_buttons_container: {
    backgroundColor: '#3c3a3a',
    marginTop: 30,
    //marginLeft: '12%',
    borderRadius: 15,
    width: '85%',
    height: 60,
    //paddingHorizontal: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  login_signup_buttons: {
    //backgroundColor: '#6b6b6b',
    borderRadius: 15,
    paddingTop: '3%',
    marginHorizontal: '3%',
    width: '43%',
    height: 40,
    alignItems: 'center'
  },
  email_password_text_input: {
    backgroundColor: '#3c3a3a',
    color: 'white',
    fontWeight: '200',
    fontSize: 17,
    borderRadius: 15,
    width: '100%',
    height: 50,
    paddingHorizontal: '5%'
  },
  email_password_text: {
    color: 'white',
    fontSize: 18,
    marginTop: '5%',
    marginLeft: 7,
    fontWeight: '200'
  },
  sign_in_button: {
    backgroundColor: '#cc00ff',
    marginBottom: 7,
    width: 270,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  login_signup_signin_text: {
    color: 'white',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 20,
  },
  logo_image: {
    width: 70,
    height: 70,
    marginTop: 3,
    borderRadius: 20,
  },
  application_name_text: {
    fontFamily: 'DancingScript',
    color: Globals.COLORS.PURPLE,
    fontSize: 45,
    marginLeft: 20,
    marginTop: 5,
  },
  sign_in_options_container: {
    flexDirection: 'row',
    //backgroundColor: 'blue',
    marginTop: 15,
    height: 40
  },
  sign_in_option: {
    flex: 1,
  },
  sign_in_option_image_apple: {
    width: 33,
    height: 33,
    marginHorizontal: 7,
  },
  sign_in_option_image_google: {
    width: 30,
    height: 30,
    marginHorizontal: 7,
    marginTop: 3,
  },
  sign_in_option_image_facebook: {
    width: 38,
    height: 38,
    marginHorizontal: 7,
    marginTop: -2,
  },
  debug_text: {
    color: "white",
    fontSize: 15,
  }

});

