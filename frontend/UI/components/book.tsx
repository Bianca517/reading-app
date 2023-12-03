import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Globals from '../_globals/Globals';

type BookProps = {
    bookFields: string,
    bookCoverWidth: number,
    bookCoverHeight: number,
}

export default function Book(props: BookProps) {

    let bookFieldsJSON = JSON.parse(props.bookFields);
    const bookTitle = bookFieldsJSON[Globals.BOOK_COLLECTION_FIELDS[0]];
    const bookAuthor = bookFieldsJSON[Globals.BOOK_COLLECTION_FIELDS[1]];

    var constructURIForBookCover = Globals.BOOK_COVER_URI_TEMPLATE.replace('NAME', bookTitle.toLowerCase());
    constructURIForBookCover = constructURIForBookCover.replace('AUTHOR', bookAuthor.toLowerCase());
    const bookCover = constructURIForBookCover;

    return (
        <View style={[styles.book_container, { width: props.bookCoverWidth, height: props.bookCoverHeight }]}>
            <Image style={styles.book_cover}
                source={{ uri: bookCover }}></Image>
            <Text style={styles.book_title}>{bookTitle}</Text>
            <Text style={styles.book_author}>{bookAuthor}</Text>
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
    }
})