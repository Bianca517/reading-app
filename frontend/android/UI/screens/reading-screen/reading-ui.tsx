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
import { get_total_nr_of_chapters } from '../../../services/book-reading-service';
import { loadTotalNumberOfChapters } from '../../components/service-calls-wrapper';
import PageView from '../../components/page-view';

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
    const bookID = route.params.id;

    //customization parameters
    const [selectedBackgroundColor, setSelectedBackgroundColor] = useState<string>(Globals.COLORS.BACKGROUND_GRAY);
    const [selectedFont, setSelectedFont] = useState<string>(Globals.DEFAULT_FONT_FAMILY);
    const [isGestureScrollingActive, setIsGestureScrollingActive] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<number>(Globals.DEFAULT_FONT_SIZE);
    const [fontColor, setFontColor] = useState<string>(Globals.FONT_COLOR_1);

    //local variables
    const [bookChapterContent, setBookChapterContent] = useState<textParagraph[]>([]);
    const [bookChapterTitle, setBookChapterTitle] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPageNumbers, setTotalPageNumbers] = useState<number>(0);
    const [totalNumberOfChapters, setTotalNumberOfChapters] = useState<number>();
    const [paragraphsInPages, setParagraphsInPages] = useState<textParagraph[][]>([]);
    const [textInPages, setTextInPages] = useState<string[]>([]);
    const [chapterNumber, setChapterNumber] = useState<number>(0);
    const [chapterNumberToDisplay, setChapterNumberToDisplay] = useState<number>(chapterNumber + 1);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [navigateToNextChapterTrigger, setNavigateToNextChapterTrigger] = useState<boolean>(false);
    //const [navigateToPreviousChapterTrigger, setNavigateToPreviousChapterTrigger] = useState<boolean>(false);
    const navigateToPreviousChapterTriggerRef = useRef<boolean>(false);

    //refferences
    const flatlistRef = useRef<FlatList<string>>(null);
    const sheetRef = useRef<BottomSheet>(null);
    
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
        const routes = navigation.getState()?.routes;
        const prevRoute = routes[routes.length - 2]["name"]; // -2 because -1 is the current route
        //console.log(prevRoute);
        //if the previous screen is the prologue, it means the user is now beginning the book
        if(prevRoute == "Prologue") {
            setChapterNumber(0);
        }
        loadTotalNumberOfChapters(bookID).then(returnValue => setTotalNumberOfChapters(returnValue));
    }, []);

    useEffect(() => {
        loadBookChapterContent();
        loadBookChapterTitle();
    }, [bookID, chapterNumber]);

    useEffect(() => {
        const distributedParagraphs: textParagraph[][] = TextDistributer(bookChapterContent, bodyHeight, windowWidth, fontSize);
        setParagraphsInPages(distributedParagraphs);
    }, [fontSize, bookChapterContent]);

    useEffect(() => {
        updateTextInPages(paragraphsInPages);
        setTotalPageNumbers(paragraphsInPages.length);
        console.log("paragraphsInPages: ");
        console.log(paragraphsInPages);
    }, [paragraphsInPages]);

    useEffect(() => {
         //if the last action was to go to the previous chapter, then the first page displayed shall be the last one in the chapter
         if(navigateToPreviousChapterTriggerRef.current === true) {
            console.log(totalPageNumbers);
            flatlistRef.current?.scrollToIndex({
                index: totalPageNumbers,
            });
            navigateToPreviousChapterTriggerRef.current = false;
        }
    }, [totalPageNumbers]);

    useEffect(() => {
        console.log("text in page", textInPages);
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
        const fetchResponse: ResponseType = await get_book_chapter_title(bookID, chapterNumber).then();

        if (fetchResponse.success) {
            const receivedChapterTitle: string = JSON.parse(fetchResponse.message);
            setBookChapterTitle(receivedChapterTitle);
        }
    }

    async function loadBookChapterContent() : Promise<void> {
        const fetchResponse = await get_book_chapter_content(bookID, chapterNumber).then();

        if (fetchResponse.success) {
            const receivedChapterContent: textParagraph[] = JSON.parse(fetchResponse.message);
            //console.log("aici");
            console.log(receivedChapterContent);
            setBookChapterContent(receivedChapterContent);
        }
        //setBookChapterContent(textToDisplay);
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

    function navigateToNextChapter() {
        setNavigateToNextChapterTrigger(false);
        if(chapterNumber < totalNumberOfChapters) {
            setChapterNumber(chapterNumber + 1);
            //first page of next chapter
            flatlistRef.current?.scrollToIndex({
                index: 0,
            });
            setCurrentPage(0);
            console.log("navigate to next chapter");
        }
    }

    function navigateToPreviousChapter() {
        if(chapterNumber > 1) {
            setChapterNumber(chapterNumber - 1);
            console.log("navigate to previous chapter");
        }
    }

    function flatListScrollToNext() {
        console.log("scrollToNext");
        //can scroll in the current chapter
        if(currentPage < totalPageNumbers - 1) {
            flatlistRef.current?.scrollToIndex({
                index: currentPage + 1,
            });
            setCurrentPage(currentPage+1);
        }
        if(navigateToNextChapterTrigger) {
            navigateToNextChapter();
        }
    }

    function flatListScrollToPrevious() {
        if(currentPage > 0) {
            flatlistRef.current?.scrollToIndex({
                index: currentPage - 1,
            });
            setCurrentPage(currentPage-1);
        }
        if(navigateToPreviousChapterTriggerRef.current) {
            navigateToPreviousChapter();
        }
    }

    const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
        const currentPageVisible: number = viewableItems[0]["index"];
        setCurrentPage(currentPageVisible);
    }, []);

    function onScrollCallback (scrollOffset: number) {
        if (scrollOffset === 0) {
            //console.log("setez perv chapter trigger");
            navigateToPreviousChapterTriggerRef.current = true;
        }
        else {
            if((totalPageNumbers - 1) * windowWidth !== scrollOffset) { //this is how scr0ll offset is calculated
                setNavigateToNextChapterTrigger(false);
            }
            //console.log("resetez perv chapter trigger");
            navigateToPreviousChapterTriggerRef.current = false;
        }
    }
    
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
                        <Text style={styles.table_of_contents_text}> {chapterNumberToDisplay} </Text>
                        <AntDesign name="down" size={20} color="white" />
                    </TouchableOpacity>
                   
                </View>

                <View style={styles.body}>
                    <View style={[styles.header, {backgroundColor: selectedBackgroundColor}]}>                    
                        <Text style={[styles.chapter_number, {fontFamily: selectedFont, color: fontColor}]}>Chapter {chapterNumberToDisplay}</Text>
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
                            onScroll={(event) => {
                                const scrollOffset = event.nativeEvent.contentOffset.x;
                                onScrollCallback(scrollOffset);
                            }}
                            onEndReached={() => {
                                if(currentPage !== 0) {
                                    setNavigateToNextChapterTrigger(true);
                                }
                            }}
                            renderItem={({ item }) => (
                                <View style={[styles.content_view, { backgroundColor: selectedBackgroundColor }]}>
                                    <PageView
                                        paragraphsInAPage={paragraphsInPages[currentPage]}
                                        selectedBackgroundColor={selectedBackgroundColor}
                                        selectedFont={selectedFont}
                                        fontColor={fontColor}
                                        fontSize={fontSize}
                                        />
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
                                
                {
                    navigateToNextChapterTrigger &&

                    <View style={styles.nextChapterInfo}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => navigateToNextChapter()}>
                            <AntDesign name="arrowright" size={20} color={Globals.COLORS.PURPLE} />
                            <Text style={styles.changeChaptersText}> Next Chapter </Text>
                        </TouchableOpacity>
                    </View>
                }

                {
                    navigateToPreviousChapterTriggerRef.current &&

                    <View style={styles.previousChapterInfo}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => navigateToPreviousChapter()}>
                            <AntDesign name="arrowleft" size={20} color={Globals.COLORS.PURPLE} />
                            <Text style={styles.changeChaptersText}> Previous Chapter </Text>
                        </TouchableOpacity>
                    </View>
                }
                
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
    nextChapterInfo: {
        position: 'absolute',
        height: windowHeight * 0.3,
        width: windowWidth * 0.3,
        top: windowHeight * 0.35,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Set the alpha value (0.5) for transparency
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
    },
    changeChaptersText: {
        backgroundColor: 'black',
        color: Globals.COLORS.PURPLE,
        fontWeight: 'bold',
    },
    previousChapterInfo: {
        position: 'absolute',
        height: windowHeight * 0.3,
        width: windowWidth * 0.3,
        top: windowHeight * 0.35,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Set the alpha value (0.5) for transparency
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    }
});

