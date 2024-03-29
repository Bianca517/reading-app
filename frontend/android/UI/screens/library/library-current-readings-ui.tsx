import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import Globals from '../../_globals/Globals';
import Book from '../../components/book';
import Footer from '../../components/footer';
import LibraryPageNavigator from '../../components/library-navigator';
import { get_current_readings } from '../../../services/retrieve-books-service';
import GlobalBookData from '../../_globals/GlobalBookData';


export default function LibraryPageCurrentReadingsUI() {
    const [currentReadingBooks, setCurrentReadingBooks] = useState([]);

    async function loadCurrentReadingBooks() {
        const fetchResponse = await get_current_readings().then();

        if (fetchResponse.success) {
            setCurrentReadingBooks(JSON.parse(fetchResponse.message));
        }
    }

    //this executes on page load
    useEffect(() => {
        if(!GlobalBookData.CURRENT_READINGS) {
            loadCurrentReadingBooks();
        }
        else {
            setCurrentReadingBooks(GlobalBookData.CURRENT_READINGS);
        }
    }, []);

    return (
        <SafeAreaView style={styles.fullscreen_view}>

            <View style={styles.navigation_view}>
                <LibraryPageNavigator librarySection={Globals.LIBRARY_SECTIONS['CURRENT_READINGS']} />
            </View>

            <View style={styles.whiteLine}></View>

            <View style={styles.booksContainer}>
                <View style={{flex: 1}}>   
                    <ScrollView style = {styles.scrollview} contentContainerStyle={styles.booksContainerScrollView}>
                    {
                        /*Warning: Each child in a list should have a unique "key" prop.*/
                        currentReadingBooks.map((book, index) => (
                            <Book key={index} bookFields={JSON.stringify(book)} bookCoverWidth={100} bookCoverHeight={180} bookWithDetails={true}/>
                        ))
                    }
                    </ScrollView>
                </View>
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
        justifyContent: 'center', // Align rows to the start
        alignItems: 'flex-start', // Align items to the start within each row
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
        flexGrow: 1, //DO NOT USE Flex:1 here. it blocks the scroll
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: -7,
        rowGap: 20,
        justifyContent: 'flex-start', // Align rows to the start
        alignItems: 'flex-start', // Align items to the start within each row
    },
    scrollview: {
        flex: 1,
        width: '100%',
    }
})

