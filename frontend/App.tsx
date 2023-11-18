import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPageUI from "./UI/login/login-ui"
import HomePageUI from "./UI/home/home-ui"
import FaceDetector from './UI/test/face-detector';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name="Login" component={HomePageUI} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}