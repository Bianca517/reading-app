import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPageUI from "../login/login-ui"
import HomePageUI from "../home/home-ui"
import FaceDetector from '../test/face-detector';

const Stack = createNativeStackNavigator();

//<Stack.Screen name="Test" component={FaceDetector} />

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginPageUI} />
        <Stack.Screen name="Home" component={HomePageUI} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}