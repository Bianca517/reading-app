import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import Globals from '../../_globals/Globals';
import Book from '../../components/book';
import Footer from '../../components/footer';
import LibraryPageNavigator from '../../components/library-navigator';
import { get_finalized_readings } from '../../../services/retrieve-books-service';
import GlobalBookData from '../../_globals/GlobalBookData';

export default function LibraryPageFinalizedReadingsUI() {
    const [finalizedBooks, setFinalizedBooks] = useState(GlobalBookData.FINALIZED_READINGS);

    async function loadFinalizedReadingBooks() {
        const fetchResponse = await get_finalized_readings().then();

        if (fetchResponse.success) {
            setFinalizedBooks(JSON.parse(fetchResponse.message));
        }
    }

    //this executes on page load
    useEffect(() => {
        if(!GlobalBookData.FINALIZED_READINGS) {
            loadFinalizedReadingBooks();
        }
        else {
            setFinalizedBooks(GlobalBookData.FINALIZED_READINGS);
        }
    }, []);

    return (
        <SafeAreaView style={styles.fullscreen_view}>

            <View style={styles.navigation_view}>
                <LibraryPageNavigator librarySection={Globals.LIBRARY_SECTIONS['FINALIZED_READINGS']} />
            </View>

            <View style={styles.whiteLine}></View>

            <View style={styles.booksContainer}>
                <ScrollView contentContainerStyle={styles.booksContainerScrollView}>
                {
                    /*Warning: Each child in a list should have a unique "key" prop.*/
                    finalizedBooks.map((book, index) => (
                        <Book key={index} bookFields={JSON.stringify(book)} bookCoverWidth={95} bookCoverHeight={180} bookWithDetails = {true}/>
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
    booksContainer: {
        flex: 6,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start', // Align rows to the start
        alignItems: 'flex-start', // Align items to the start within each row
        columnGap: -3,
        rowGap: 20,
        height: 100, // Set a fixed height for each row
        paddingHorizontal: 7,
    },
    whiteLine: {
        backgroundColor: 'white',
        width: '90%',
        height: 1,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    booksContainerScrollView: {
        flexGrow: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: -7,
        rowGap: 20,
        height: 100, // Set a fixed height for each row
        width: '100%',
        justifyContent: 'flex-start', // Align rows to the start
        alignItems: 'flex-start', // Align items to the start within each row
    }
})

