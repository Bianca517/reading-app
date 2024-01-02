import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPageUI from "../screens/login/login-ui"
import HomePageUI from "../screens/home/home-ui"
import FaceDetector from '../test/face-detector';
import LibraryPageCurrentReadingsUI from '../screens/library/library-current-readings-ui';
import LibraryPageFinalizedReadingsUI from '../screens/library/library-finalized-reaginds-ui';
import LibraryPageReadingTrackerUI from '../screens/library/library-reading-tracker-ui';
import LibraryPageReadingTrackerEdit from '../screens/library/library-reading-tracker-edit';
import SubmitInterests from '../screens/submit_interests/interests';
import ReadingScreen from '../screens/reading-screen/reading-ui';
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
        <Stack.Screen name="Submit Interests" component={SubmitInterests} />
        <Stack.Screen name="Home" component={HomePageUI} />
        <Stack.Screen name="Library" component={LibraryPageCurrentReadingsUI} />
        <Stack.Screen name="Library2" component={LibraryPageFinalizedReadingsUI} />
        <Stack.Screen name="Reading Tracker" component={LibraryPageReadingTrackerUI} />
        <Stack.Screen name="Edit Reading Tracker" component={LibraryPageReadingTrackerEdit} initialParams={{ monthIndex: 0 }} />
        <Stack.Screen name="Reading Screen" component={ReadingScreen} />
        <Stack.Screen name="Test" component={FaceDetector} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}