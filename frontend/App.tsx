import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPageUI from "./UI/login/login-ui"
import HomePageUI from "./UI/home/home-ui"
import TestPage from './UI/test/face-detector';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
         screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name="Login" component={TestPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}