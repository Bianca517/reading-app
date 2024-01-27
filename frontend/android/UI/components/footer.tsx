import React from 'react';
import { StyleSheet, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Globals from '../_globals/Globals';

export default function Footer() {
    const navigation = useNavigation();
    return (
        <View style={
            [styles.navbar_container,
            { height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }]}>
            <FontAwesome.Button name="home" style={styles.menu_button} onPress={() => navigation.navigate('Home' as never)} />
            <FontAwesome.Button name="search" style={styles.menu_button} />
            <FontAwesome.Button name="edit" style={styles.menu_button} onPress={() => navigation.navigate('Write a Book' as never)}/>
            <FontAwesome.Button name="book" style={styles.menu_button} onPress={() => navigation.navigate('Library' as never)} />
        </View>
    );
}

const styles = StyleSheet.create({
    navbar_container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#3c3a3b',
        height: 35,
        borderRadius: 15,
        marginHorizontal: 25,
    },
    menu_button: {
        flex: 1,
        backgroundColor: '#3c3a3b',
        width: 80,
        height: 30,
        paddingHorizontal: 27,
        color: Globals.COLORS.PURPLE
    }
})