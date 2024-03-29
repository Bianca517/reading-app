import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Switch, Modal, ScrollView} from 'react-native'; 
import Globals from '../_globals/Globals';
import { FontPicker } from './font-picker';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { TouchableOpacity } from '@gorhom/bottom-sheet';


const backgroundColors: { [key: string]: string } = {
    [Globals.BACKGROUND_COLOR_0]: Globals.COLORS.BACKGROUND_WHITE,
    [Globals.BACKGROUND_COLOR_1]: Globals.COLORS.BACKGROUND_GRAY,
    [Globals.BACKGROUND_COLOR_2]: Globals.COLORS.BACKGROUND_YELLOW,
};

type props = {
    updateFontFamily: (fontFamily: string) => void;
    updateFontSize: (increaseFont: boolean) => void;
    updateBackgroundColor: (backgroundColor: string) => void;
    updateGestureScroll: (isEnabled: boolean) => void;
}

type FontStyles = {
    [key: string]: {
        fontFamily?: string;
        // Add other style properties if needed
    };
};

const fontStyles: FontStyles = {
    'System': {},
    'Arial': { fontFamily: 'Arial' },
    'Georgia': { fontFamily: 'Georgia' },
    'Times New Roman': { fontFamily: 'Times New Roman' },
    'Verdana': { fontFamily: 'Verdana' },
    'Courier New': { fontFamily: 'Courier New' },
    'Helvetica': { fontFamily: 'Helvetica' },
    'Palatino': { fontFamily: 'Palatino' },
    'Garamond': { fontFamily: 'Garamond' },
};

export default function BottomSheetContent( {updateFontFamily, updateFontSize, updateBackgroundColor, updateGestureScroll} : props) {
    const toggleSwitch = () => setIsGestureScrollingActive(previousState => !previousState);

    const [selectedBackgroundColor, setSelectedBackgroundColor] = useState<string>(Globals.COLORS.BACKGROUND_GRAY);
    const [selectedFont, setSelectedFont] = useState('System');
    const [isGestureScrollingActive, setIsGestureScrollingActive] = useState<boolean>(false);

    const [isFontPickerVisible, setIsFontPickerVisible] = useState(false);

    useEffect(() => {
        updateGestureScroll(isGestureScrollingActive);
    }), [isGestureScrollingActive];

    useEffect(() => {
        updateFontFamily(selectedFont);
    }), [selectedFont];

    useEffect(() => {
        updateBackgroundColor(selectedBackgroundColor);
    }, [selectedBackgroundColor]);
   
    
    return (
        <View style={styles.container}> 
            <View style={styles.gesture_scroll_container}>
                <Text style={styles.text_styles}> Activate gesture Scrolling </Text>
                <Switch
                    trackColor={{false: Globals.COLORS.BACKGROUND_GRAY, true: Globals.COLORS.PURPLE}}
                    thumbColor={'white'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isGestureScrollingActive}
                 />
            </View>

            <View style={styles.background_color_container}>
                <Text style={styles.text_styles}> Background Color </Text>
                
                <View style={styles.background_colors_view}>
                    <TouchableHighlight
                            activeOpacity={0.6}
                            underlayColor="#DDDDDD"
                            style={[styles.background_color, { backgroundColor: backgroundColors[Globals.BACKGROUND_COLOR_0], borderColor: selectedBackgroundColor === backgroundColors[Globals.BACKGROUND_COLOR_0] ? Globals.COLORS.PURPLE : Globals.COLORS.BACKGROUND_GRAY }]}
                            onPress={() => setSelectedBackgroundColor(backgroundColors[Globals.BACKGROUND_COLOR_0])}
                    ></TouchableHighlight>

                    <TouchableHighlight
                        style={[styles.background_color, { backgroundColor: backgroundColors[Globals.BACKGROUND_COLOR_1], borderColor: selectedBackgroundColor ===  backgroundColors[Globals.BACKGROUND_COLOR_1] ? Globals.COLORS.PURPLE : Globals.COLORS.BACKGROUND_GRAY }]}
                        onPress={() => setSelectedBackgroundColor(backgroundColors[Globals.BACKGROUND_COLOR_1])}
                    ></TouchableHighlight>

                    <TouchableHighlight
                        activeOpacity={0.6}
                        underlayColor="#DDDDDD"
                        style={[styles.background_color, { backgroundColor: backgroundColors[Globals.BACKGROUND_COLOR_2], borderColor: selectedBackgroundColor ===  backgroundColors[Globals.BACKGROUND_COLOR_2] ? Globals.COLORS.PURPLE : Globals.COLORS.BACKGROUND_GRAY }]}
                        onPress={() => setSelectedBackgroundColor(backgroundColors[Globals.BACKGROUND_COLOR_2])}
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
                    onSelect={(font) => setSelectedFont(font)}
                    onClose={() => setIsFontPickerVisible(false)}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
   container: {
        //backgroundColor: 'yellow',
        //flex: 1,
        //flexDirection: 'column',
        justifyContent: 'flex-start',
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
})

