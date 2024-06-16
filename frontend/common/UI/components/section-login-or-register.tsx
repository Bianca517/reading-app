import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, SafeAreaView, StatusBar, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserAuthenticationResponseType } from '../../types';
import { login_user_service } from '../../services/login-service';
import Globals from '../_globals/Globals';
import { register_user_service } from '../../services/register-service';
import GlobalUserData from '../_globals/GlobalUserData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateJWTToken, showAllAsyncStorage, storeUserToAsyncStorage } from './persistent-login';

const PAGE_SECTIONS: string[] = ["Login", "Register"]

type Props = {
    naviagtionButtonPressed: string,
}

async function handleLogin(userEmail: string, userPassword: string, navigation) {
    const fetchResponse: UserAuthenticationResponseType = await login_user_service(userEmail, userPassword).then();
  showAllAsyncStorage();
    //TODO: remove this
    // navigation.navigate('Home' as never);
    // GlobalUserData.LOGGED_IN_USER_DATA.uid = 'oie24V6tNlEjFCWKuhA3';
    // GlobalUserData.LOGGED_IN_USER_DATA.username = 'Perry';

    const HttpStatus: number = fetchResponse.HttpStatus;
    const statusCode = fetchResponse.Data.success_code;

    if(HttpStatus === 200) {
      //console.log(Globals.LOGGED_IN_USER_DATA.uid);
      //console.log(fetchResponse.Data.success_code);

      if(Globals.STATUS_CODES.USER_LOGGED_IN === statusCode) {
        GlobalUserData.LOGGED_IN_USER_DATA.uid = fetchResponse.Data.user_id;
        GlobalUserData.LOGGED_IN_USER_DATA.username = fetchResponse.Data.username;
        storeUserToAsyncStorage(fetchResponse.Data.user_id, fetchResponse.Data.username);
        navigation.navigate('Home' as never);
      }
    }
    else {
      switch(statusCode) {
        case 1:
          Alert.alert("Incorrect password!");
          break;
        case 2:
          Alert.alert("An account with this email does not exist!");
          break;
      }
   }
}

async function handleRegister(userEmail: string, userPassword: string, userName: string, navigation) {
  const fetchResponse: UserAuthenticationResponseType = await register_user_service(userEmail, userPassword, userName).then();
  console.log(fetchResponse);
  const HttpStatus: number = fetchResponse.HttpStatus;
  const statusCode = fetchResponse.Data.success_code;

  if(HttpStatus === 200) {
   
    //console.log(Globals.LOGGED_IN_USER_DATA.uid);
    //console.log(fetchResponse.Data.success_code);

    if(Globals.STATUS_CODES.USER_CREATED === statusCode) {
      GlobalUserData.LOGGED_IN_USER_DATA.uid = fetchResponse.Data.user_id;
      GlobalUserData.LOGGED_IN_USER_DATA.username = fetchResponse.Data.username;
      
      storeUserToAsyncStorage(fetchResponse.Data.user_id, fetchResponse.Data.username);

      navigation.navigate('Submit Interests' as never)
    }
  }
  else {
    switch(statusCode) {
      case 6:
        Alert.alert("An account with this username or email already exists!");
        break;
      case 5:
        Alert.alert(`Password does not meet criteria! 
          Password shall have at least 7 characters, 1 number and 1 special character!`);
        break;
      case 4:
        Alert.alert("Invalid email!");
        break;
    }
  }
}

export function Section({ naviagtionButtonPressed }: Props) {
    const navigation = useNavigation();
    let [userEmail, setUserEmail] = useState<string>();
    let [userPassword, setUserPassword] = useState<string>();
    let [userName, setUserName] = useState<string>();

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
                //console.log("apasat " + userEmail);
                handleLogin (userEmail, userPassword, navigation);
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
            <TextInput 
              style={[styles.email_password_text_input, { height: 50 }]} 
              placeholder='Your User name' 
              placeholderTextColor='#8e8c8d'
              onChangeText={(text) => setUserName(text)}
              value={userName}>
            </TextInput>
          </View>
  
          <View style={styles.email_password_part}>
            <Text style={styles.email_password_text}>Email address</Text>
            <TextInput 
              style={[styles.email_password_text_input, { height: 50 }]} 
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
              style={[styles.email_password_text_input, { height: 50 }]}
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
              onPress={() => handleRegister(userEmail, userPassword, userName, navigation)}>
              <View style={[styles.sign_in_button, { marginTop: 15 }]}>
                <Text style={styles.login_signup_signin_text}>Register Now</Text>
              </View>
            </TouchableOpacity>
          </View>
  
        </View>
      )
    }
  }
  

const styles = StyleSheet.create({
    content_part: {
        flex: 6,
        //backgroundColor: 'purple',
        flexDirection: 'column',
        marginHorizontal: '5%',
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
})