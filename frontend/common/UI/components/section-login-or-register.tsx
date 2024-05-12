import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, SafeAreaView, StatusBar, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserAuthenticationResponseType } from '../../types';
import { login_user_service } from '../../services/login-service';
import Globals from '../_globals/Globals';

const PAGE_SECTIONS: string[] = ["Login", "Register"]

type Props = {
    naviagtionButtonPressed: string,
}

async function handleLogin(userEmail: string, userPassword: string, navigation) {
    const fetchResponse: UserAuthenticationResponseType = await login_user_service(userEmail, userPassword).then();

    const HttpStatus: number = fetchResponse.HttpStatus;
  
    if(HttpStatus === 200) {
      Globals.LOGGED_IN_USER_DATA.uid = fetchResponse.Data.user_id;
      const statusCode = fetchResponse.Data.success_code;
     
      //console.log(Globals.LOGGED_IN_USER_DATA.uid);
      //console.log(fetchResponse.Data.success_code);
      if(Globals.STATUS_CODES.USER_LOGGED_IN === statusCode) {
        navigation.navigate('Home' as never)
      }
      else {
        //TODO: inform user about error
      }
    }
}

export function Section({ naviagtionButtonPressed }: Props) {
    const navigation = useNavigation();
    let [userEmail, setUserEmail] = useState<string>();
    let [userPassword, setUserPassword] = useState<string>();

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