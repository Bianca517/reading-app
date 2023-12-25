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

                <MonthContainer 
                    index={currentMonthIndex} 
                    height={Globals.MONTH_CONTAINER_HEIGHT_IN_EDIT_READING_TRACKER}
                    inEditMode={true}
                ></MonthContainer> 

                <LinearGradient colors={['#626261', '#494948', '#3a3a39']} style={styles.currentReadingsContainer}>
                    <View style={styles.yourLibraryInfo}>
                        <Text style={styles.yourLibraryInfoText}> Your Library </Text>
                    </View>
                    <ScrollView horizontal={true}>
                        {
                            /*Warning: Each child in a list should have a unique "key" prop.*/
                            currentReadingBooks.map((book, index) => (
                                <Book key={index} bookFields={JSON.stringify(book)} bookCoverWidth={100} bookCoverHeight={160} />
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
        marginTop: 0,
        height: 170,
        paddingHorizontal: 15,
    },   
    yourLibraryInfo: {
        width: 130,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 7,
        marginLeft: -5,
        borderRadius: 10,
        marginBottom: 3,
    },
    yourLibraryInfoText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: Globals.COLORS.PURPLE,
    },
})

