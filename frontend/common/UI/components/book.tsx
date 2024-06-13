import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import Globals from '../_globals/Globals';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import GlobalBookData from '../_globals/GlobalBookData';
import { NavigationParameters, bookDTO, ResponseType } from '../../types';
import { get_total_nr_of_chapters } from '../../services/book-reading-service';
import GlobalUserData from '../_globals/GlobalUserData';
import { constructURIForBookCover } from './construct-uri-for-bookcover';

type BookProps = {
    bookDTO: bookDTO,
    bookCoverWidth: number,
    bookCoverHeight: number,
    bookWithDetails: boolean,
    bookNavigationOptions: number,
}

export default function Book(props: BookProps) {
    const [isLongPressed, setIsLongPressed] = useState(false);
    const navigation = useNavigation<NavigationProp<NavigationParameters>>();

    //console.log(bookFieldsJSON);
    const bookTitle = props.bookDTO.bookTitle;
    const bookAuthor = props.bookDTO.authorUsername;
    const bookID = props.bookDTO.bookID;
    
  
    let bookCover = "";
    const [userCurrentChapterInBook, setUserCurrentChapterInBook] = useState<number>(); 
    const [isBookInLibrary, setIsBookInLibrary] = useState<boolean>(false);
    const [readPercentageOfBook, setReadPercentageOfBook] = useState<number>(0);
    const [totalNumberOfChapters, setTotalNumberOfChapters] = useState<number>(0);

    function handleLongPress() {
        console.log("handleLongPress: " + isLongPressed);
    }

    useEffect(() => {
        checkIfBookIsInLibrary();
        if(props.bookWithDetails) {
            loadTotalNumberOfChapters();
            getUserCurrentPositionInBook();
        }
    }, []);

    /*
    useEffect(() => {
        calculateReadPercentageOfBook();
    }, [totalNumberOfChapters]);
    */

    function checkIfBookIsInLibrary() {
        setIsBookInLibrary(false);

        if(GlobalBookData.CURRENT_READINGS.length > 0) {
            GlobalBookData.CURRENT_READINGS.forEach((book: bookDTO) => {
                if(bookID == book.bookID) {
                    setIsBookInLibrary(true);
                    //setUserCurrentChapterInBook(book.userPosition);
                }
            });
        }

        if(!isBookInLibrary) {
            if(GlobalBookData.FINALIZED_READINGS.length > 0) {
                GlobalBookData.FINALIZED_READINGS.forEach(book => {
                    if(bookID == book.bookID) {
                        setIsBookInLibrary(true);
                    }
                });
            }
        }
    }

    function getUserCurrentPositionInBook() {
        if(isBookInLibrary) {
            setUserCurrentChapterInBook(parseInt(GlobalBookData.USER_CURRENT_POSITIONS[bookID]));
            console.log(userCurrentChapterInBook);
        }
    }

    async function loadTotalNumberOfChapters() {
        get_total_nr_of_chapters(bookID).then((fetchResponse: ResponseType) => {
            if (fetchResponse.success) {
                const totalNumberOfChapters: number = parseInt(fetchResponse.message);
                setTotalNumberOfChapters(totalNumberOfChapters);
            }
        })
    }

    function calculateReadPercentageOfBook(): number {
        // p/100 * total_chapter = nr_chapter
        let percentage: number = 0;
        console.log(userCurrentChapterInBook);
        if(userCurrentChapterInBook > 0 && totalNumberOfChapters != 0) {
            percentage = Math.round(userCurrentChapterInBook * 100 / totalNumberOfChapters);
        }
   
        return percentage;
    }

    function handleNavigation() {
        switch(props.bookNavigationOptions) {
            case Globals.BOOK_NAVIGATION_OPTIONS.TO_READING_SCREEN: {
                navigation.navigate("Reading Screen", 
                { 
                    "id" : bookID, 
                    "chapterNumber" : parseInt(GlobalBookData.USER_CURRENT_POSITIONS[bookID]), 
                    "bookCoverImage" : bookCover, 
                    "name": bookTitle, 
                    "authorUsername": bookAuthor,
                    isBookInLibrary: isBookInLibrary
                })
                break;
                }

            case Globals.BOOK_NAVIGATION_OPTIONS.TO_DESCRIPTION: {
                navigation.navigate("Prologue", 
                { 
                    "id" : bookID, 
                    "chapterNumber" : 0, 
                    "bookCoverImage" : bookCover, 
                    "name": bookTitle, 
                    "authorUsername": bookAuthor,
                    "numberOfChapters": totalNumberOfChapters
                })
                break;
            }

            case Globals.BOOK_NAVIGATION_OPTIONS.TO_CONTINUE_WRITING: {
                navigation.navigate("Continue Writing",
                    {
                        "bookID": bookID,
                    });
                break;   
            }

            case Globals.BOOK_NAVIGATION_OPTIONS.ADDITIONAL_CHECK: {
                checkIfBookIsInLibrary();
                console.log("podoososd ", isBookInLibrary);
                if(!isBookInLibrary) {
                    navigation.navigate("Prologue", 
                    { 
                        "id" : bookID, 
                        "chapterNumber" : 0, 
                        "bookCoverImage" : bookCover, 
                        "name": bookTitle, 
                        "authorUsername": bookAuthor,
                        "numberOfChapters": totalNumberOfChapters
                    })
                }
                else {
                    navigation.navigate("Reading Screen", 
                    { 
                        "id" : bookID, 
                        "chapterNumber" : parseInt(GlobalBookData.USER_CURRENT_POSITIONS[bookID]), 
                        "bookCoverImage" : bookCover, 
                        "name": bookTitle, 
                        "authorUsername": bookAuthor,
                        isBookInLibrary: isBookInLibrary
                    })
                }
                break;
            }
        }
    }

    if(bookAuthor && bookTitle) {
        bookCover = constructURIForBookCover(bookTitle, bookAuthor);
     
        return (
            <View style={styles.book_container_view}>
                <TouchableOpacity 
                    style={[
                        styles.book_container_button, 
                        { width: props.bookCoverWidth, height: props.bookCoverHeight }
                    ]}
                    onLongPress={() => {
                        setIsLongPressed(true)
                        getUserCurrentPositionInBook();
                    }}
                    onPressOut={() => setIsLongPressed(false)}
                    onPress={() => handleNavigation()}
                >
                
                    <Image style={styles.book_cover} source={{ uri: bookCover }}></Image>
                    <Text style={styles.book_title}>{bookTitle}</Text>
                    <Text style={styles.book_author}>{bookAuthor}</Text>
                </TouchableOpacity>

                {/* this is the overlay view on the book. it displays a circle with a percentage*/}
                {   
                    props.bookWithDetails && isLongPressed && 
                        (<View style={[styles.book_overlay_details_container, {top: props.bookCoverHeight / 4, left: props.bookCoverWidth / 12}]}>
                            <View style={styles.book_overlay_circle}>
                                <Text style={styles.book_overlay_text_percentage}> {calculateReadPercentageOfBook()}% </Text>
                            </View>
                        </View>
                        )
                }
            </View>

            
        );
    }
}

const styles = StyleSheet.create({
    book_container_view: {
        alignSelf: 'flex-start',
        backgroundColor: 'transparent',
        marginTop: 5,
        marginHorizontal: 10,
    },
    book_container_button: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    book_cover: {
        flex: 6.8,
        borderRadius: 3,
        width: '100%'
    },
    book_title: {
        flex: 0.6,
        fontSize: 11,
        fontWeight: "bold",
        fontStyle: 'italic',
    },
    book_author: {
        flex: 0.6,
        fontSize: 8,
        fontWeight: "400"
    },
    book_overlay_details_container: {
        position: 'absolute',
        backgroundColor: 'transparent',
        //backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
    },
    book_overlay_circle: {
        opacity: 1,
        height: 85,
        width: 85,
        borderRadius: 85,
        borderWidth: 3,
        borderColor: Globals.COLORS.PURPLE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    book_overlay_text_percentage: {
        color: Globals.COLORS.PURPLE,
        fontWeight: 'bold',
        fontSize: 20,
    }
})