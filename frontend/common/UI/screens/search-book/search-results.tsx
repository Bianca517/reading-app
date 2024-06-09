import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions, SafeAreaView, TextInput , ScrollView} from 'react-native';
import Globals from '../../_globals/Globals';
import { useNavigation } from '@react-navigation/native';
import { ResponseType } from '../../../types';

import { get_books_with_specified_genre, get_books_with_specified_name } from '../../../services/retrieve-books-service';
import Book from '../../components/book';


export default function SearchResultsUI({route}) {
    const navigation = useNavigation();
    const searchByGenre = route.params.searchCriteriaIsGenre;
    const [searchedBooks, setSearchedBooks] = useState([]);
    const [booksNotFound, setBooksNotFound] = useState<boolean>(false);
    //const [searchedBookName, setsearchedBookName] = useState<string>("");
    //const [searchedBookGenre, setsearchedBookGenre] = useState<string>("");

    let searchedBookName: string = ""
    let searchedBookGenre: string = ""

    if(searchByGenre) {
        searchedBookGenre = route.params.searchedBook;
    }
    else {
        searchedBookName = route.params.searchedBook;
    }

    let text_info_to_display = "Results for books with "
    if(searchByGenre) {
        text_info_to_display += "genre "
    }
    else {
        text_info_to_display += "name "
    }


    useEffect(() => {
        loadBooks();
        console.log("Searched book name", searchedBookName);
        console.log("Searched book genre", searchedBookGenre);
    }, []);

    async function loadBooks() {
        let fetchResponse: ResponseType;
        
        if(searchByGenre) {
            fetchResponse = await get_books_with_specified_genre(searchedBookGenre).then();
        }
        else {
            fetchResponse = await get_books_with_specified_name(searchedBookName).then();
        }
        
        console.log("Fetching books", fetchResponse);
        if (fetchResponse.success) {
            const books: [] = JSON.parse(fetchResponse.message);
            if(books.length > 0) {
            setSearchedBooks(books);
            console.log("Saved books", books);
            }
            else {
                setBooksNotFound(true);
            }
        }
        else {
            setBooksNotFound(true);
        }
    }

    
    return(
        <SafeAreaView style={styles.fullscreen_container}>

            <View style={styles.header_container}>
                        
                <Text style = {styles.display_results_text}>
                    {text_info_to_display}
                </Text>   
                <Text style = {[styles.display_results_text, {fontStyle: 'italic'}]}>
                    {
                        searchByGenre &&
                        searchedBookGenre
                    }
                    {
                        !searchByGenre &&
                        searchedBookName
                    }
                </Text>   

                <View style={styles.right_line_through}></View>   
            </View>

            <View style={styles.display_books_grid}>
                <ScrollView contentContainerStyle={styles.display_books_scroll}>
                    {
                        booksNotFound &&
                        <Text> No books found </Text>
                    }
                    {
                        !booksNotFound && searchedBooks &&
                    /*Warning: Each child in a list should have a unique "key" prop.*/
                        searchedBooks.map((book, index) => (
                            <Book key={index} bookFields={JSON.stringify(book)} bookCoverWidth={95} bookCoverHeight={180} bookWithDetails = {false} bookNavigationOptions={Globals.BOOK_NAVIGATION_OPTIONS.ADDITIONAL_CHECK}/>
                        ))
                    }
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    fullscreen_container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Globals.COLORS.BACKGROUND_GRAY,
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    header_container: {
        flex: 1,
        //backgroundColor: 'pink',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    display_books_grid:{
        flex: 9,
        //backgroundColor: 'lightcyan',
        paddingTop: 2,
    },
    right_line_through: {
        backgroundColor: 'white',
        height: 2,
        width: '90%',
        marginTop: 0,
        marginLeft: 0,
    },
    display_results_text: {
        flex: 3,
        marginTop: 3,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        justifyContent: 'flex-start',
        marginHorizontal: 3,
    },
    display_books_scroll: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        columnGap: -5,
        justifyContent: 'flex-start',
    }
})