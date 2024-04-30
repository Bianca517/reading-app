import React, { useState, useEffect, ReactNode } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions, SafeAreaView, TextInput , ScrollView} from 'react-native';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import Globals from '../../_globals/Globals';
import { useNavigation } from '@react-navigation/native';
import { ResponseType } from '../../../types';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function WritingScreenUI() {
    const navigation = useNavigation();
    const [chapterTitle, setChapterTitle] = useState<string>("");
    const [chapterContent, setChapterContent] = useState<string>("");

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
                        placeholder='Chapter title'
                        placeholderTextColor={Globals.COLORS.PLACEHOLDER_TEXT_COLOR}
                        onEndEditing={ () => Keyboard.dismiss()}
                    >

                    </TextInput>
                </View>

                <View style={styles.writing_container}>
               
                    <ScrollView contentContainerStyle={styles.writing_container_scrollview} keyboardShouldPersistTaps="handled">
                       
                            <TextInput
                                style={[styles.text_inputs_style, { height: 600, width: '100%' }]}
                                onChangeText={(text) => setChapterContent(text)}
                                textAlignVertical='top'
                                textAlign='center'
                                placeholder='Write the story here...'
                                placeholderTextColor={Globals.COLORS.PLACEHOLDER_TEXT_COLOR}
                                onEndEditing={() => Keyboard.dismiss()}
                                multiline
                            />

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.post_chapter_button}
                            >
                                <Text style={styles.post_chapter_text}>
                                    + Post the First Chapter
                                </Text>
                            </TouchableOpacity>
                       
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
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 190,
        height: 40,
        alignItems: 'center',
        opacity: 1,
        marginTop: 50,
        marginBottom: 100,
    },
    post_chapter_text: {
        marginTop: 3,
        color: Globals.COLORS.PURPLE,
        fontWeight: 'bold',
        fontSize: 15,
        justifyContent: 'flex-start',
        marginHorizontal: 3,
    },
})