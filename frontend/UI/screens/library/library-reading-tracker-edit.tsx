import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, SafeAreaView, Dimensions } from 'react-native';
import Globals from '../../_globals/Globals';
import Book from '../../components/book';
import Footer from '../../components/footer';
import LibraryPageNavigator from '../../components/library-navigator';
import MonthContainer from '../../components/month-container';
import { retrieve_current_readings } from '../../../services/retrieve-books-service';
import { LinearGradient } from 'expo-linear-gradient';

const windowWidth = Dimensions.get('window').width;

export default function LibraryPageReadingTrackerEdit({route: routeProps}) {
    const [currentReadingBooks, setCurrentReadingBooks] = useState([]);
    const currentMonthIndex = routeProps.params['monthIndex'];
    console.log("in month " + routeProps.params['monthIndex'] + " editing");

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

            <View style={styles.bodyContentContainer}>

                <MonthContainer index={currentMonthIndex} height={Globals.MONTH_CONTAINER_HEIGHT_IN_EDIT_READING_TRACKER}></MonthContainer> 

                <LinearGradient colors={['#626261', '#494948', '#3a3a39']} style={styles.currentReadingsContainer}>
                    <ScrollView horizontal={true}>
                        {
                            /*Warning: Each child in a list should have a unique "key" prop.*/
                            currentReadingBooks.map((book, index) => (
                                <Book key={index} bookFields={JSON.stringify(book)} bookCoverWidth={110} bookCoverHeight={180} />
                            ))
                        }
                    </ScrollView>
                </LinearGradient>
            
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
    bodyContentContainer: {
        flex: 6,
        flexDirection: 'column',
        paddingHorizontal: 25,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: Globals.COLORS.BACKGROUND_GRAY,
    },
    currentReadingsContainer: {
        width: windowWidth - 50,
        borderRadius: 20,
        marginTop: 5,
        height: 160,
    }   

})

