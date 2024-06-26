import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import Globals from '../../_globals/Globals';
import Book from '../../components/book';
import Footer from '../../components/footer';
import LibraryPageNavigator from '../../components/library-navigator';
import { get_current_readings } from '../../../services/retrieve-books-service';
import GlobalBookData from '../../_globals/GlobalBookData';
import GlobalUserData from '../../_globals/GlobalUserData';
import { ResponseTypeRetrieveBooks, bookDTO } from '../../../types';
import { useIsFocused } from '@react-navigation/native';
import { loadCurrentReadingBooks } from '../../components/service-calls-wrapper';


export default function LibraryPageCurrentReadingsUI() {
    const [currentReadingBooks, setCurrentReadingBooks] = useState([]);
    const [isLibraryEmpty, setIsLibraryEmpty] = useState(false);

    const isFocused = useIsFocused();

    //this executes on page load
    useEffect(() => {
        if(isFocused){
            console.log("poiii");
            console.log(GlobalBookData.CURRENT_READINGS);
            
            if(GlobalBookData.CURRENT_READINGS.length == 0) {
                loadCurrentReadingBooks().then((books: bookDTO[]) => {
                    if(books!=null && books.length > 0) {
                        GlobalBookData.CURRENT_READINGS = books;
                        setCurrentReadingBooks(books);
                        setIsLibraryEmpty(false);
                    }
                    else {
                        setCurrentReadingBooks([]);
                        setIsLibraryEmpty(true);
                    }
                });
            }
            else {
                setCurrentReadingBooks(GlobalBookData.CURRENT_READINGS);
                setIsLibraryEmpty(false);
            }
        }
    }, [isFocused]);

    return (
        <SafeAreaView style={styles.fullscreen_view}>

            <View style={styles.navigation_view}>
                <LibraryPageNavigator librarySection={Globals.LIBRARY_SECTIONS['CURRENT_READINGS']} />
            </View>

            <View style={styles.whiteLine}></View>

            <View style={styles.booksContainer}>
                <View style={{flex: 1, width: '100%'}}>   
                   
                    {   
                    isLibraryEmpty ? 
                    (
                        <Text style={[styles.empty_library_info, {textAlign: 'center', fontSize: 17}]}>
                            Your library is currently empty :(
                        </Text>
                    )
                    :
                    (
                        <ScrollView style = {styles.scrollview} contentContainerStyle={styles.booksContainerScrollView}>
                         {
                            /*Warning: Each child in a list should have a unique "key" prop.*/
                            currentReadingBooks.map((book, index) => (
                                <Book key={index} bookDTO={book} bookCoverWidth={100} bookCoverHeight={180} bookWithDetails={true} bookNavigationOptions={Globals.BOOK_NAVIGATION_OPTIONS.TO_READING_SCREEN}/>
                            
                            ))
                        }
                        </ScrollView>  
                    )
                    }
                     
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
        //backgroundColor: 'yellow',
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
    },
    empty_library_info: {
        flex: 3,
        marginTop: 3,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        justifyContent: 'center',
        textAlign: 'center',
    },
})

