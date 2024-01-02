import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions, PanResponder } from 'react-native';
import Globals from '../../_globals/Globals';
import { get_book_chapter_content } from '../../../services/book-reading-service';

const windowHeight = Dimensions.get('window').height;
const bodyHeight = windowHeight * 60 / 100;

export default function ReadingScreen( {route} ) {
    const [bookChapterContent, setBookChapterContent] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const bookID = route.params.bookID;
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        loadBookChapterContent();
    }, []);

    async function loadBookChapterContent() : Promise<void> {
        const fetchResponse = await get_book_chapter_content(bookID, 0).then();

        if (fetchResponse.success) {
            const receivedChapterContent: string = JSON.parse(fetchResponse.responseData);
            setBookChapterContent(receivedChapterContent);
        }
    }

    function handlePageScroll() : void {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: currentPage * bodyHeight, animated: true });
        }
    };


    return (
        <SafeAreaView style={styles.fullscreen_view}>
            <View style={styles.header}>
                <Text style={styles.chapter_number}>Chapter 10</Text>
                <Text style={styles.chapter_title}>What a beautiful day</Text>
            </View>

            <View style={styles.white_line}/>

            <View style={styles.content_view}>
                <ScrollView 
                    style={styles.scrollview}
                    pagingEnabled
                    ref={scrollViewRef}>
                    <Text style={styles.content_text}> {bookChapterContent} </Text>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    fullscreen_view: {
        backgroundColor: Globals.COLORS.BACKGROUND_GRAY,
        flex: 1,
        flexDirection: 'column',
    },
    header: {
        //backgroundColor: 'purple',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    white_line: {
        backgroundColor: 'white',
        width: '80%',
        height: 2,
        alignSelf: 'center',
        marginVertical: 10,
    },
    content_view: {
        //backgroundColor: 'pink',
        flex: 6,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 25,
    },
    chapter_number: {
        color: 'white',
        fontWeight: 'normal',
        fontSize: 25,
        marginBottom: 20,
    },
    chapter_title: {
        color: 'white',
        fontWeight: '400',
        fontSize: 20,
    },
    content_text: {
        color: 'white',
        fontWeight: 'normal',
        fontSize: 15,
        textAlign: 'justify',
        lineHeight: 20,
    },
    scrollview: {
       
    }
});

