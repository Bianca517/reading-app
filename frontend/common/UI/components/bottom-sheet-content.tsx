import React, { useCallback, useEffect, useState } from 'react';
import { NavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Switch, Platform, Alert} from 'react-native'; 
import Globals from '../_globals/Globals';
import { FontPicker } from './font-picker';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { TouchableOpacity, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { FontAwesome6 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { SoundObject } from 'expo-av/build/Audio';
import GlobalBookData from '../_globals/GlobalBookData';
import { NavigationParameters, bookDTO } from '../../types';
import GlobalUserData from '../_globals/GlobalUserData';
import { remove_book_from_library } from '../../services/book-reading-service';

const backgroundColors: { [key: string]: string } = {
    [Globals.BACKGROUND_COLOR_0]: Globals.COLORS.BACKGROUND_WHITE,
    [Globals.BACKGROUND_COLOR_1]: Globals.COLORS.BACKGROUND_GRAY,
    [Globals.BACKGROUND_COLOR_2]: Globals.COLORS.BACKGROUND_YELLOW,
};

type props = {
    bookId: string,
    chapterNumber: number,
    isBookInLibrary: boolean,
    isSongLoaded: boolean,
    isSongPlaying: boolean,
    initialFont: string,
    initialBackgroundColor: string,
    initialGestureScrollingActive: boolean
    updateFontFamily: (fontFamily: string) => void;
    updateFontSize: (increaseFont: boolean) => void;
    updateBackgroundColor: (backgroundColor: string) => void;
    updateGestureScroll: (isEnabled: boolean) => void;
    playSoundPressed: () => void;
    pauseSoundPressed: () => void;
}


export default function BottomSheetContent( 
    {
        bookId, chapterNumber, isBookInLibrary, isSongLoaded, isSongPlaying, 
        initialFont, initialBackgroundColor, initialGestureScrollingActive,
        updateFontFamily, updateFontSize, updateBackgroundColor, updateGestureScroll, 
        playSoundPressed, pauseSoundPressed
    } : props) {

    const toggleSwitch = () => setIsGestureScrollingActive(previousState => !previousState);

    const { dismiss } = useBottomSheetModal();

    //platform OS
    const isAndroid: boolean = Platform.OS === 'android';
    const defaultFont = isAndroid ? 'normal' : 'System';

    const [selectedBackgroundColor, setSelectedBackgroundColor] = useState<string>(initialBackgroundColor);
    const [selectedFont, setSelectedFont] = useState(initialFont);
    const [isGestureScrollingActive, setIsGestureScrollingActive] = useState<boolean>(initialGestureScrollingActive);

    const [isFontPickerVisible, setIsFontPickerVisible] = useState(false);
    

    const navigation = useNavigation<NavigationProp<NavigationParameters>>();

    const status = {
        shouldPlay: false,
    }

    useEffect(() => {
        updateGestureScroll(isGestureScrollingActive);
    }), [isGestureScrollingActive];
/*
    useEffect(() => {
        updateFontFamily(selectedFont);
    }), [selectedFont];
*/

/*
    useEffect(() => {
        console.log("update background color to " + selectedBackgroundColor);
        updateBackgroundColor(selectedBackgroundColor);
    }, [selectedBackgroundColor]);
*/

    useEffect( () => {
        Audio.setAudioModeAsync({
            //interruptionModeAndroid: Audio.INTERR,
            shouldDuckAndroid: true,
            staysActiveInBackground: true,
            playThroughEarpieceAndroid: true
        })
    }, []);

    useCallback(() => {
        console.log("am deschis panoul de setari si am primit chapter number ", chapterNumber);
    }, [chapterNumber]);    


    function handleRemoveBook() {
        //remove from current readings
        GlobalBookData.CURRENT_READINGS = GlobalBookData.CURRENT_READINGS.filter((book: bookDTO) => book.bookID != bookId);
        remove_book_from_library(bookId, GlobalUserData.LOGGED_IN_USER_DATA.uid).then((success: Boolean) => {
            if(success) {
                Alert.alert("Successfully removed book from library!");
                navigation.navigate("Library");
            }
        })
    }
    
    return (
        <View style={styles.container}> 
            { isAndroid && 
                (<View style={styles.gesture_scroll_container}>
                    <Text style={styles.text_styles}> Activate Gesture Scrolling </Text>
                    <Switch
                        trackColor={{false: Globals.COLORS.BACKGROUND_GRAY, true: Globals.COLORS.PURPLE}}
                        thumbColor={'white'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isGestureScrollingActive}
                    />
                </View>)
            }

            { isSongLoaded && (
                <View style={styles.music_player_container}>
                    <Text style={styles.text_styles}>
                        Control Music Player
                    </Text>
                    <View style={styles.music_player_controllers}>
                        <TouchableOpacity onPress={() => playSoundPressed()}>
                            <FontAwesome6 name="play-circle" size={24} color={isSongPlaying ? 'gray' : Globals.COLORS.PURPLE} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => pauseSoundPressed()}>
                            <Ionicons name="pause-circle" size={29} color={isSongPlaying ? Globals.COLORS.PURPLE: 'gray'} />
                        </TouchableOpacity>
                    </View>
                </View>
                )
            }
            <View style={styles.background_color_container}>
                <Text style={styles.text_styles}> Background Color </Text>
                
                <View style={styles.background_colors_view}>
                    <TouchableHighlight
                            activeOpacity={0.6}
                            underlayColor="#DDDDDD"
                            style={[styles.background_color, { backgroundColor: backgroundColors[Globals.BACKGROUND_COLOR_0], borderColor: selectedBackgroundColor === backgroundColors[Globals.BACKGROUND_COLOR_0] ? Globals.COLORS.PURPLE : Globals.COLORS.BACKGROUND_GRAY }]}
                            onPress={() => {
                                setSelectedBackgroundColor(backgroundColors[Globals.BACKGROUND_COLOR_0]);
                                updateBackgroundColor(backgroundColors[Globals.BACKGROUND_COLOR_0]);
                            }}
                    ></TouchableHighlight>

                    <TouchableHighlight
                        style={[styles.background_color, { backgroundColor: backgroundColors[Globals.BACKGROUND_COLOR_1], borderColor: selectedBackgroundColor ===  backgroundColors[Globals.BACKGROUND_COLOR_1] ? Globals.COLORS.PURPLE : Globals.COLORS.BACKGROUND_GRAY }]}
                        onPress={() => {
                            setSelectedBackgroundColor(backgroundColors[Globals.BACKGROUND_COLOR_1]);
                            updateBackgroundColor(backgroundColors[Globals.BACKGROUND_COLOR_1]);
                        }}
                    ></TouchableHighlight>

                    <TouchableHighlight
                        activeOpacity={0.6}
                        underlayColor="#DDDDDD"
                        style={[styles.background_color, { backgroundColor: backgroundColors[Globals.BACKGROUND_COLOR_2], borderColor: selectedBackgroundColor ===  backgroundColors[Globals.BACKGROUND_COLOR_2] ? Globals.COLORS.PURPLE : Globals.COLORS.BACKGROUND_GRAY }]}
                        onPress={() => {
                            setSelectedBackgroundColor(backgroundColors[Globals.BACKGROUND_COLOR_2]);
                            updateBackgroundColor(backgroundColors[Globals.BACKGROUND_COLOR_2]);
                        }}
                    ></TouchableHighlight>
                </View>

            </View>

            <View style={styles.font_container}>
                <Text style={styles.text_styles}> Font </Text> 
                <View style={styles.font_sizes_container}>
                    <TouchableOpacity
                        style={styles.font_size_button}
                        onPress={() => updateFontSize(false)}
                    >
                        <Text style={styles.font_size_text}> Aa- </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.font_size_button}
                        onPress={() => updateFontSize(true)}
                    >
                        <Text style={styles.font_size_text}> Aa+ </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.font_family_container}>
                <TouchableOpacity style={styles.font_family_view} onPress={() => setIsFontPickerVisible(true)}>
                        <Text style={[styles.font_family_text, {fontFamily: selectedFont}]}>{selectedFont}</Text>
                </TouchableOpacity>
                <FontPicker
                    visible={isFontPickerVisible}
                    onSelect={(font) => updateFontFamily(font)}
                    onClose={() => setIsFontPickerVisible(false)}
                />
            </View>

            {
                isBookInLibrary && (
                    <View style={[styles.remove_button_view, {marginTop: isSongLoaded ? 10 : 20}]}>
                    <TouchableOpacity style={styles.remove_button} onPress={() => handleRemoveBook()}>
                            <Text style={styles.remove_button_text}>Remove book from library</Text>
                    </TouchableOpacity>
                </View>
                )
            }
           
        </View>
    )
}

