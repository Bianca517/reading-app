import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions, Button } from 'react-native';
import { get_book_chapter_title, get_number_of_chapters_of_book } from '../../../services/book-reading-service';
import Globals from '../../_globals/Globals';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const bodyHeight = windowHeight * 60 / 100;

type ResponseType = {
    success: boolean;
    message: any;
};

export default function TableOfContentsScreen({ route }) {
    const bookID: string = route.params.bookID;
    const [numberOfChapters, setNumberOfChapters] = useState<number>(0);
    const [chapterTitles, setChapterTitles] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            await loadNumberOfChapters();
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (numberOfChapters > 0) {
            loadChapterTitles();
        }
    }, [numberOfChapters]);

    async function loadNumberOfChapters() {
        let fetchResponse = await get_number_of_chapters_of_book(bookID);

        if (fetchResponse.success) {
            const receivedNumberOfChapters: number = JSON.parse(fetchResponse.responseData);
            setNumberOfChapters(receivedNumberOfChapters);
            console.log("numberOfChapters: " + receivedNumberOfChapters);
        }
    }

    async function loadChapterTitles() {
        let receivedChapterTitles: string[] = [];

        for (let i = 0; i < numberOfChapters; i++) {
            let fetchResponse = await get_book_chapter_title(bookID, i);

            if (fetchResponse.success) {
                const chapterTitle: string = JSON.parse(fetchResponse.message);
                receivedChapterTitles.push(chapterTitle);
                console.log("chapterTitle: " + chapterTitle);
            }
        }

        setChapterTitles(receivedChapterTitles);
        setLoading(false);
    }

    return (
        <SafeAreaView style={styles.fullscreen_view}>
            <ScrollView style={styles.fullscreen_view}>
                {loading ? (
                    <Text style={styles.titleText}>Loading...</Text>
                ) : (
                    chapterTitles.map((title, index) => (
                        <TouchableOpacity key={index} style={styles.chapterContainer}>
                            <Text style={styles.chapterText}>Chapter {index + 1}</Text>
                            <View style={styles.divider} />
                            <Text style={styles.titleText}>{title}</Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
        fullscreen_view: {
            backgroundColor: Globals.COLORS.BACKGROUND_GRAY,
            flex: 1,
            flexDirection: 'column',
            paddingHorizontal: 15,
        },
        chapterContainer: {
            flexDirection: 'row',
            paddingHorizontal: 25,
            paddingVertical: 15,
            //backgroundColor: 'purple',
            justifyContent: 'space-between',
            borderBottomColor: 'white',
            borderBottomWidth: 0.5,
        },
        chapterText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: 'white',
        },
        titleText: {
            fontSize: 16,
            fontWeight: '300',
            fontStyle: 'italic',
            color: 'white',
        },
        divider: {
            height: 1,
            backgroundColor: 'white',
            marginVertical: 5,
        },
});
