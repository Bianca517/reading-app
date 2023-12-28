import React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert, SafeAreaView, StatusBar, TextInput, TouchableOpacity, Image, TouchableHighlight, TouchableHighlightBase} from 'react-native';
import Globals from "../_globals/Globals";
import Checkbox from 'expo-checkbox';

type Props = {
    genreName: string;
    onChosenInterest: (genreName: string) => void;
    onRemovedInterest: (genreName: string) => void;
}

function InterestContainer( {genreName, onChosenInterest, onRemovedInterest} : Props) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if(isChecked) {
        onChosenInterest(genreName);
        //console.log("apasat");
    }
    else {
        onRemovedInterest(genreName);
        //console.log("removed");
    }
  } , [isChecked]);

  return (
    <View >
    <TouchableOpacity 
        onPress={() => setIsChecked(!isChecked) } // Toggle the state on press
        activeOpacity={0.5}
        >
        
        <View style={styles.genreContainer}>
            <Text style={styles.genreName}>{genreName}</Text>
            <Checkbox
                style={[styles.checkbox, { opacity: isChecked ? 1 : 0 }]}
                value={!isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? Globals.COLORS.CHECKBOX_CHECKED_GREEN : undefined}
            />
        </View>

    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    genreContainer: {
        backgroundColor: Globals.COLORS.INTEREST_CONTAINER_BACKGROUND_LIGHT_PINK,
        width: 170,
        height: 90,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginRight: 20,
        marginBottom: 20,
        paddingHorizontal: 8
    },
    checkbox: {
        margin: 8,
        borderRadius: 10,
        width: 25,
        height: 25,
    },
    genreName: {
        fontSize: 17,
        fontWeight: 'normal',
        textAlign: 'left',
        width: 100
    }
})

export default InterestContainer;

