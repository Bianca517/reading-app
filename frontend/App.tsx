import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, SafeAreaView, Pressable, TextInput, TouchableOpacity, Image } from 'react-native';

export default function App() {
  return (
    <SafeAreaView  style={styles.fullscreen_container}>

      <View style = {styles.header}>
        <Text style = {styles.email_password_text}>Logo</Text>
        <Image 
        style={styles.logo_image} 
        source={require('./assets/logo.png')}/>
      </View>

      <View style = {styles.content_part}>

        <View style = {styles.navigator_part_view}>
          <View style = {styles.navigator_buttons_container}>
            <TouchableOpacity style = {styles.login_signup_buttons}>
              <Text style = {styles.login_signup_signin_text}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style = {styles.login_signup_buttons}>
              <Text style = {styles.login_signup_signin_text}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style = {styles.email_password_part}>
          <Text style = {styles.email_password_text}>Email address</Text>
          <TextInput style = {styles.email_password_text_input} placeholder='email@abc.com' placeholderTextColor='#8e8c8d'>
          </TextInput>
        </View>

        <View style = {styles.email_password_part}>
          <Text style = {styles.email_password_text}>Password</Text>
          <TextInput  
            style = {styles.email_password_text_input} 
            placeholder='Your Password' 
            placeholderTextColor='#8e8c8d'
            secureTextEntry
            //</View>right={<TextInput.Icon name="eye" />}
            >
          </TextInput>
        </View>

        <View style={styles.sign_in_button_part}>
          <TouchableOpacity>
            <View style={styles.sign_in_button}>
              <Text style={styles.login_signup_signin_text}>Sign in</Text>
            </View>
        </TouchableOpacity>
        <Text style={[
            styles.login_signup_signin_text, {color:"#cc00ff"}]}>Forgot Password?</Text>
        </View>
      
      </View>

      <View style = {styles.footer}>
        <Text style = {[styles.email_password_text, {color: "white"}]}>Sign in with</Text>

        <View style = {styles.sign_in_options_container}>
        <TouchableOpacity>
          <View style = {styles.sign_in_option}>
            <Image style={styles.sign_in_option_image_apple} source={require('./assets/apple-icon.png')}/>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style = {styles.sign_in_option}>
          <Image style={styles.sign_in_option_image_google} source={require('./assets/google-icon.png')}/>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style = {styles.sign_in_option}>
          <Image style={styles.sign_in_option_image_facebook} source={require('./assets/facebook-icon.png')}/>
          </View>
        </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView >
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
    //backgroundColor: 'white',
    marginHorizontal: '12%',
    marginTop: '2%',
    paddingHorizontal: '7%'
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
    paddingHorizontal: '12%'
  },
  email_password_part: {
    flex: 1,
    //backgroundColor: 'green',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: '11%'
  },
  sign_in_button_part: {
    flex: 1,
    //backgroundColor: 'red',
    alignItems: 'center', //vertically
    justifyContent: 'center', //horizontally
  },
  navigator_buttons_container: {
    backgroundColor: '#3c3a3a',
    marginTop: 30,
    //marginLeft: '12%',
    borderRadius: 15,
    width: '90%',
    height: '45%',
    //paddingHorizontal: '5%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  login_signup_buttons: {
    backgroundColor: '#6b6b6b',
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
    height: '39%',
    placeholderTextColor: 'white',
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
    width: 55,
    height: 55,
    marginTop: 3,
  },
  sign_in_options_container: {
    flexDirection: 'row',
    //backgroundColor: 'blue',
    marginTop: 15,
    height: 40
  },
  sign_in_option: {
    flex:1,
  },
  sign_in_option_image_apple:{
    width: 33,
    height: 33,
    marginHorizontal: 7,
  },
  sign_in_option_image_google:{
    width: 30,
    height: 30,
    marginHorizontal: 7,
    marginTop: 3,
  },
  sign_in_option_image_facebook:{
    width: 38,
    height: 38,
    marginHorizontal: 7,
    marginTop: -2,
  }
  
});