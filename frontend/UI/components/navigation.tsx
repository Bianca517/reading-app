import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPageUI from "../login/login-ui"
import HomePageUI from "../home/home-ui"
import FaceDetector from '../test/face-detector';
import LibraryPageUI from '../library/library-ui';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2d2d2d',
          },
          headerTintColor: '#eb00ff',
          headerTitleStyle: {
            color: '#eb00ff',
            fontWeight: "bold",
            fontFamily: '',
            fontSize: 20
          },
          headerBackTitleStyle: {

          }
        }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginPageUI} />
        <Stack.Screen name="Home" component={HomePageUI} />
        <Stack.Screen name="Library" component={LibraryPageUI} />
        <Stack.Screen name="Test" component={FaceDetector} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}