import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Globals from '../_globals/Globals';
import  Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';

type BookProps = {
    bookFields: string,
    bookCoverWidth: number,
    bookCoverHeight: number,
}

type ContextInterface = {
    translateX: number,
    translateY: number,
}

export default function BookDraggable(props: BookProps) {
    let bookFieldsJSON = JSON.parse(props.bookFields);
    const bookTitle = bookFieldsJSON[Globals.BOOK_COLLECTION_FIELDS[0]];
    const bookAuthor = bookFieldsJSON[Globals.BOOK_COLLECTION_FIELDS[1]];

    var constructURIForBookCover = Globals.BOOK_COVER_URI_TEMPLATE.replace('NAME', bookTitle.toLowerCase());
    constructURIForBookCover = constructURIForBookCover.replace('AUTHOR', bookAuthor.toLowerCase());
    const bookCover = constructURIForBookCover;

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
                
                console.log("x: " + translateX.value);
                console.log("y: " + translateY.value);
            }
        },
        onEnd: () => {
            const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2); //pythagoras
            if(distance < 200 || distance === 0) {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
            isPressed.value = false;
            isLongPressed.value = false;
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
            console.log("can start dragging");
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
                        { width: props.bookCoverWidth, height: props.bookCoverHeight }
                    ]}
                >
                    
                        <Image style={[styles.book_cover, {opacity: isLongPressed.value ? 0.8 : 1}]} source={{ uri: bookCover }}></Image>
                        <Text style={styles.book_title}>{bookTitle}</Text>
                        <Text style={styles.book_author}>{bookAuthor}</Text>
                
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