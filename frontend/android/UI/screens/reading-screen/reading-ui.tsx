import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions, Button, FlatList } from 'react-native';
import Globals from '../../_globals/Globals';
import { get_book_chapter_content, get_book_chapter_title } from '../../../services/book-reading-service';
import BottomSheet, { BottomSheetView, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import BottomSheetContent from '../../components/bottom-sheet-content';
import { AntDesign } from '@expo/vector-icons'; 
import TextDistributer from '../../components/page-distribution-calculator';
import FaceDetectionModule from '../../components/face-detector';
import Book from '../../components/book';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const bodyHeight = windowHeight * 60 / 100;

type ResponseType = {
    success: boolean;
    message: any;
};

type textParagraph = {
    id: string;
    content: string;
}

let textToDisplay: textParagraph[] = 
[ {'id': '0', 'content': "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"},
   {'id': '1', 'content': "Lorem Ipsum is simply dummy text of the p Lorem Ipsum"},
   {'id': '2', 'content': "Lorem Ipsum is simply dummy text of  Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"},
   {'id': '3', 'content': "Lorem Ipsum is simply dummy text of  Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"},
   {'id': '4', 'content': "Lorem Ipsum is simply dummy text of  Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"},
   {'id': '5', 'content': "Lorem Ipsum is simply dummy text of  Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"},
]

export default function ReadingScreen( {route} ) {
    //route params
    const bookID = route.params.bookID;
    const bookTitle = route.params.bookTitle;
    const bookAuthor = route.params.bookAuthor;
    const bookCoverImageUrl = route.params.bookCoverImage;
    const bookChapterNumber = route.params.chapterNumber;

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
    const [totalPageNumbers, setTotalPageNumbers] = useState<number>(0);
    const flatlistRef = useRef<FlatList<string>>(null);
    const sheetRef = useRef<BottomSheet>(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [paragraphsInPages, setParagraphsInPages] = useState<textParagraph[][]>([]);
    const [textInPages, setTextInPages] = useState<string[]>([]);
    const [userCurrentChapterInBook, setUserCurrentChapterInBook] = useState<number>(0);

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

    //this executes at the beginning
    useEffect(() => {
        console.log("in reading screen");
        if(!bookChapterNumber) {
            //load where user remained with reading in this book
        }
        else {
            setUserCurrentChapterInBook(bookChapterNumber);
        }
    }, []);

    useEffect(() => {
        loadBookChapterContent();
        loadBookChapterTitle();
    }, [bookID, userCurrentChapterInBook]);

    useEffect(() => {
        const distributedParagraphs: textParagraph[][] = TextDistributer(textToDisplay, bodyHeight, windowWidth, fontSize);
        setParagraphsInPages(distributedParagraphs);
    }, [fontSize]);

    useEffect(() => {
        //console.log("paragraphs in page", paragraphsInPages);
        updateTextInPages(paragraphsInPages);
        setTotalPageNumbers(paragraphsInPages.length);
    }, [paragraphsInPages]);

    useEffect(() => {
        //console.log("text in page", textInPages);
    }, [textInPages]);

    useEffect(() => {
        //console.log("current page", currentPage);
    }, [currentPage])

    useEffect(() => {
        //console.log("gesture scroll active ", isGestureScrollingActive);
    }, [isGestureScrollingActive]);
    
    function updateTextInPages(paragraphsInPages: textParagraph[][]) {
        let pagesText: string[] = [];
        let currentPageNumber: number = 0;
        paragraphsInPages.forEach((arrayOfParagraphInPage: textParagraph[]) => {
            arrayOfParagraphInPage.forEach((paragraph: textParagraph) => {
                if(!pagesText[currentPageNumber]) {
                    pagesText[currentPageNumber] = "";
                }
                pagesText[currentPageNumber] += paragraph.content;
            });
            currentPageNumber++;
        });
        setTextInPages(pagesText);
    }

    async function loadBookChapterTitle() : Promise<void> {
        const fetchResponse: ResponseType = await get_book_chapter_title(bookID, userCurrentChapterInBook).then();

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
        //console.log("fontsize: " + fontSize);
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

    const handleSnapPress = useCallback((index: number) => {
        sheetRef.current?.snapToIndex(index);
        setIsBottomSheetOpen(true);
    }, []);

    function flatListScrollToNext() {
        if(currentPage < totalPageNumbers - 1) {
            flatlistRef.current?.scrollToIndex({
                index: currentPage + 1,
            });
            setCurrentPage(currentPage+1);
        }
    }

    function flatListScrollToPrevious() {
        if(currentPage > 0) {
            flatlistRef.current?.scrollToIndex({
                index: currentPage - 1,
            });
            setCurrentPage(currentPage-1);
        }
    }

    const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
        const currentPage: number = viewableItems[0]["index"];
        setCurrentPage(currentPage);
    }, []);
    
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {
                isGestureScrollingActive && (
                    <FaceDetectionModule userAlreadyGavePermission={true} scrollRightCallback={flatListScrollToNext} scrollLeftCallback={flatListScrollToPrevious}></FaceDetectionModule>
                )
            }
            <SafeAreaView style={styles.fullscreen_view}>
                <View style={styles.table_of_contents_preview}>
                    <Text style={styles.table_of_contents_text}>Table of Contents</Text>
                  
                    <TouchableOpacity style={styles.right_side_of_table_of_contents_preview} onPress={() => navigation.navigate("Table of Contents", {'bookID' : bookID})}>
                        <Text style={styles.table_of_contents_text}> {userCurrentChapterInBook} </Text>
                        <AntDesign name="down" size={20} color="white" />
                    </TouchableOpacity>
                   
                </View>

                <View style={styles.body}>
                    <View style={[styles.header, {backgroundColor: selectedBackgroundColor}]}>                    
                        <Text style={[styles.chapter_number, {fontFamily: selectedFont, color: fontColor}]}>Chapter {userCurrentChapterInBook}</Text>
                        <Text style={[styles.chapter_title, {fontFamily: selectedFont, color: fontColor}]}>{ bookChapterTitle }</Text>
                    </View>

                    <View style={[styles.white_line, {backgroundColor: fontColor}]}/>

                    <View style = {styles.text_container}>

                        <FlatList
                            ref={flatlistRef}
                            data={textInPages}
                            horizontal={true}  
                            showsHorizontalScrollIndicator={false} 
                            keyExtractor={(item, index) => index.toString()}
                            disableIntervalMomentum
                            pagingEnabled={true}
                            decelerationRate={'fast'}
                            onViewableItemsChanged={onViewableItemsChanged}
                            renderItem={({ item }) => (
                                <View style={[styles.content_view, { backgroundColor: selectedBackgroundColor }]}>
                                    <Text style={[styles.content_text, { fontFamily: selectedFont, fontSize: fontSize, color: fontColor }]}>
                                        {item}
                                    </Text>
                                </View>
                            )}
                        />

                    </View>
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
        //paddingTop: 10,
        //paddingBottom: 100,
        width: windowWidth,
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
        marginBottom: 20,
        //paddingBottom: 50,
        width: windowWidth,
    },
    body: {
        flex: 13,
        widht: windowWidth,
    },
    text_container: {
        height: 550,
        width: windowWidth,
    },
});

