import React, { useEffect } from "react";
import { useState } from "react";
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Globals from "../../_globals/Globals";
import Checkbox from 'expo-checkbox';
import InterestContainer from "../../components/interest-container";

function SubmitInterests() {
  const navigation = useNavigation();
  const [chosenInterests, setChosenInterests] = useState<string[]>([]);

  function onInterestChosen(genreName: string) {
    const temp: string[] = chosenInterests;
    temp.push(genreName);
    setChosenInterests(temp);
    console.log("chosenInterests are ", chosenInterests);
  }

  function onRemovedInterest(genreName: string) {
    const temp: string[] = chosenInterests;
    temp.splice(chosenInterests.indexOf(genreName), 1);
    setChosenInterests(temp);
    console.log("chosenInterests are ", chosenInterests);
  }

  useEffect(() => {
    console.log("chosenInterests are ", chosenInterests);
  },chosenInterests)

  return (
    <SafeAreaView style={styles.backgroundViewContainer}> 
        <View style={styles.header}>
            <View style={styles.leftLineThrough}></View>
            
            <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>Submit Your Interests</Text>
            </View>

            <View style={styles.rightLineThrough}></View>
        </View>

        <View style={styles.contentContainer}>
            {
                Globals.INTERESTS_LIST.map((genre, index) => {
                    return (
                        <InterestContainer genreName={genre} onChosenInterest={onInterestChosen} onRemovedInterest={onRemovedInterest}/>
                    );
                })
            }
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate('Home' as never)}>
            <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    backgroundViewContainer: {
        flex: 1,
        backgroundColor: Globals.COLORS.BACKGROUND_GRAY,
        flexDirection: 'column',
        alignItems: 'center',
    },
    header: {
        flex: 1,
        marginTop: 30,
        flexDirection: 'row',
        paddingHorizontal: 15,
    },
    contentContainer: {
        flex: 10,
        paddingHorizontal: 15,
        flexWrap: 'wrap',
        paddingTop: 2,
    },
    rightLineThrough: {
        flex: 4,
        backgroundColor: 'white',
        height: 2,
        marginTop: 17,
        marginLeft: 0
    },
    leftLineThrough: {
        flex: 1,
        backgroundColor: 'white',
        height: 2,
        marginTop: 17,
        marginRight: 0
    },
    headerTextContainer: {
        flexDirection: 'column'
    },
    headerText: {
        marginTop: 8,
        flex: 3,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
    },
    scrollview: {
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    submitButton: {
        backgroundColor: '#cc00ff',
        marginBottom: 7,
        width: 270,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitText: {
        color: 'white',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 20,
    }
})

export default SubmitInterests;

