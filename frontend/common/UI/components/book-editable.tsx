import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import Globals from '../_globals/Globals';
import { delete_planned_book_for_month } from '../../services/reading-planner-service'
import { bookDTO } from '../../types';
import { constructURIForBookCover } from './construct-uri-for-bookcover';
import GlobalUserData from '../_globals/GlobalUserData';
import GlobalBookData from '../_globals/GlobalBookData';

import * as Sentry from "@sentry/react-native";

type BookProps = {
    bookFields: bookDTO,
    bookCoverWidth: number,
    bookCoverHeight: number,
    currentMonthName: string,
    onBookRemovedCallback: (bookID: string, bookTitle: string, bookAuthor: string, numberOfChapters: number) => void,
}

export default function EditableBook({ bookFields, bookCoverWidth, bookCoverHeight, currentMonthName, onBookRemovedCallback }: BookProps) {

    const bookTitle = bookFields.bookTitle;
    const bookAuthor = bookFields.authorUsername;
    const bookID = bookFields.bookID;
    const numberOfChapters = bookFields.numberOfChapters;
    let bookCover = "";

    if(bookTitle && bookAuthor) {
        bookCover = constructURIForBookCover(bookTitle, bookAuthor);
    }

    async function bookRemovedCallback(bookID: string) {
        const result = await Sentry.startSpan(
            { name: "Remove book from planning" },
            async () => {
                return (
                    //remove from DB and from local storage
                    delete_planned_book_for_month(GlobalUserData.LOGGED_IN_USER_DATA.uid, currentMonthName, bookID)
                    .then((success: boolean) => {
                        console.log("teoretic removed");
                        GlobalBookData.MONTH_PLANNED_BOOKS[currentMonthName].filter((book : bookDTO) => book.bookID != bookID);
                        onBookRemovedCallback(bookID, bookTitle, bookAuthor, numberOfChapters);
                    })
                )});
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
        top: -5, 
        right: -9, 
        borderWidth: 2,
        borderColor: Globals.COLORS.PURPLE
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    }
})