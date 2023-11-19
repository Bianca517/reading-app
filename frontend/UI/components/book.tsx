import React, {useState , useEffect} from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

export default function Book(bookFields: String) {
    const BOOK_COLLECTION_FIELDS = [ "name", "authorUsername", "chapters", "cover",
                        "readers",
                        "genre" ];
    const BOOK_COVER_URI_TEMPLATE = 'https://firebasestorage.googleapis.com/v0/b/reading-app-d23dc.appspot.com/o/book_covers%2FNAME_AUTHOR.png?alt=media';               
    
    bookFields = JSON.parse(bookFields.bookFields);
    const bookTitle = bookFields[BOOK_COLLECTION_FIELDS[0]];
    const bookAuthor = bookFields[BOOK_COLLECTION_FIELDS[1]];
    
    var constructURIForBookCover = BOOK_COVER_URI_TEMPLATE.replace('NAME', bookTitle.toLowerCase());
    constructURIForBookCover = constructURIForBookCover.replace('AUTHOR', bookAuthor.toLowerCase());
    const bookCover = constructURIForBookCover;
 
    return (
        <View style={styles.book_container}>
            <Image style={styles.book_cover} source={{ uri: bookCover }}></Image>
            <Text style={styles.book_title}>{bookTitle}</Text>
            <Text style={styles.book_author}>{bookAuthor}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    book_container: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginHorizontal: 10,
    },
    book_cover: {
        flex: 6.8,
        width: 110,
        height: '100%',
        borderRadius: 3,
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
    }
})