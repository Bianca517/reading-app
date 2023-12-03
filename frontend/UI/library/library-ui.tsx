import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import Footer from '../components/footer';
import Book from '../components/book';
import { retrieve_finalized_readings, retrieve_current_readings } from '../../services/retrieve-books-service';

export default function LibraryPageUI() {

    return (
        <SafeAreaView style={styles.fullscreen_view}>

            <View style={styles.navigation_view}>
                <View style={styles.navigation_buttons_container}>

                    <TouchableOpacity
                        style={[styles.library_sections_buttons]}>
                        <Text style={styles.library_sections_buttons_text}> Current </Text>
                        <Text style={styles.library_sections_buttons_text}> readings </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.library_sections_buttons]}>
                        <Text style={styles.library_sections_buttons_text}> Finalized </Text>
                        <Text style={styles.library_sections_buttons_text}> readings </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.library_sections_buttons]}>
                        <Text style={styles.library_sections_buttons_text}> Reading </Text>
                        <Text style={styles.library_sections_buttons_text}> tracker </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.booksContainer}>

            </View>

            <Footer />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    fullscreen_view: {
        backgroundColor: 'orange',
        flex: 1,
        flexDirection: 'column',
    },
    navigation_view: {
        backgroundColor: 'yellow',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navigation_buttons_container: {
        backgroundColor: '#3c3a3a',
        borderRadius: 15,
        width: '90%',
        height: 50,
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
    },
    booksContainer: {
        backgroundColor: 'red',
        flex: 6
    },
})

