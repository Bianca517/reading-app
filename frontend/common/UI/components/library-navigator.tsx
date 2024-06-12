import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Globals from '../_globals/Globals';

type libraryPageSection = {
    librarySection: number;
};

export default function LibraryPageNavigator(props: libraryPageSection) {
    const navigation = useNavigation();

    return (

        <View style={styles.navigation_buttons_container}>

            <TouchableOpacity
                onPress={() => { navigation.navigate('Library' as never) }}
                style={[styles.library_sections_buttons, { backgroundColor: Globals.LIBRARY_SECTIONS['CURRENT_READINGS'] == props.librarySection ? '#6b6b6b' : 'transparent' }]}
            >
                <Text style={styles.library_sections_buttons_text}> Current </Text>
                <Text style={styles.library_sections_buttons_text}> readings </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => { navigation.navigate('Finalized Books' as never) }}
                style={[styles.library_sections_buttons, { backgroundColor: Globals.LIBRARY_SECTIONS['FINALIZED_READINGS'] == props.librarySection ? '#6b6b6b' : 'transparent' }]}
            >
                <Text style={styles.library_sections_buttons_text}> Finished </Text>
                <Text style={styles.library_sections_buttons_text}> books </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => { navigation.navigate('Reading Tracker' as never) }}
                style={[styles.library_sections_buttons, { backgroundColor: Globals.LIBRARY_SECTIONS['READING_TRACKER'] == props.librarySection ? '#6b6b6b' : 'transparent' }]}
            >
                <Text style={styles.library_sections_buttons_text}> Reading </Text>
                <Text style={styles.library_sections_buttons_text}> tracker </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    navigation_buttons_container: {
        backgroundColor: '#3c3a3a',
        borderRadius: 15,
        width: '90%',
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    library_sections_buttons: {
        //backgroundColor: '#6b6b6b',
        borderRadius: 15,
        width: '30%',
        height: 40,
        alignItems: 'center',
    },
    library_sections_buttons_text: {
        color: 'white',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 18,
        lineHeight: 21
    }
})

