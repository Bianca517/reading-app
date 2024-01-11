import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import Globals from '../_globals/Globals';
import { useNavigation } from '@react-navigation/native';
import GlobalBookData from '../_globals/GlobalBookData';

type BookProps = {
    bookFields: string,
    bookCoverWidth: number,
    bookCoverHeight: number,
    bookWithDetails: boolean,
}

export default function Book(props: BookProps) {
    const [isLongPressed, setIsLongPressed] = useState(false);
    const navigation = useNavigation();
    let bookFieldsJSON = JSON.parse(props.bookFields);
    const bookTitle = bookFieldsJSON[Globals.BOOK_COLLECTION_FIELDS[0]];
    const bookAuthor = bookFieldsJSON[Globals.BOOK_COLLECTION_FIELDS[1]];
    const bookID = bookFieldsJSON[Globals.BOOK_COLLECTION_FIELDS[Globals.BOOK_COLLECTION_FIELDS_ID_INDEX]];
    let bookCover = "";
    const [userCurrentChapterInBook, setUserCurrentChapterInBook] = useState<number>(-1); 
    const [isBookInLibrary, setIsBookInLibrary] = useState<boolean>(false);
    
    function handleLongPress() {
        console.log("handleLongPress: " + isLongPressed);
    }

    useEffect(() => {
        checkIfBookIsInLibrary();
    }, []);

    function checkIfBookIsInLibrary() {
        GlobalBookData.CURRENT_READINGS.forEach(book => {
            if(bookID == book.id) {
                setIsBookInLibrary(true);
            }
        });
    }

    function handleNavigation() {
        if(!isBookInLibrary || (userCurrentChapterInBook == 0)) {
            navigation.navigate("Prologue", 
                { 
                    "id" : bookID, 
                    "chapterNumber" : 1, 
                    "bookCoverImage" : bookCover, 
                    "name": bookTitle, 
                    "authorUsername": bookAuthor
                })
        }
        else {
            navigation.navigate("Reading Screen", 
                { 
                    "id" : bookID, 
                    "chapterNumber" : userCurrentChapterInBook, 
                    "bookCoverImage" : bookCover, 
                    "name": bookTitle, 
                    "authorUsername": bookAuthor
                })
        }
    }

    if(bookAuthor && bookTitle) {
        var constructURIForBookCover = Globals.BOOK_COVER_URI_TEMPLATE.replace('NAME', bookTitle.toLowerCase());
        constructURIForBookCover = constructURIForBookCover.replace('AUTHOR', bookAuthor.toLowerCase());
        bookCover = constructURIForBookCover;

        return (
            <View style={styles.book_container_view}>
                <TouchableOpacity 
                    style={[
                        styles.book_container_button, 
                        { width: props.bookCoverWidth, height: props.bookCoverHeight }
                    ]}
                    onLongPress={() => setIsLongPressed(true)}
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
                                <Text style={styles.book_overlay_text_percentage}> 30% </Text>
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