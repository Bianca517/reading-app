import React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert, SafeAreaView, StatusBar, TextInput, TouchableOpacity, Image, TouchableHighlight, TouchableHighlightBase} from 'react-native';
import Globals from "../_globals/Globals";
import Checkbox from 'expo-checkbox';

type Props = {
    genreName: string;
    onChosenInterest: (genreName: string) => void;
    onRemovedInterest: (genreName: string) => void;
    interestWithCheckbox: boolean;
}

function InterestContainer( {genreName, onChosenInterest, onRemovedInterest, interestWithCheckbox} : Props) {
  const [isChecked, setIsChecked] = useState(false);
  const [containerColor, setContainerColor] = useState<string>(Globals.COLORS.INTEREST_CONTAINER_BACKGROUND_LIGHT_PINK);

  useEffect(() => {
    setContainerColor(chooseContainerColor(getPositionInInterestsList()));
    //console.log("iar", interestWithCheckbox);
  }, []);

  useEffect(() => {
    if(interestWithCheckbox) {
        if(isChecked) {
            onChosenInterest(genreName);
            //console.log("apasat");
        }
        else {
            onRemovedInterest(genreName);
            //console.log("removed");
        }
    }
  } , [isChecked]);

  function getPositionInInterestsList(): number {
    let i: number = 0;

    for(i = 0; i < Globals.INTERESTS_LIST.length; i++) {
        if(Globals.INTERESTS_LIST[i] === genreName) {
            return i;
        }
    }
    return 0;
  }

    function chooseContainerColor(containerNumber: number): string {
        let index = containerNumber % 5;
        switch (index) {
            case 0:
                return Globals.COLORS.INTEREST_CONTAINER_BACKGROUND_LIGHT_PINK;
            case 1:
                return Globals.COLORS.INTEREST_CONTAINER_BACKGROUND_COLOR_1;
            case 2:
                return Globals.COLORS.INTEREST_CONTAINER_BACKGROUND_COLOR_2;
            case 3:
                return Globals.COLORS.INTEREST_CONTAINER_BACKGROUND_COLOR_3;
            case 4:
                return Globals.COLORS.INTEREST_CONTAINER_BACKGROUND_COLOR_4;
        }
        return Globals.COLORS.INTEREST_CONTAINER_BACKGROUND_LIGHT_PINK;
    }

    function handleButtonOnPress() {
        if(interestWithCheckbox) {
            setIsChecked(!isChecked)
        }
        else {
            console.log("set is checked");
            setIsChecked(true);
            onChosenInterest(genreName);
        }
    }

  return (
    <View >
    <TouchableOpacity 
        onPress={() =>  handleButtonOnPress()} // Toggle the state on press
        activeOpacity={0.5}
        >
        
        <View style={[styles.genreContainer, {backgroundColor: containerColor}]}>
            <Text style={styles.genreName}>{genreName}</Text>
           
           {
            interestWithCheckbox && 
            <Checkbox
                style={[styles.checkbox, { opacity: isChecked ? 1 : 0 }]}
                value={isChecked}
                onValueChange={() => setIsChecked(!isChecked)}
                color={isChecked ? Globals.COLORS.CHECKBOX_CHECKED_GREEN : undefined}
            />
           }
            
            
        </View>

    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    genreContainer: {
        width: 140,
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
        backgroundColor: Globals.COLORS.CHECKBOX_CHECKED_GREEN,
        marginRight: 15,
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

