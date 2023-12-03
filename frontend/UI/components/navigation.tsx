import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPageUI from "../login/login-ui"
import HomePageUI from "../home/home-ui"
import FaceDetector from '../test/face-detector';

const Stack = createNativeStackNavigator();

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
        <Stack.Screen name="Test" component={FaceDetector} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}