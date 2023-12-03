import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPageUI from "../screens/login/login-ui"
import HomePageUI from "../screens/home/home-ui"
import FaceDetector from '../test/face-detector';
import LibraryPageCurrentReadingsUI from '../screens/library/library-current-readings-ui';
import LibraryPageFinalizedReadingsUI from '../screens/library/library-finalized-reaginds-ui';
import Globals from '../_globals/Globals';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#262626',
          },
          headerTintColor: Globals.COLORS.PURPLE,
          headerTitleStyle: {
            color: Globals.COLORS.PURPLE,
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
        <Stack.Screen name="Library" component={LibraryPageCurrentReadingsUI} />
        <Stack.Screen name="Library2" component={LibraryPageFinalizedReadingsUI} />
        <Stack.Screen name="Test" component={FaceDetector} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}