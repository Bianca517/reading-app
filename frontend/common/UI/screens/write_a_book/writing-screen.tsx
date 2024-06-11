import React, { useState, useEffect, ReactNode } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions, SafeAreaView, TextInput , ScrollView, Alert} from 'react-native';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import Globals from '../../_globals/Globals';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ResponseType, NavigationParameters, ResponseTypePOST } from '../../../types';
import { add_new_chapter_to_book, add_new_paragraphs_list_to_chapter } from '../../../services/write-book-service';
import { get_number_of_chapters_of_book } from '../../../services/book-reading-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { DocumentPickerResult, DocumentPickerSuccessResult } from 'expo-document-picker';
import { upload_song_chapter } from '../../../services/upload-media-services';
import { FontAwesome6 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import MarqueeText from 'react-native-marquee';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function WritingScreenUI( {route} ) {
    const navigation = useNavigation<NavigationProp<NavigationParameters>>();

    const bookID: string = route.params.bookID;
    const chapterNumberFromRoute: number = route.params.numberOfChapters;
  
    const [chapterTitle, setChapterTitle] = useState<string>(null);
    const [chapterContent, setChapterContent] = useState<string>(null);
    const [numberOfChapters, setNumberOfChapters] = useState<number>(-1);

    const [songUri, setSongUri] = useState<string>(null);
    const [songName, setSongName] = useState<string>(null);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const [textInputHeight, setTextInputHeight] = useState<number>(0);

    //try to see if there is anything saved in async storage that user started to write
    useEffect(() => {
        loadDataFromStorage();
    }, []);


    useEffect(() => {
        console.log("chapter title changed");
        console.log(chapterTitle);
    }, [chapterTitle]);


    useEffect(() => {
        console.log("chapter content changed");
        console.log(chapterContent);
    }, [chapterContent]);

    
    async function loadDataFromStorage() {
        const storedChapterTitle = await AsyncStorage.getItem('storedChapterTitle');
        if(storedChapterTitle !== null) {
            setChapterTitle(storedChapterTitle);
        }

        const storedChapterContent = await AsyncStorage.getItem('storedChapterContent');
        if(storedChapterContent !== null) {
            setChapterContent(storedChapterContent);
        }
    }


    async function saveTitleDataToStorage() {
        try {
            await AsyncStorage.setItem(
              'storedChapterTitle',
              chapterTitle,
            );
          } catch (error) {
            console.log("could not save in work chapter data persistently")
          }
    }


    async function saveContentDataToStorage() {
        try {
            await AsyncStorage.setItem(
                'storedChapterContent',
                chapterContent,
            );
          } catch (error) {
            console.log("could not save in work chapter data persistently")
          }
    }


    function clearDataFromStorage() {
        try {
            AsyncStorage.removeItem('storedChapterTitle');
            AsyncStorage.removeItem('storedChapterContent');
          } catch (error) {
            console.log("could not clear in work chapter data")
          }
    }


    async function getNumberOfChaptersOfBook(): Promise<number> {
        let fetchResponseChapters: ResponseType = await get_number_of_chapters_of_book(bookID);

        let receivedNumberOfChapters: number = 0;
        if (fetchResponseChapters.success) {
            receivedNumberOfChapters = parseInt(fetchResponseChapters.message);
            //console.log(fetchResponseChapters.message);
            setNumberOfChapters(receivedNumberOfChapters);
        }
        return receivedNumberOfChapters;  
    }

    async function pickADocument() {
        try {
            await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
            })
            .then(async (document: DocumentPickerSuccessResult) => {
                console.log(document);
                setSongUri(document.assets[0].uri);
                setSongName(document.assets[0].name);
                const { sound } = await Audio.Sound.createAsync(
                    { uri: document.assets[0].uri });
                setSound(sound);
            })
            .catch((e) => {
                Alert.alert('Something is wrong with the chosen file.\n', e.message);
            })
        } catch (e) {
            Alert.alert('Something went wrong: ', e.message);
        }
    }

    async function saveParagraphs() {
        const currentNumberOfChapters = await getNumberOfChaptersOfBook();
     
        //first, send request to add new chapter to book
        //but make sure that the new added chapter is last one
        //this prevent adding chapter twice if button is pressed twice
        let fetchResponseChapter: ResponseTypePOST = {status: -1};

        if(chapterNumberFromRoute == currentNumberOfChapters) {
            fetchResponseChapter = await add_new_chapter_to_book(bookID, chapterTitle);

            if(fetchResponseChapter.status == 0) {

                //encode uri needed to preserve endlines
                let fetchResponseParagraph = await add_new_paragraphs_list_to_chapter(bookID, chapterNumberFromRoute, encodeURIComponent(chapterContent));

                if(fetchResponseParagraph.status == 0) {
                    Alert.alert("Successfully added a new chapter to your book!");
                    navigation.navigate("Continue Writing", { bookID: bookID });
                    clearDataFromStorage();
                }
                else {
                    Alert.alert("Some paragraphs could not be added.");
                }
            }
        }
        else {
            Alert.alert("New chapter could not be added." + chapterNumberFromRoute + " " + numberOfChapters);
        }
    }


    async function handleSavingChapter() {
        if(chapterTitle !== null && chapterContent !== null) {
            await saveParagraphs();
        } 
        else {
            Alert.alert("All fields are required!");
        }   

        if(songUri != null) {
            await upload_song_chapter(bookID, chapterNumberFromRoute, songUri);
        }
    }

    async function playSound() {
        console.log('Playing Sound');
        if(sound) {
            setIsPlaying(true);
            await sound.playAsync();
        }
    }

    async function stopSound() {
        console.log("Pausing Sound");
        if(sound) {
            setIsPlaying(false);
            await sound.pauseAsync();
        }
    }

    function displayMusicPlayerButtons() {
        return (
            <View style={styles.music_player_controllers}>
                <TouchableOpacity onPress={() => playSound()}>
                    <FontAwesome6 name="play-circle" size={29} color={isPlaying ? 'gray' : Globals.COLORS.PURPLE} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => stopSound()}>
                    <Ionicons name="pause-circle" size={34} color={isPlaying ? Globals.COLORS.PURPLE: 'gray'} />
                </TouchableOpacity>
            </View>
        )
    }

    function handleAddOrRemoveSongButtonText() {
        if(songUri !== null) {
            return (
                <Text style={[styles.post_chapter_text, {fontWeight: 'bold'}]}>
                    - Remove Song 
                </Text>
            )
        }
        else {
            return (
                <Text style={[styles.post_chapter_text, {fontWeight: 'bold'}]}>
                    + Add a Song 
                </Text>
            )
        }
    }

    function handleAddOrRemoveSongButtonCallback() {
        if(songUri !== null) {
            setSongUri(null);
            setSongName(null);
            setIsPlaying(false);
            setSound(null);
        }
        else {
            pickADocument();
        }
    }

    return(
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.fullscreen_container}>
                <View style={styles.header_info_container}>
                    <View style={styles.left_line_through}></View>
                            
                    <Text style = {styles.write_new_chapter_text}>
                        Write A New Chapter
                    </Text>   

                    <View style={styles.right_line_through}></View>   
                </View>

                <View style={styles.chapter_title_view}>
                    <Text style={styles.add_title_info}>
                        add chapter's title
                    </Text>
                    <TextInput 
                        style={[styles.text_inputs_style, {height: 45}]}
                        onChangeText={text => setChapterTitle(text)}
                        value={chapterTitle}
                        placeholder='Chapter title'
                        placeholderTextColor={Globals.COLORS.PLACEHOLDER_TEXT_COLOR}
                        onEndEditing={ () => {
                            Keyboard.dismiss();
                            saveTitleDataToStorage();
                        }}
                    >

                    </TextInput>
                </View>

                <View style={styles.writing_container}>
               
                    <ScrollView contentContainerStyle={styles.writing_container_scrollview} keyboardShouldPersistTaps="handled">
                       
                            <TextInput
                                style={[styles.text_inputs_style, { height: Math.max(600, textInputHeight), width: '100%' }]}
                                onChangeText={(text) => setChapterContent(text)}
                                onContentSizeChange={(event) =>
                                    setTextInputHeight(event.nativeEvent.contentSize.height)
                                }
                                value={chapterContent}
                                textAlignVertical='top'
                                textAlign='center'
                                placeholder='Write the story here...'
                                placeholderTextColor={Globals.COLORS.PLACEHOLDER_TEXT_COLOR}
                                onEndEditing={() => {
                                    Keyboard.dismiss();
                                    saveContentDataToStorage();
                                }}
                                multiline
                            />
                            {
                                songName && (
                                    <View style={styles.music_player_section_view}>
                                        <Text style={styles.added_song_text}> This chapter's readers will listen to: </Text>
                                        <View style={styles.marquee_text_view}>
                                            <MarqueeText
                                                style={styles.marquee_text}
                                                speed={0.2}
                                                marqueeOnStart={true}
                                                loop={true}
                                                delay={1000}
                                                >
                                                {songName}
                                            </MarqueeText>
                                        </View>
                                        {displayMusicPlayerButtons()}
                                    </View>   
                                )
                            }
                          

                            <View style={styles.buttons_footer_view}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.post_chapter_button}
                                    onPress={() => handleAddOrRemoveSongButtonCallback()}
                                >
                                    {handleAddOrRemoveSongButtonText()}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.post_chapter_button}
                                    onPress={() => handleSavingChapter()}
                                >
                                    <Text style={[styles.post_chapter_text, {fontWeight: '900'}]}>
                                        + Post Chapter
                                    </Text>
                                </TouchableOpacity>

                            </View>
                       
                    </ScrollView>
                    </View>
                
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    fullscreen_container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Globals.COLORS.BACKGROUND_GRAY,
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    header_info_container: {
        flex: 0.5,
        //backgroundColor: 'black',
        flexDirection: 'row',
    },
    chapter_title_view: {
        flex: 1.5,
        //backgroundColor: 'red',
        flexDirection: 'column',
        alignItems: 'center',
    },
    writing_container: {
        flex: 8,
        //backgroundColor: 'blue',
        paddingTop: 25,
    },
    writing_container_scrollview: {
        //backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    right_line_through: {
        flex: 3,
        backgroundColor: 'white',
        height: 2,
        marginTop: 13,
        marginLeft: -5,
    },
    left_line_through: {
        flex: 1,
        backgroundColor: 'white',
        height: 2,
        marginTop: 13,
        marginRight: 0
    },
    write_new_chapter_text: {
        flex: 3,
        marginTop: 3,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        justifyContent: 'flex-start',
        marginHorizontal: 3,
    },
    add_title_info: {
        color: 'white',
        fontSize: 15,
        marginTop: '5%',
        marginLeft: 20,
        fontWeight: '200'
    },
    text_inputs_style: {
        backgroundColor: Globals.COLORS.WRITING_SCREEN_TEXT_INPUTS,
        color: 'white',
        fontWeight: '200',
        fontSize: 17,
        borderRadius: 15,
        width: '85%',
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.7,
        borderColor: 'white'
    },
    post_chapter_button: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 5,
        width: 'auto',
        height: 40,
        alignItems: 'center',
        opacity: 1,
        //marginBottom: 100,
    },
    post_chapter_text: {
        marginTop: 3,
        color: Globals.COLORS.PURPLE,
        fontSize: 15,
        justifyContent: 'flex-start',
        marginHorizontal: 3,
    },
    buttons_footer_view: {
        //backgroundColor: 'yellow',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 40,
        marginBottom: 40,
    },
    music_player_section_view: {
        marginTop: 20,
        //backgroundColor: 'pink',
        width: '90%',
        flexDirection: 'column',
    },
    music_player_controllers: {
        flexDirection: 'row',
        paddingVertical: 5,
        alignItems: 'center',
        alignSelf: 'center',
    },
    marquee_text_view: {
        backgroundColor: 'purple',
    },
    marquee_text: {
        color: 'white',
        fontSize: 17,
        fontStyle: 'italic',
    },
    added_song_text: {
        color: 'white',
        fontSize: 17,
        fontWeight: '300',
        textAlign: 'center',
    }
})