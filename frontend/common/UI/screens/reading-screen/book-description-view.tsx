import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions, TouchableHighlight, Alert } from 'react-native';
import Globals from '../../_globals/Globals';
import { AntDesign } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { get_book_description, add_book_to_library } from '../../../services/book-reading-service';
import GlobalBookData from '../../_globals/GlobalBookData';
import GlobalUserData from '../../_globals/GlobalUserData';

const screenWidth = Dimensions.get("window").width;

type ResponseType = {
    success: boolean,
    message: string,
}

interface book {
    name: string,
    id: string,
    authorUsername: string,
}

export default function BookDescriptionView({route}) {
    const bookTitle: string = route.params.name;
    const bookID: string = route.params.id;
    const bookAuthor: string = route.params.authorUsername;
    const bookCoverImageUrl: string = route.params.bookCoverImage;
    const [bookDescription, setBookDescription] = useState<string>("");
    const navigation = useNavigation();

    async function loadBookDescription() {
        const fetchResponse: ResponseType = await get_book_description(bookID).then();

        if (fetchResponse.success) {
            const receivedBookDescription: string = JSON.parse(fetchResponse.message);
            setBookDescription(receivedBookDescription);
        }
    }

    async function addBookToLibrary() {
        const bookToBeAdded: book = {
            name: bookTitle,
            authorUsername: bookAuthor,
            id: bookID,
        }
        GlobalBookData.CURRENT_READINGS.push(bookToBeAdded);

        const fetchResponse: ResponseType = await add_book_to_library(bookID, GlobalUserData.LOGGED_IN_USER_DATA.uid).then();

        if(fetchResponse.success) {
            Alert.alert("Successfully added book to library!");
        }
    }

    function handleAddToLibraryButtonPress() {
        addBookToLibrary();
        navigation.navigate("Library");
    }

    useEffect(() => {
        loadBookDescription();
    }, []);

    return(
            <View style={styles.body}>
                <View style={styles.bookCoverContainer}>
                    <Image style={styles.bookCover} source={{uri: bookCoverImageUrl}}></Image>
                </View>

                <View style={styles.bookTitleContainer}>
                    <Text style={styles.bookTitleText}>{bookTitle}</Text>
                    <Text style={styles.bookAuthorText}>a book written by {bookAuthor}</Text>
                </View>

                <View style={styles.bookDescriptionContainer}>
                    <ScrollView style={styles.bookDescriptionScrollview}>
                        <Text style={styles.bookDescriptionText}>{bookDescription}</Text>
                       
                    </ScrollView>
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.addBookButton} activeOpacity={0.8} onPress={() => handleAddToLibraryButtonPress()}>
                        <Text style={styles.addBookText}> Add to Library </Text>    
                    </TouchableOpacity>    

                    <TouchableOpacity style={styles.startReadingButton}  activeOpacity={0.5} onPress={() => navigation.navigate(
                            "Reading Screen",
                            { 
                                "id" : bookID, 
                                "chapterNumber" : 0, 
                                "bookCoverImage" : "", 
                                "bookTitle": "", 
                                "bookAuthor": ""
                            }
                        )}>
                        <AntDesign name="arrowright" size={24} color={Globals.COLORS.PURPLE} />
                        <Text style={styles.startReadingText}> Start Reading </Text>    
                    </TouchableOpacity>    
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Globals.COLORS.BACKGROUND_GRAY,
        flex: 13,
        widht: screenWidth,
        flexDirection: 'column',
        paddingBottom: 5,
        paddingHorizontal: 5,
    },
    text_container: {
        height: 550,
        width: screenWidth,
    },
    bookCoverContainer: {
        flex: 4,
        backgroundColor: 'pink'
    },
    bookTitleContainer: {
        flex: 1,
        //backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bookDescriptionContainer: {
        flex: 5,
        //backgroundColor: 'purple',
        borderRadius: 10,
        borderColor: Globals.COLORS.PURPLE,
        borderWidth: 2,
    },
    buttonsContainer: {
        flex: 1,
        //backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 50,
    },
    bookDescriptionScrollview: {
        paddingHorizontal: 20,
        paddingBottom: 5,
        paddingTop: 10,
    },
    bookCover: {
        width: '100%',
        height: '100%',
    },
    bookTitleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    bookAuthorText: {
        fontSize: 17,
        fontStyle: 'italic',
        color: 'white',
    },
    bookDescriptionText: {
        fontSize: 15,
        textAlign: 'justify',
        lineHeight: 20,
        color: 'white',
        marginBottom: 15,
    },
    addBookButton: {
        backgroundColor: '#cc00ff',
        width: 180,
        height: 40,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addBookText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    startReadingButton: {
        width: 200,
        height: 40,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startReadingText: {
        fontSize: 16,
        color: Globals.COLORS.PURPLE,
    }

});
