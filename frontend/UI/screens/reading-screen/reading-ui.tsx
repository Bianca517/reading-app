import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions, Button } from 'react-native';
import Globals from '../../_globals/Globals';
import { get_book_chapter_content, get_book_chapter_title } from '../../../services/book-reading-service';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import BottomSheetContent from '../../components/bottom-sheet-content';
import { AntDesign } from '@expo/vector-icons'; 

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const bodyHeight = windowHeight * 60 / 100;

type ResponseType = {
    success: boolean;
    message: any;
};
export default function ReadingScreen( {route} ) {
    //route params
    const bookID = route.params.bookID;
    const chapterNumber = route.params.chapterNumber;
    const chapterNumberToDisplay = chapterNumber + 1;

    //customization parameters
    const [selectedBackgroundColor, setSelectedBackgroundColor] = useState<string>(Globals.COLORS.BACKGROUND_GRAY);
    const [selectedFont, setSelectedFont] = useState<string>(Globals.DEFAULT_FONT_FAMILY);
    const [isGestureScrollingActive, setIsGestureScrollingActive] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<number>(Globals.DEFAULT_FONT_SIZE);
    const [fontColor, setFontColor] = useState<string>(Globals.FONT_COLOR_1);

    //local variables
    const [bookChapterContent, setBookChapterContent] = useState<string>("");
    const [bookChapterTitle, setBookChapterTitle] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
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
        loadBookChapterTitle();
    }, [bookID, chapterNumber]);

    
    async function loadBookChapterTitle() : Promise<void> {
        const fetchResponse: ResponseType = await get_book_chapter_title(bookID, chapterNumber).then();

        if (fetchResponse.success) {
            const receivedChapterTitle: string = JSON.parse(fetchResponse.message);
            setBookChapterTitle(receivedChapterTitle);
        }
    }

    async function loadBookChapterContent() : Promise<void> {
        const fetchResponse = await get_book_chapter_content(bookID, 0).then();

        if (fetchResponse.success) {
            const receivedChapterContent: string = JSON.parse(fetchResponse.responseData);
            setBookChapterContent(receivedChapterContent);
        }
    }

    function updateFontFamily (fontFamily: string): void{
        setSelectedFont(fontFamily)
    }

    function updateFontSize (increaseFont: boolean): void{
        if (increaseFont && (Globals.MAX_FONT_SIZE > fontSize)) {
            setFontSize(fontSize + 1);
        } else if(Globals.MIN_FONT_SIZE < fontSize){
            setFontSize(fontSize - 1);
        }
        console.log("fontsize: " + fontSize);
    }

    function updateBackgroundColor (backgroundColor: string): void{
        setSelectedBackgroundColor(backgroundColor);

        switch (backgroundColor) {
            case Globals.COLORS.BACKGROUND_GRAY:
                setFontColor(Globals.FONT_COLOR_1);
                break;
            case Globals.COLORS.BACKGROUND_WHITE:
                setFontColor(Globals.FONT_COLOR_0);
                break;
            case Globals.COLORS.BACKGROUND_YELLOW:
                setFontColor(Globals.FONT_COLOR_2);
                break;
        }
    }

    function updateGestureScroll (isEnabled: boolean): void{
        setIsGestureScrollingActive(isEnabled);
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
                <View style={styles.table_of_contents_preview}>
                    <Text style={styles.table_of_contents_text}>Table of Contents</Text>
                  
                    <TouchableOpacity style={styles.right_side_of_table_of_contents_preview} onPress={() => navigation.navigate("Table of Contents", {'bookID' : bookID})}>
                        <Text style={styles.table_of_contents_text}> {chapterNumberToDisplay} </Text>
                        <AntDesign name="down" size={20} color="white" />
                    </TouchableOpacity>
                   
                </View>

                <View style={styles.body}>                
                    <ScrollView 
                            style={[styles.scrollview, {backgroundColor: selectedBackgroundColor}]}
                            pagingEnabled
                            ref={scrollViewRef}>
                        <View style={[styles.header, {backgroundColor: selectedBackgroundColor}]}>                    
                            <Text style={[styles.chapter_number, {fontFamily: selectedFont, color: fontColor}]}>Chapter {chapterNumberToDisplay}</Text>
                            <Text style={[styles.chapter_title, {fontFamily: selectedFont, color: fontColor}]}>{ bookChapterTitle }</Text>
                        </View>

                        <View style={[styles.white_line, {backgroundColor: fontColor}]}/>

                        <View style={[styles.content_view, {backgroundColor: selectedBackgroundColor}]}>
                                <Text style={[styles.content_text, {fontFamily: selectedFont, fontSize: fontSize, color: fontColor}]}> {bookChapterContent} </Text>
                        </View>
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
                        <BottomSheetContent updateFontFamily = {updateFontFamily} updateFontSize = {updateFontSize} updateBackgroundColor = {updateBackgroundColor} updateGestureScroll = {updateGestureScroll}/>
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
    table_of_contents_preview: {
        flex: 1,
        backgroundColor: 'black',
        flexDirection: 'row',
        paddingHorizontal: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    right_side_of_table_of_contents_preview: {
        flexDirection: 'row'
    },
    table_of_contents_text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'justify',
        lineHeight: 20,
    },
    header: {
        //backgroundColor: 'purple',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    white_line: {
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
        paddingTop: 10,
        paddingBottom: 100,
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
        textAlign: 'justify',
        lineHeight: 20,
    },
    scrollview: {
        paddingTop: 20,
        marginBottom: 20,
        paddingBottom: 50
    },
    body: {
        flex: 13,
    }
});

