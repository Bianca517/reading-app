import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import Globals from '../_globals/Globals';
import { delete_planned_book_for_month } from '../../services/reading-planner-service'

type BookProps = {
    bookFields: string,
    bookCoverWidth: number,
    bookCoverHeight: number,
    currentMonthName: string,
    onBookRemovedCallback: (bookID: string, bookTitle: string, bookAuthor: string) => void,
}

export default function EditableBook({ bookFields, bookCoverWidth, bookCoverHeight, currentMonthName, onBookRemovedCallback }: BookProps) {

    let bookFieldsJSON = JSON.parse(bookFields);
    const bookTitle = bookFieldsJSON[Globals.BOOK_COLLECTION_FIELDS[0]];
    const bookAuthor = bookFieldsJSON[Globals.BOOK_COLLECTION_FIELDS[1]];
    const bookID = bookFieldsJSON[Globals.BOOK_COLLECTION_FIELDS[6]];
    let bookCover = "";

    if(bookTitle && bookAuthor) {
        var constructURIForBookCover = Globals.BOOK_COVER_URI_TEMPLATE.replace('NAME', bookTitle.toLowerCase());
        constructURIForBookCover = constructURIForBookCover.replace('AUTHOR', bookAuthor.toLowerCase());
        bookCover = constructURIForBookCover;
    }

    async function bookRemovedCallback(bookID: string) {
        await delete_planned_book_for_month(currentMonthName, bookID);
        console.log("teoretic removed");
        onBookRemovedCallback(bookID, bookTitle, bookAuthor);
    }

    if(bookTitle && bookAuthor) {
        return (
            <View 
                style={[
                    styles.book_container, 
                    { width: bookCoverWidth, height: bookCoverHeight }
                ]}
            >
                <View style={[styles.imageOverlay, { width: bookCoverWidth, height: bookCoverHeight }]}>    
                    <Image style={styles.book_cover} source={{ uri: bookCover }}></Image>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => bookRemovedCallback(bookID)}>
                        <Text style={styles.addButtonText}>-</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
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
    deleteButton: {
        backgroundColor: 'white',
        width: 20,
        height: 20,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -5, // Adjust as needed
        right: -9, // Adjust as needed
        borderWidth: 2,
        borderColor: Globals.COLORS.PURPLE
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    }
})