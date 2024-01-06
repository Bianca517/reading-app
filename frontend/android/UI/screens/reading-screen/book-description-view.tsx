import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions, TouchableHighlight } from 'react-native';
import Globals from '../../_globals/Globals';
import { AntDesign } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get("window").width;

type props = {
    bookCoverImageUrl: string,
    bookTitle: string,
    bookID: string,
    bookAuthor: string,
}
export default function BookDescriptionView({route}) {
    const bookDescription = `   In the enchanting realm of Eldoria, where magic dances in the moonlight, "Whispers of the Silver Rose" unfolds a spellbinding romance that transcends worlds. As ancient prophecies awaken, young sorceress Elysia discovers an unexpected connection with the mysterious guardian of the Silver Rose, a fabled flower with the power to bridge the realms of reality and fantasy.

    Elysia's heart is torn between duty and desire as she navigates a forbidden love with the enigmatic guardian, whose fate is intricately tied to the balance of Eldoria. Amidst looming shadows and treacherous alliances, they embark on a perilous quest to unlock the secrets of the Silver Rose and defy the destiny that threatens to tear them apart.
    
    Brimming with magical creatures, ethereal landscapes, and a love that defies the boundaries of time, "Whispers of the Silver Rose" is a captivating tale that explores the essence of true love and the enduring power of hope. Will Elysia and her guardian conquer the forces that seek to keep them apart, or will Eldoria succumb to darkness? `
    const bookTitle: string = route.params.bookTitle;
    const bookID: string = route.params.bookID;
    const bookAuthor: string = route.params.bookAuthor;
    const bookCoverImageUrl: string = route.params.bookCoverImage;

    const navigation = useNavigation();

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
                    <TouchableOpacity style={styles.addBookButton}  activeOpacity={0.8}>
                        <Text style={styles.addBookText}> Add to Library </Text>    
                    </TouchableOpacity>    

                    <TouchableOpacity style={styles.startReadingButton}  activeOpacity={0.5} onPress={() => navigation.navigate(
                            "Reading Screen",
                            { 
                                "bookID" : bookID, 
                                "chapterNumber" : 1, 
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
