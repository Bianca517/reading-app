import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import Globals from '../../_globals/Globals';
import Book from '../../components/book';
import Footer from '../../components/footer';
import LibraryPageNavigator from '../../components/library-navigator';
import { get_finalized_readings } from '../../../services/retrieve-books-service';
import GlobalBookData from '../../_globals/GlobalBookData';
import GlobalUserData from '../../_globals/GlobalUserData';
import { bookDTO } from '../../../types';
import { loadFinalizedReadingBooks } from '../../components/service-calls-wrapper';
import { useIsFocused } from '@react-navigation/native';

export default function LibraryPageFinalizedReadingsUI() {
    const [finalizedBooks, setFinalizedBooks] = useState<bookDTO[]>([]);
    const isFocused = useIsFocused();

    //this executes on page load
    useEffect(() => {
        if(isFocused) {
            if(!GlobalBookData.FINALIZED_READINGS || GlobalBookData.FINALIZED_READINGS.length == 0) {
                loadFinalizedReadingBooks().then((books: bookDTO[]) => {
                        setFinalizedBooks(books);
                        console.log(books);
                });
            }
            else {
                console.log("aici");
                console.log(GlobalBookData.FINALIZED_READINGS);
                setFinalizedBooks(GlobalBookData.FINALIZED_READINGS);
            }
        }
    }, [isFocused]);

    const renderItem = ({ item }: { item: bookDTO }) => {
        return (
            <Book 
                key={item.bookID} 
                bookDTO={item} 
                bookCoverWidth={95} 
                bookCoverHeight={180} 
                bookWithDetails = {false} 
                bookNavigationOptions={Globals.BOOK_NAVIGATION_OPTIONS.TO_READING_SCREEN}
            />
        );
    }

    function renderWhenEmpty() {
        return (
            <View style={styles.view_when_empty}>
                <Text style={styles.text_when_empty}> You currently do not have any finished books...</Text>
                <Text style={styles.text_when_empty}> Keep reading :) </Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.fullscreen_view}>

            <View style={styles.navigation_view}>
                <LibraryPageNavigator librarySection={Globals.LIBRARY_SECTIONS['FINALIZED_READINGS']} />
            </View>

            <View style={styles.whiteLine}></View>

            <View style={styles.booksContainer}>

                <FlatList
                    data={finalizedBooks}
                    renderItem={renderItem}
                    keyExtractor={item => item.bookID}
                    numColumns={3} 
                    initialNumToRender={9}
                    ListEmptyComponent={() => renderWhenEmpty()}
                    //contentContainerStyle={styles.display_books_scroll}
                />
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
    },
    view_when_empty: {
        //backgroundColor: 'pink',
        width: "100%",
        justifyContent: 'center',
        marginTop: 250,
    },
    text_when_empty: {
        textAlign: 'center',
        color: 'white',
        fontSize: 17,
    }
})

