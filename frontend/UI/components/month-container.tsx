import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ImageBackground, TouchableHighlight } from 'react-native';
import Globals from '../_globals/Globals';
import { useNavigation } from '@react-navigation/native';
import LibraryPageReadingTrackerEdit from '../screens/library/library-reading-tracker-edit'; // Update the path accordingly

const windowWidth = Dimensions.get('window').width;

type Props = {
    index: number,
    height: number,
    inEditMode: boolean,
};

export default function MonthContainer(props: Props) {
    const navigation = useNavigation();
    const [imageModule, setImageModule] = useState<any>(null);

    //fetch image background path based on received index
    //get name from index 
    let currentMonthName = Globals.MONTHS_LIST[props.index].toLowerCase();
    currentMonthName = currentMonthName[0].toUpperCase() + currentMonthName.substring(1);
    //build firebase storage uri
    const monthImagePath = Globals.MONTHS_BACKGROUND_IMAGES.replace('MONTH', currentMonthName.toLowerCase());

    let rightButtonText = props.inEditMode === true ? 'Done' : 'Edit';

    function checkNavigationOfRightButton() {
        if(true == props.inEditMode) {
            navigation.navigate('Reading Tracker' as never);
            //TODO: save configurations here
        }
        else {
            navigation.navigate('Edit Reading Tracker', { 'monthIndex' : props.index });
        }
    }

    return (
        <View style={[styles.monthContainer, { height: props.height}]}>
            <ImageBackground source={{ uri: monthImagePath }} style={[styles.monthBackground, { height: props.height}]} imageStyle={{ borderRadius: 20 }}>
                <View style={styles.headerMonthContainer}>

                    <View style={[styles.monthTextContainer]}>
                        <Text style={styles.monthNameAndEditText}> {currentMonthName} </Text>
                    </View>

                    <TouchableHighlight style={[styles.monthTextContainer, { marginLeft: 145, width: 70 }]}
                        underlayColor={Globals.COLORS.PURPLE}
                        onPress={() => {checkNavigationOfRightButton()}
                        }>
                        <Text style={[styles.monthNameAndEditText]}> {rightButtonText} </Text>
                    </TouchableHighlight>

                </View>
            </ImageBackground>
            <View style={styles.bookContainerInMonth}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    monthContainer: {
        width: windowWidth - 40,
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginBottom: 25,
    },
    headerMonthContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        paddingHorizontal: 10,
    },
    bookContainerInMonth: {
        flex: 15,
        flexDirection: 'row',
    },
    monthTextContainer: {
        borderRadius: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 20,
    },
    monthNameAndEditText: {
        fontWeight: 'bold',
        fontSize: 17
    },
    monthBackground: {
        flex: 1,
        paddingVertical: 20,
    }
})

