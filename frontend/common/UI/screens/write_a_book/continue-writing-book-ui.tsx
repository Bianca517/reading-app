import React, { useState, useEffect, ReactNode, JSXElementConstructor } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions, SafeAreaView, TextInput , ScrollView, FlatList} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { get_all_chapters_from_book } from '../../../services/write-book-service';
import { NavigationParameters, ResponseType } from '../../../types';
import Globals from '../../_globals/Globals';
import { useIsFocused } from "@react-navigation/native";
import Checkbox from 'expo-checkbox';

const windowWidth = Dimensions.get('window').width;

export default function ContinueWritingBookUI( {route} ) {
    const isFocused = useIsFocused();
    const bookID: string = route.params.bookID;
    const [bookChapters, setBookChapters] = useState([]);
    const [bookHasChapters, setBookHasChapters] = useState(true);
    const navigation = useNavigation<NavigationProp<NavigationParameters>>();
    const [isBookMarkedAsFinished, setIsBookMarkedAsFinished] = useState(false);

    const [numberOfChapters, setNumberOfChapters] = useState(0); //used only for passing to writing screen

    //so when user clicks 'back' from writing screen, if he added a new chapter, it will be added here to the list
    useEffect(() => {
        if (isFocused) {
            console.log(bookID);
            loadAllBookChapters();
        }
      }, [isFocused]);


    async function loadAllBookChapters() {
        let fetchedResponse: ResponseType = await get_all_chapters_from_book(bookID).then();

        if(fetchedResponse.success) {
            const responseData: string[] = JSON.parse(fetchedResponse.message);
            setBookChapters(JSON.parse(fetchedResponse.message));

            setNumberOfChapters(responseData.length);
            if(responseData.length > 0) {
                setBookHasChapters(true);
            }
            else {
                setBookHasChapters(false);
            }
        } else {
            setBookHasChapters(false);
        }
    }

    const renderItem = ({ item }: { item: string }) => {
        return (
            <TouchableOpacity style={styles.chapter_container} 
                    onPress={() => navigation.navigate("Reading Screen", 
                        { 
                            "id" : bookID, 
                            "chapterNumber" : bookChapters.indexOf(item), 
                            "bookCoverImage" : "", 
                            "name": "", 
                            "authorUsername": ""
                        })}>
                    <Text style={[styles.chapter_number]}> Chapter {bookChapters.indexOf(item) + 1} - </Text>
                    <Text style={styles.chapter_titles}>{item}</Text>
            </TouchableOpacity>
        );
    }

    function renderWhenEmpty() {
        if(!bookHasChapters) {
            return (
                <Text style={[styles.title_text, {textAlign: 'center', marginTop: 30}]}> This book has no chapters yet :( </Text>
            )
        }
        else {
            return null;
        }
    }

    function footerComponent() {
        //if book if already marked as finished, dont show the button to add new chapter
        //instead, show just the checkbox, which is checked

        return (
            <View style={styles.button_and_checkbox_view}>
                <View style={styles.checkbox_view}>
                    <Checkbox
                        style={styles.checkbox}
                        value={isBookMarkedAsFinished}
                        onValueChange={setIsBookMarkedAsFinished}
                        color={isBookMarkedAsFinished ? Globals.COLORS.PURPLE : undefined}
                    />
                    <Text style={[styles.title_text, {fontSize: 16, alignSelf: 'center', marginTop: -1}]}> Mark book as finished </Text>
                </View>
                <TouchableOpacity 
                    activeOpacity={0.7} 
                    style={styles.write_new_chapter_button}
                    onPress={() => navigation.navigate("Write New Chapter", {bookID: bookID, numberOfChapters: numberOfChapters})}
                >
                        <Text style = {styles.write_new_chapter_text}>
                            + Add New Chapter
                        </Text>
                </TouchableOpacity>
            </View>
        )
    }

    return(
        <SafeAreaView style={styles.fullscreen_container}>
           <View style={styles.header}>
                <View style={styles.left_line_through}></View>
                <Text style={styles.title_text}> Table of Contents </Text>
                <View style={styles.right_line_through}></View>  
           </View>
           
           <View style={styles.chapters_container}>

                <FlatList
                    data={bookChapters}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    numColumns={1} 
                    initialNumToRender={10}
                    ListEmptyComponent={() => renderWhenEmpty()}
                    ListFooterComponent={footerComponent()}
                />
           
           </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    fullscreen_container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Globals.COLORS.BACKGROUND_GRAY,
        paddingTop: 10,
        paddingHorizontal: 10,
    },
    header: {
        flex: 0.5,
        //backgroundColor: "purple",
        flexDirection: 'row',
    },
    chapters_container: {
        flex: 8,
        //backgroundColor: "green",
        paddingHorizontal: 10
    },
    footer: {
        flex: 1,
        //backgroundColor: "blue"
    },
    title_text: {
        flex: 5,
        marginTop: 3,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        marginHorizontal: 1,
    },
    right_line_through: {
        flex: 4,
        backgroundColor: 'white',
        height: 2,
        marginTop: 13,
        marginLeft: -50,
    },
    left_line_through: {
        flex: 2,
        backgroundColor: 'white',
        height: 2,
        marginTop: 13,
        marginRight: 0,
    },
    chapter_container: {
        //backgroundColor: 'red',
        height: 45,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        marginBottom: 10,
        flexDirection: 'row',   
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    write_new_chapter_button: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 170,
        alignItems: 'center',
        opacity: 1,
        marginTop: 30,
        marginBottom: 20,
    },
    write_new_chapter_text: {
        marginTop: 3,
        color: Globals.COLORS.PURPLE,
        fontWeight: 'bold',
        fontSize: 15,
        justifyContent: 'flex-start',
        marginHorizontal: 3,
    },
    chapter_titles: {
        marginTop: 3,
        color: 'white',
        fontWeight: '300',
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 1,
        letterSpacing: 0.8,
        fontStyle: 'italic'
    },
    chapter_number: {
        marginTop: 3,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        marginHorizontal: 1,
        width: 100,
        textAlign: 'center',
    },
    checkbox: {
        margin: 8,
    },
    button_and_checkbox_view: {
        flexDirection: 'column',
        marginTop: 20,
    },
    checkbox_view: {
        flexDirection: 'row',
        alignItems: 'center',
        //backgroundColor: 'red',
    },
    checkbox_text: {
        color: 'white',
        fontSize: 17,
        fontWeight: "300",
    }
})