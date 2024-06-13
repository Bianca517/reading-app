import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Globals from '../_globals/Globals';
import  Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import { bookDTO } from '../../types';
import { constructURIForBookCover } from './construct-uri-for-bookcover';

type BookProps = {
    bookFields: bookDTO,
    bookCoverWidth: number,
    bookCoverHeight: number,
    bookAddedCallback: (bookId: string, bookTitle: string, bookAuthor: string, numberOfChapters: number) => void,
}

type ContextInterface = {
    translateX: number,
    translateY: number,
}

export default function BookDraggable({ bookFields, bookCoverWidth, bookCoverHeight, bookAddedCallback }: BookProps) {
    console.log("am primit in draggable", bookFields);

    const bookTitle = bookFields.bookTitle;
    const bookAuthor = bookFields.authorUsername;
    const bookID = bookFields.bookID;
    const numberOfChapters = bookFields.numberOfChapters;

    const bookCover = constructURIForBookCover(bookTitle, bookAuthor);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    let isPressed = useSharedValue(false);
    let isLongPressed = useSharedValue(false);

    const panGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, ContextInterface>({
        onStart: (event, context) => {
                context.translateX = translateX.value;
                context.translateY = translateY.value;
        },
        onActive: (event, context) => {
            if(isLongPressed.value == true) {
                translateX.value = event.translationX + context.translateX;
                translateY.value = event.translationY + context.translateY;

                //console.log("x:", translateX.value);
                //console.log("y:", translateY.value);
            }
        },
        onEnd: () => {
            const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2); //pythagoras
            if(translateY.value > Globals.Y_INDEX_OF_BEGINNING_MONTH_CONTAINER) {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
            else {
                runOnJS(bookAddedCallback)(bookID, bookTitle, bookAuthor, numberOfChapters); //run on JS needed because otherwise the app would crash  
                //By using runOnJS, you ensure that the function is executed on the JavaScript thread rather than the UI thread
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }

            isPressed.value = false;
        },
    })

    const reanimatedStyle = useAnimatedStyle(() => {
        const opacity = isLongPressed.value ? withSpring(0.3) : withSpring(1);

        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
            opacity,
        }
    })

    const handleLongPress = () => {
        isPressed.value = true;
        setTimeout(() => {
          if (true == isPressed.value) {
            isLongPressed.value = true;
        }          
        }, 500);
      };

    return (
        <PanGestureHandler 
            onGestureEvent={panGestureEvent}
            onHandlerStateChange={(event) => {
                if (event.nativeEvent.state === State.BEGAN) {
                    isPressed.value = true;
                    handleLongPress(); 
                } 
                else if (event.nativeEvent.state === State.END) {
                    isPressed.value = false;
                    isLongPressed.value = false;
                }
              }}
            >
                <Animated.View 
                    style={[
                        styles.book_container, 
                        reanimatedStyle,
                        { width: bookCoverWidth, height: bookCoverHeight}
                    ]}
                >
                    
                    <Image style={[styles.book_cover, {opacity: isLongPressed.value ? 0.8 : 1, zIndex: isLongPressed.value ? 1: 99}]} source={{ uri: bookCover }}></Image>
                
                </Animated.View>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    book_container: {
        alignSelf: 'flex-start',
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
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