import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPageUI from "./UI/login/login-ui"

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
         screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name="Login" component={LoginPageUI} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}