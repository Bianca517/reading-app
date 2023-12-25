import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import Globals from '../_globals/Globals';

type BookProps = {
    bookFields: string,
    bookCoverWidth: number,
    bookCoverHeight: number,
    onPressAddButton: (book: string) => void,
}

export default function EditableBook(props: BookProps) {

    let bookFieldsJSON = JSON.parse(props.bookFields);
    const bookTitle = bookFieldsJSON[Globals.BOOK_COLLECTION_FIELDS[0]];
    const bookAuthor = bookFieldsJSON[Globals.BOOK_COLLECTION_FIELDS[1]];

    var constructURIForBookCover = Globals.BOOK_COVER_URI_TEMPLATE.replace('NAME', bookTitle.toLowerCase());
    constructURIForBookCover = constructURIForBookCover.replace('AUTHOR', bookAuthor.toLowerCase());
    const bookCover = constructURIForBookCover;

    return (
        <View 
            style={[
                styles.book_container, 
                { width: props.bookCoverWidth, height: props.bookCoverHeight }
            ]}
        >
            <View style={[styles.imageOverlay, { width: props.bookCoverWidth, height: props.bookCoverHeight }]}>    
                <Image style={styles.book_cover} source={{ uri: bookCover }}></Image>
                <TouchableOpacity style={styles.addButton} onPress={props.onPressAddButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    book_container: {
        alignSelf: 'flex-start',
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginHorizontal: 10,
    },
    book_cover: {
        flex: 1,
        borderRadius: 3,
        width: '100%'
    },
    imageOverlay: {
        flex: 6.8,
        position: 'relative',
    },
    addButton: {
        backgroundColor: 'white',
        width: 20,
        height: 20,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -5, // Adjust as needed
        right: -9, // Adjust as needed
    },
    addButtonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: Globals.COLORS.PURPLE,
    }
})