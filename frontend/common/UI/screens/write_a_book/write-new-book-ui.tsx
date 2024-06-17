import React, { useState, useEffect, ReactNode } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions, SafeAreaView, TextInput , ScrollView, Alert} from 'react-native';
import Globals from '../../_globals/Globals';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NavigationParameters, ResponseType } from '../../../types';
import { SelectList } from 'react-native-dropdown-select-list';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import {Keyboard} from 'react-native';
import { add_new_book } from '../../../services/write-book-service';
import GlobalUserData from '../../_globals/GlobalUserData';
import { upload_book_cover } from '../../../services/upload-media-services';

import * as Sentry from "@sentry/react-native";

const windowWidth = Dimensions.get('window').width;

type dataInterest = {
    key: number,
    value: string
}

export default function WriteNewBookUI() {
    const [genresList, setGenresList] = useState<dataInterest[]>([]);
    const navigation = useNavigation<NavigationProp<NavigationParameters>>();

    const [bookTitle, setBookTitle] = useState<string>("");
    const [bookDescrption, setBookDescrption] = useState<string>("");
    const [selectedBookGnere, setSelectedBookGnere] = useState<string>("");
    const [bookCoverImage, setBookCoverImage] = useState(null);
    const [descriptionTextInputHeight, setDescriptionTextInputHeight] = useState<number>(0);

    function buildDataForSelectList(): dataInterest[] {
        let data: dataInterest[] = [];
        let numberOfInterests: number = Globals.INTERESTS_LIST.length;

        for (let i = 0; i < numberOfInterests; i++) {
            data.push(
                {
                    key: i,
                    value: Globals.INTERESTS_LIST[i]
                }
            )
        }
        console.log(data);
        return data;
    }
    
    useEffect(() => {
        setGenresList(buildDataForSelectList());
    }, []);

    useEffect(() => {
        console.log(bookTitle);
    },[bookTitle]);


    async function pickImage() {
        //ask for permission to access library image
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.2,  //means compress for small size
            });
        
            console.log(result);
        
            if (!result.canceled) {
                console.log("picture chosen, name is: " + result.assets[0].uri);
                setBookCoverImage(result.assets[0].uri);
            }
        }
        else {
            Alert.alert("Sorry, we need camera roll permissions to make this work!");
        }
        
    };

    async function handlePostChapter() {
        if (bookTitle !== null && bookCoverImage !== null && bookDescrption !== null && selectedBookGnere !== null) {
            try {
                const result = await Sentry.startSpan({ name: "Adding New Book" }, async () => {
                    let addedBookStatus = await add_new_book(bookTitle, GlobalUserData.LOGGED_IN_USER_DATA.username, bookDescrption, selectedBookGnere);
                    let uploadedCoverStatus = await upload_book_cover(bookTitle, GlobalUserData.LOGGED_IN_USER_DATA.username, bookCoverImage);
    
                    if (addedBookStatus == 0 && uploadedCoverStatus == 0) {
                        Alert.alert("New Book Added Successfully!");
                        navigation.navigate('Home');
                    } else {
                        Alert.alert("New Book Could Not Be Added!");
                    }
                });
            } catch (error) {
                // Handle error if Sentry.startSpan() or any of the async functions inside it throws an error
                console.error("Error:", error);
            }
        } else {
            Alert.alert("All fields are required!");
        }
    }

    return(
        <SafeAreaView style={styles.fullscreen_container}>
            <ScrollView>
            <View style={styles.inputs_container}>
                <View style={styles.book_title_section}>
                    <Text style={styles.info_text}>Title*</Text>
                    <TextInput 
                        style={styles.text_inputs_style}
                        onChangeText={text => setBookTitle(text)}
                        placeholder='Book title'
                        placeholderTextColor={Globals.COLORS.PLACEHOLDER_TEXT_COLOR}
                    ></TextInput>
                </View>

                <View>
                    <Text style={styles.info_text}>Description*</Text>
                    <TextInput 
                        style={[styles.text_inputs_style, {height: Math.max(45, descriptionTextInputHeight), padding:15}]} 
                        multiline={true} 
                        onContentSizeChange={(event) =>
                            setDescriptionTextInputHeight(event.nativeEvent.contentSize.height)
                        }
                        numberOfLines={10}
                        onChangeText={text => setBookDescrption(text)}
                        placeholder='Book description'
                        placeholderTextColor={Globals.COLORS.PLACEHOLDER_TEXT_COLOR}
                        onEndEditing={ () => Keyboard.dismiss()}
                        ></TextInput>
                </View>
            
                <View>
                    <Text style={[styles.info_text, {marginBottom: 10}]}>Book Genre*</Text>
                    <SelectList 
                        setSelected={(val) => setSelectedBookGnere(val)} 
                        data={genresList} 
                        save="value"
                        boxStyles={{
                            backgroundColor: Globals.COLORS.TEXT_INPUTS,    
                        }}
                        dropdownTextStyles={{
                            color: 'white', // Set your desired font color here
                            fontWeight: '200',
                        }}
                        inputStyles={{
                            color: 'white', // Set your desired font color here
                            fontWeight: '200',
                        }}
                        search = {false}
                        arrowicon={
                            <AntDesign name="down" size={17} color="white" />
                        }
                    />
                </View>

                <View>
                    <Text style={styles.info_text}>Book Cover*</Text>
                    <TouchableOpacity activeOpacity={0.6} style={styles.pick_image_button} onPress={pickImage}>
                        {
                            !bookCoverImage && 
                            <Text style={styles.choose_book_cover_text}> Choose a book cover </Text>
                        }
                        {
                            bookCoverImage && 
                            <Image source={{ uri: bookCoverImage }} style={styles.selected_cover_image} />
                        }
                    </TouchableOpacity>  
                   
                </View>   

                <TouchableOpacity 
                    activeOpacity={0.8} 
                    style={styles.post_chapter_button}
                    onPress={() => handlePostChapter()}>
                    <Text style = {styles.post_chapter_text}>
                        + Upload New Book
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.page_footer}>
            
            </View>  
            </ScrollView> 
        </SafeAreaView>
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
    inputs_container: {
        //backgroundColor: 'red',
        flex: 7,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
    },
    page_footer: {
        //backgroundColor: 'blue',
        flex: 3,
        marginBottom: 30,
    },
    text_inputs_style: {
        backgroundColor: Globals.COLORS.TEXT_INPUTS,
        color: 'white',
        fontWeight: '200',
        fontSize: 17,
        borderRadius: 15,
        width: '85%',
        height: 45,
        paddingHorizontal: 5,
        //paddingTop: 4,
    },
    info_text: {
        color: 'white',
        fontSize: 17,
        marginTop: '5%',
        marginLeft: 20,
        fontWeight: '200'
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
        marginTop: 100,
    },
    post_chapter_text: {
        marginTop: 3,
        color: Globals.COLORS.PURPLE,
        fontWeight: 'bold',
        fontSize: 15,
        justifyContent: 'flex-start',
        marginHorizontal: 3,
    },
    pick_image_button: {
        backgroundColor: Globals.COLORS.TEXT_INPUTS,
        height: 130,
        width: 130,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    selected_cover_image: {
        height: 130,
        width: 130,
        borderRadius: 30,
    },
    choose_book_cover_text: {
        color: 'white',
        fontWeight: '200',
        textAlign: 'center',
        opacity: 0.5,
    },
    book_title_section: {
        //backgroundColor: 'red',
    }
})