const styles = StyleSheet.create({
   container: {
        //backgroundColor: 'yellow',
        //flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: 15
   },
   text_styles: {
        color: 'black',
        fontSize: 15,
        fontWeight: '600',
   },
   gesture_scroll_container: {
        //backgroundColor: 'green',
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10
   },
   music_player_container: {
        //backgroundColor: 'pink',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingLeft: 3,
   },
   background_color_container: {
        //backgroundColor: 'pink',
        //flex: 2,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        marginBottom: 10,
   },
   font_container: {
        //backgroundColor: 'purple',
        //flex: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',   
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
   },
   font_family_container: {
        //backgroundColor: 'red',
        //flex: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',   
        alignItems: 'center',
        width: '100%',
   },
   background_colors_view: {
        //backgroundColor: 'blue',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        marginTop: 10,
        height: 60,
    },
    background_color: {
        height: 60,
        width: 110,
        borderWidth: 2,
        borderColor: Globals.COLORS.BACKGROUND_GRAY,
    },
    font_sizes_container: {
        backgroundColor: Globals.COLORS.BACKGROUND_GRAY,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: "60%",
        marginTop: 10,
        height: 60,
        borderRadius: 10,
    },
    font_size_button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    font_size_text: {
        color: 'white',
        fontSize: 20,
        fontWeight: '200',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    fontList: {
        backgroundColor: 'white',
        maxHeight: '50%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    fontItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: Globals.COLORS.BACKGROUND_GRAY,
    },
    fontText: {
        fontSize: 18,
        color: 'black',
    },
    font_family_view: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        backgroundColor: Globals.COLORS.BACKGROUND_GRAY,
        width: 150,
        borderRadius: 10,
    },
    font_family_text: {
        color: 'white',
        fontSize: 17,
        fontWeight: '400',
    },
    music_player_controllers: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 70,
    },
    remove_button_view: {
        
    },
    remove_button: {
        backgroundColor: 'red',
        borderRadius: 10,
        height: 40,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    remove_button_text: {
        marginHorizontal: 10,
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    }
})

