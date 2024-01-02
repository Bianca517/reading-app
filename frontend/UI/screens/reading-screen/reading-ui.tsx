import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions, Button } from 'react-native';
import Globals from '../../_globals/Globals';
import { get_book_chapter_content } from '../../../services/book-reading-service';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import BottomSheetContent from '../../components/bottom-sheet-content';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const bodyHeight = windowHeight * 60 / 100;

export default function ReadingScreen( {route} ) {
    const [bookChapterContent, setBookChapterContent] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const bookID = route.params.bookID;
    const scrollViewRef = useRef<ScrollView>(null);
    const sheetRef = useRef<BottomSheet>(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const snapPoints = ["45%"];
    const navigation = useNavigation();
    navigation.setOptions({
        headerRight: () => (
                <Button
                  onPress={() => handleSnapPress(0)}
                  title="Settings"
                  color="gray"
                />
        ),
    })

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

    const handleSnapPress = useCallback((index: number) => {
        sheetRef.current?.snapToIndex(index);
        setIsBottomSheetOpen(true);
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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

                <BottomSheet
                    ref={sheetRef}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    onClose={() => setIsBottomSheetOpen(false)}
                    style={{marginHorizontal: 10}}
                >
                    <BottomSheetView>
                        <BottomSheetContent/>
                    </BottomSheetView>
                </BottomSheet>
            </SafeAreaView>
        </GestureHandlerRootView>
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

