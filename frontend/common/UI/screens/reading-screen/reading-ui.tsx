import React, { ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions, Button, FlatList, Platform } from 'react-native';
import Globals from '../../_globals/Globals';
import BottomSheet, { BottomSheetView, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BottomSheetContent from '../../components/bottom-sheet-content';
import { AntDesign } from '@expo/vector-icons'; 
import TextDistributer from '../../components/page-distribution-calculator';
import { loadChapterTitles, loadTotalNumberOfChapters, loadBookChapterTitle, loadBookChapterContent } from '../../components/service-calls-wrapper';
import PageView from '../../components/page-view';
import { textParagraph } from "../../../types";
import { useIsFocused } from "@react-navigation/native";
import { Animated } from 'react-native';
import GlobalBookData from '../../_globals/GlobalBookData';
import { updateUserCurrentPositionInBook } from '../../../services/monitor-user-position-service';
import GlobalUserData from '../../_globals/GlobalUserData';

let FaceDetectionModule = null;

// Conditionally include the module only for Android
if (Platform.OS === 'android') {
  FaceDetectionModule = require('../../../.android/components/face-detector').default;
}


const scrollX = new Animated.Value(0);

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const bodyHeight = windowHeight * 50 / 100;


export default function ReadingScreen( {route} ) {
    //focused screen
    const isFocused = useIsFocused();

    //platform OS
    const isAndroid: boolean = Platform.OS === 'android';

    //route params
    const bookID = route.params.id;
    const chapterNumberFromRoute = route.params.chapterNumber;

    //customization parameters
    const [selectedBackgroundColor, setSelectedBackgroundColor] = useState<string>(Globals.COLORS.BACKGROUND_GRAY);
    const [selectedFont, setSelectedFont] = useState<string>(Globals.DEFAULT_FONT_FAMILY);
    const [isGestureScrollingActive, setIsGestureScrollingActive] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<number>(Globals.DEFAULT_FONT_SIZE);
    const [fontColor, setFontColor] = useState<string>(Globals.FONT_COLOR_1);

    //local variables
    const [bookChapterContent, setBookChapterContent] = useState<textParagraph[]>([]);
    const [bookChapterTitle, setBookChapterTitle] = useState<string>("");
    const [totalPageNumbers, setTotalPageNumbers] = useState<number>(0);
    const [totalNumberOfChapters, setTotalNumberOfChapters] = useState<number>();
    const [paragraphsInPages, setParagraphsInPages] = useState<textParagraph[][]>([]);
    //const [textInPages, setTextInPages] = useState<string[]>([]);
    const [chapterNumber, setChapterNumber] = useState<number>(chapterNumberFromRoute);
    const [chapterNumberToDisplay, setChapterNumberToDisplay] = useState<number>(chapterNumber + 1);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [chapterTitles, setChapterTitles] = useState<string[]>([]);
    const [pagesWithContent, setPagesWithContent] = useState<ReactNode[]>([]);
    const [isDataReady, setIsDataReady] = useState<boolean>(false);
    
    const [navigateToPreviousChapterTrigger, setNavigateToPreviousChapterTrigger] = useState<boolean>(false);
    const [navigateToNextChapterTrigger, setNavigateToNextChapterTrigger] = useState<boolean>(false);
    const [navigatedToPreviousChapter, setNavigatedToPreviousChapter] = useState<boolean>(false);

    let oldScrollRef = useRef<number>(0);
    let currentPage = useRef<number>(0);

    var currentScrollOffset: number = 0;


    //refferences
    const flatlistRef = useRef<FlatList<string>>(null);
    const sheetRef = useRef<BottomSheet>(null);
    
    const snapPoints = isAndroid ? ["55%"] : ["45%"];

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
        if (isFocused) {
            //console.log("Focused");
            checkPreviousScreen();
            //setCurrentPage(0);

            loadTotalNumberOfChapters(bookID).then(returnValue => {
                setTotalNumberOfChapters(returnValue);
                //when total number of chapter is available => safe to check for chapter titles, until then it is undefined
                loadChapterTitles(bookID, returnValue).then(chapterTitlesReceived => {
                    setChapterTitles(chapterTitlesReceived);
                })
            });
        }
    }, [isFocused]);

    useEffect(() => {
        loadBookChapterTitle(bookID, chapterNumber).then(chapterTitleReceived => setBookChapterTitle(chapterTitleReceived));
        loadBookChapterContent(bookID, chapterNumber).then(chapterContentReceived => {
            setBookChapterContent(chapterContentReceived);
            });
        setChapterNumberToDisplay(chapterNumber + 1);
    }, [bookID, chapterNumber, isFocused]);

    useEffect(() => {
        const distributedParagraphs: textParagraph[][] = TextDistributer(bookChapterContent, bodyHeight, windowWidth, fontSize);
        setParagraphsInPages(distributedParagraphs);
    }, [fontSize, selectedBackgroundColor, selectedFont, bookChapterContent]);

    useEffect(() => {
        //updateTextInPages(paragraphsInPages);
        setTotalPageNumbers(paragraphsInPages.length);
        //console.log("updating total page numbers", totalPageNumbers);
        //console.log(paragraphsInPages);
        buildPages();
        setIsDataReady(true);
        if(navigatedToPreviousChapter === true) {
            //console.log("de aici pornesc erorile???");
            flatlistRef.current?.scrollToEnd();
            setNavigatedToPreviousChapter(false);
        }
    }, [paragraphsInPages]);

    useEffect(() => {
        //if the last action was to go to the previous chapter, then the first page displayed shall be the last one in the chapter
        /*
        if(navigatedToPreviousChapter === true) {
            console.log("de aici pornesc erorile???");
            flatlistRef.current?.scrollToEnd();
            setNavigatedToPreviousChapter(false);
        }
        */
    }, [chapterNumber]);

    /*
    useEffect(() => {
        //console.log("text in page", textInPages);
    }, [textInPages]);
    */

    useEffect(() => {
        //console.log("current page", currentPage);
    }, [currentPage])

    useEffect(() => {
        //console.log("gesture scroll active ", isGestureScrollingActive);
    }, [isGestureScrollingActive]);
    
    useFocusEffect(
        React.useCallback(() => {
            // This function will be called when the screen is focused
            return () => {
                // This function will be called when the screen loses focus or unmounts
                if (typeof chapterNumber !== 'undefined') {
                    console.log("on removeeeeeeeeee", chapterNumber);
                    GlobalBookData.USER_CURRENT_POSITIONS[bookID] = chapterNumber.toString();
                    updateUserCurrentPositionInBook(GlobalUserData.LOGGED_IN_USER_DATA.uid, bookID, chapterNumber.toString());
                }
            };
        }, [chapterNumber, bookID])
    );

    function checkPreviousScreen() {
        /*
        const routes = navigation.getState()?.routes;
        const prevRoute = routes[routes.length - 2]["name"]; // -2 because -1 is the current route
        //console.log(prevRoute);
        //if the previous screen is the prologue, it means the user is now beginning the book
        if(prevRoute == "Prologue") {
            console.log("coming from the prologue. setting chapter number to 0");
            setChapterNumber(0);
        }
        else {
            setChapterNumber(route.params.chapterNumber);
            console.log("not coming from the prologue. setting chapter number to 0" + chapterNumber);
        }*/

        const chapterNumberFromRoute = route.params.chapterNumber;
        //console.log("am primit chapter number", chapterNumberFromRoute);
        if(chapterNumberFromRoute) {
            setChapterNumber(chapterNumberFromRoute);
        }
        else {
            setChapterNumber(0);
        }
        //console.log("0setting chapter number to ", chapterNumber);
    }


    function buildPages() {
        let pages: ReactNode[] = [];

        paragraphsInPages.forEach(arrayOfParagraphsInAPage => {
            pages.push(
                <PageView
                        bookID={bookID}
                        chapterNumber={chapterNumber}
                        paragraphsInAPage={arrayOfParagraphsInAPage}
                        selectedFont={selectedFont}
                        fontColor={fontColor}
                        fontSize={fontSize}
                />
            )
        });

        setPagesWithContent(pages);
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
        console.log("font color should change to ", fontColor);
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

        if(chapterNumber < totalNumberOfChapters - 1) {
            console.log("navigate to next chapter. before ", chapterNumber);
            const incrementedChapterNumber = chapterNumber + 1;
            setChapterNumber(incrementedChapterNumber);
            console.log("1setting chapter number to: ", incrementedChapterNumber);

            flatlistRef.current?.scrollToIndex({ //first page of next chapter
                index: 0,
            });

            //update user position in book
            GlobalBookData.USER_CURRENT_POSITIONS[bookID] = incrementedChapterNumber.toString();
        }
    }

    function navigateToPreviousChapter() {
        if(chapterNumber > 0) {
            const previousChapterNumber = chapterNumber - 1;
            setChapterNumber(previousChapterNumber);
            console.log("2setting chapter number to ", chapterNumber);
            //console.log("navigate to previous chapter ");
            setNavigatedToPreviousChapter(true);

            //update user position in book
            GlobalBookData.USER_CURRENT_POSITIONS[bookID] = previousChapterNumber.toString();
        }
    }

    function flatListScrollToNext() {
        //console.log("scrollToNext");
        //can scroll in the current chapter
        if(currentPage.current < totalPageNumbers - 1) {
            console.log("here 2");
            flatlistRef.current?.scrollToIndex({
                index: currentPage.current + 1,
            });
            //setCurrentPage(currentPage+1);
        }
        if(navigateToNextChapterTrigger) {
            navigateToNextChapter();
        }
    }

    function flatListScrollToPrevious() {
        if(currentPage.current > 0) {
            console.log("here 3");
            flatlistRef.current?.scrollToIndex({
                index: currentPage.current - 1,
            });
            //setCurrentPage(currentPage-1);
        }
        if(navigateToPreviousChapterTrigger){
            navigateToPreviousChapter();
        }
    }


    const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
        if (viewableItems && viewableItems.length > 0) {
            //in viewableItems, if 2 pages are visible, take the last one
            let currentPageVisible: number = viewableItems[0]["index"];
            //console.log(viewableItems);
            currentPage.current = currentPageVisible;
            //console.log("new page", currentPageVisible);
            console.log("chapter number", chapterNumber);
            console.log("total chapter numbers", totalNumberOfChapters);
            console.log("total pages: " + totalPageNumbers);
            console.log("current page: " + currentPage.current);

            if (currentPageVisible == 0) {
                if(chapterNumber != 0) {
                    //console.log("setez prev chapter trigger");
                    setNavigateToPreviousChapterTrigger(true);
                }
                setNavigateToNextChapterTrigger(false);
            }
            else {
                setNavigateToPreviousChapterTrigger(false);
                if(currentPage.current == (totalPageNumbers-1)) {
                    //do not go to next chapter if this is the last chapter
                    if(chapterNumber !== (totalNumberOfChapters-1)) {
                        setNavigateToNextChapterTrigger(true);
                        console.log("setez next chapter trigger after: ", navigateToNextChapterTrigger);
                    }
                    else {
                        setNavigateToNextChapterTrigger(false);
                    }
                }
                else {
                    //console.log("resetting next chapter trigger");
                    setNavigateToNextChapterTrigger(false);
                }
            }
        }
    }, [chapterNumber, totalNumberOfChapters, totalPageNumbers]); //!!!an empty dependency array means that the function will capture the initial values of the variables used inside it.


    function onScrollCallback () {
        
        //console.log("chapter number", chapterNumber); //here chapterNumber has the correct value
    }
    
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {
                isGestureScrollingActive && isAndroid && (
                    <FaceDetectionModule userAlreadyGavePermission={true} scrollRightCallback={flatListScrollToNext} scrollLeftCallback={flatListScrollToPrevious}></FaceDetectionModule>
                )
            }
            <SafeAreaView style={[styles.fullscreen_view, {backgroundColor: selectedBackgroundColor}]}>
                <View style={styles.table_of_contents_preview}>
                    <Text style={styles.table_of_contents_text}>Table of Contents</Text>
                  
                    <TouchableOpacity style={styles.right_side_of_table_of_contents_preview} onPress={() => navigation.navigate("Table of Contents", {'bookID' : bookID, 'chapterTitles': chapterTitles})}>
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
                    
                    { isDataReady &&
                    <FlatList
                            ref={flatlistRef}
                            extraData={pagesWithContent}
                            horizontal={true}  
                            data={pagesWithContent}
                            showsHorizontalScrollIndicator={false} 
                            keyExtractor={(item, index) => index.toString()}
                            disableIntervalMomentum
                            pagingEnabled={true}
                            removeClippedSubviews={true}
                            windowSize={1}
                            decelerationRate={'normal'}
                            onViewableItemsChanged={onViewableItemsChanged}
                            onScroll={(event) => {
                                let direction = event.nativeEvent.contentOffset.x > currentScrollOffset ? 'right' : 'left';
                                currentScrollOffset = event.nativeEvent.contentOffset.x;
                                //console.log(direction); // up or down accordingly
                            }}
                            ItemSeparatorComponent={(props) => {
                                //console.log('props', props); // here you can access the trailingItem with props.trailingItem
                                return (<View style={{height: 5, backgroundColor: props.highlighted ? 'green' : 'gray'}} />);
                              }}
                            onEndReached={() => {
                                /*
                                if(currentPage.current !== 0) { //because of this i added the end page for all chapter
                                    setNavigateToNextChapterTrigger(true);
                                }
                                */
                            }}
                            renderItem={({index}) => (
                                <View style={[styles.content_view]}>
                                    {pagesWithContent[index]}
                                </View>
                            )}
                        />
                    }
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
                        <BottomSheetContent bookId={bookID} chapterNumber={chapterNumber} updateFontFamily = {updateFontFamily} updateFontSize = {updateFontSize} updateBackgroundColor = {updateBackgroundColor} updateGestureScroll = {updateGestureScroll}/>
                    </BottomSheetView>
                </BottomSheet>
                                
                {
                    navigateToNextChapterTrigger && !isBottomSheetOpen &&

                    <View style={styles.nextChapterInfo}>
                        <TouchableOpacity activeOpacity={0.5} style={styles.nextChapterButton} onPress={() => 
                            { 
                                navigateToNextChapter(); 
                                setIsDataReady(false);
                            }}>
                            <AntDesign name="arrowright" size={25} color={Globals.COLORS.PURPLE} />
                            <Text style={styles.changeChaptersText}> Next Chapter </Text>
                        </TouchableOpacity>
                    </View>
                }

                {
                    navigateToPreviousChapterTrigger && !isBottomSheetOpen &&

                    <View style={styles.previousChapterInfo}>
                        <TouchableOpacity activeOpacity={0.5} style={styles.previousChapterButton} onPress={() => {
                            navigateToPreviousChapter();
                        }}>
                            <AntDesign name="arrowleft" size={25} color={Globals.COLORS.PURPLE} />
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
        flex: 1,
        flexDirection: 'column',
    },
    table_of_contents_preview: {
        flex: 1,
        backgroundColor: Globals.COLORS.BACKGROUND_LIGHT_GRAY,
        flexDirection: 'row',
        paddingHorizontal: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 50,
        borderRadius: 30,
        height: 'auto',
        marginBottom: 10,
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
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: 10,
    },
    white_line: {
        flex: 0.1,
        width: '80%',
        height: 2,
        alignSelf: 'center',
    },
    body: {
        flex: 13,
        width: windowWidth,
        flexDirection: 'column',
    },
    text_container: {
        flex: 20,
        //backgroundColor: 'green',
        height: 550,
        width: windowWidth,
    },
    content_view: {
        //backgroundColor: 'pink',
        flex: 5,
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
        alignSelf: 'center',
        textAlign: 'center',
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
    nextChapterInfo: {
        position: 'absolute',
        height: 40,
        width: windowWidth / 2,
        //top: windowHeight * 0.40,
        right: 0,
        bottom: 0,
        paddingRight: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Set the alpha value (0.5) for transparency
        justifyContent: 'center',
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
    },
    changeChaptersText: {
        //backgroundColor: 'black',
        color: Globals.COLORS.PURPLE,
        fontWeight: 'bold',
    },
    previousChapterInfo: {
        position: 'absolute',
        height: 40,
        width: windowWidth / 2,
        paddingLeft: 10,
        //top: windowHeight * 0.40,
        justifyContent: 'center',
        left: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Set the alpha value (0.5) for transparency
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    previousChapterButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    nextChapterButton: {
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    }
});

