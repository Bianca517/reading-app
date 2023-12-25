import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, SafeAreaView, Dimensions } from 'react-native';
import Globals from '../../_globals/Globals';
import Book from '../../components/book';
import Footer from '../../components/footer';
import LibraryPageNavigator from '../../components/library-navigator';
import MonthContainer from '../../components/month-container';
import { retrieve_current_readings } from '../../../services/retrieve-books-service';

const windowWidth = Dimensions.get('window').width;

export default function LibraryPageReadingTrackerUI() {
    const [currentReadingBooks, setCurrentReadingBooks] = useState([]);


    async function loadCurrentReadingBooks() {
        const fetchResponse = await retrieve_current_readings().then();

        if (fetchResponse.success) {
            setCurrentReadingBooks(JSON.parse(fetchResponse.responseData));
        }
    }

    //this executes on page load
    useEffect(() => {
        loadCurrentReadingBooks();
    }, []);

    return (
        <SafeAreaView style={styles.fullscreen_view}>

            <View style={styles.navigation_view}>
                <LibraryPageNavigator librarySection={Globals.LIBRARY_SECTIONS['READING_TRACKER']} />
            </View>

            <View style={styles.whiteLine}></View>

            <View style={styles.monthsListContainer}>
                <ScrollView>
                    {
                        Globals.MONTHS_LIST.map((month, index) => (
                            <MonthContainer index={index}></MonthContainer>
                        ))
                    }
                </ScrollView>

            </View>
            <Footer />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    fullscreen_view: {
        backgroundColor: Globals.COLORS.BACKGROUND_GRAY,
        flex: 1,
        flexDirection: 'column',
    },
    navigation_view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    whiteLine: {
        backgroundColor: 'white',
        width: '90%',
        height: 1,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    monthsListContainer: {
        flex: 6,
        flexDirection: 'row',
        paddingHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

