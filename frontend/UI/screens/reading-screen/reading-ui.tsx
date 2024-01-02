import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import Globals from '../../_globals/Globals';
import Footer from '../../components/footer';


export default function ReadingScreen() {
    return (
        <SafeAreaView style={styles.fullscreen_view}>
            <View style={styles.header}>
                <Text style={styles.chapter_number}>Chapter 10</Text>
                <Text style={styles.chapter_title}>What a beautiful day</Text>
            </View>

            <View style={styles.white_line}/>

            <View style={styles.content}>
                <ScrollView>

                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    fullscreen_view: {
        backgroundColor: Globals.COLORS.BACKGROUND_GRAY,
        flex: 1,
        flexDirection: 'column',
    },
    header: {
        backgroundColor: 'purple',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    white_line: {
        backgroundColor: 'white',
        width: '80%',
        height: 2,
        alignSelf: 'center',
    },
    content: {
        backgroundColor: 'pink',
        flex: 6,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chapter_number: {
        color: 'white',
        fontWeight: 'normal',
        fontSize: 25,
        marginBottom: 20,
    },
    chapter_title: {
        color: 'white',
        fontWeight: '400',
        fontSize: 20,
    },
})

