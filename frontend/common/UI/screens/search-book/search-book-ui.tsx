import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions, SafeAreaView, TextInput , ScrollView, Alert, FlatList} from 'react-native';
import Globals from '../../_globals/Globals';
import { useNavigation } from '@react-navigation/native';
import { ResponseType } from '../../../types';
import { Ionicons } from '@expo/vector-icons';
import InterestContainer from '../../components/interest-container';

export default function SearchBookUI() {
    const navigation = useNavigation();
    const [searchedBook, setSearchedBook] = useState<string>("");
    
    function onChosenGenre(genreName: string) {
        navigation.navigate("Results", {'searchCriteriaIsGenre': true ,'searchedBook': genreName});
    }

    function onRemovedGenre(genreName: string) {

    }

    useEffect(() => {
        console.log("Searched book", searchedBook);
    }, [searchedBook]);


    function handleGoToResults() {
        //console.log("navi", searchedBook);
        if(searchedBook.trimStart().length > 0) {
            navigation.navigate("Results", {'searchCriteriaIsGenre': false ,'searchedBook': searchedBook});
        }
        else {
            Alert.alert("The input text is invalid! Please try again.");
        }
    }

    const renderItem = ({ item }: { item: string }) => {
        return (
            <InterestContainer 
                genreName={item} 
                onChosenInterest={onChosenGenre} 
                onRemovedInterest={onRemovedGenre} 
                interestWithCheckbox={false}
            />
        );
    }

    return(
        <SafeAreaView style={styles.fullscreen_container}>
            <View style={styles.search_by_name_container}>
                <TextInput
                    style={styles.text_inputs_style}
                    onChangeText={text => setSearchedBook(text)}
                    placeholder='Search for a book'
                    placeholderTextColor={Globals.COLORS.PLACEHOLDER_TEXT_COLOR}
                >
                </TextInput>

                <TouchableOpacity 
                    style={styles.search_button} 
                    onPress={() => {handleGoToResults()}}
                >
                <Ionicons name="search-circle-sharp" size={40} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.search_by_genre_info_container}>
                <View style={styles.left_line_through}></View>
                        
                <Text style = {styles.browse_genre_text}>
                    Browse by genre
                </Text>   

                <View style={styles.right_line_through}></View>   
            </View>

            <View style={styles.genres_container}>

                <FlatList
                    data={Globals.INTERESTS_LIST}
                    renderItem={renderItem}
                    keyExtractor={item => item}
                    numColumns={2} 
                    initialNumToRender={12}
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
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    search_by_name_container: {
        flex: 1.5,
        //backgroundColor: 'purple',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    search_by_genre_info_container: {
        flex: 0.5,
        //backgroundColor: 'pink',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    genres_container:{
        flex: 8,
        //backgroundColor: 'yellow',
        paddingTop: 2,
        paddingLeft: 15
    },
    right_line_through: {
        flex: 4,
        backgroundColor: 'white',
        height: 2,
        marginTop: 5,
        marginLeft: 0,
    },
    left_line_through: {
        flex: 2,
        backgroundColor: 'white',
        height: 2,
        marginTop: 5,
        marginRight: 0
    },
    browse_genre_text: {
        flex: 3,
        marginTop: 3,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        justifyContent: 'flex-start',
        marginHorizontal: 3,
    },
    text_inputs_style: {
        backgroundColor: Globals.COLORS.TEXT_INPUTS,
        color: 'white',
        fontWeight: '200',
        fontSize: 17,
        borderRadius: 15,
        width: '60%',
        height: 45,
        paddingHorizontal: 5,
    },
    search_button: {
        height: 40,
        width: 40,
        //backgroundColor: 'green'
    },
    genres_scrollview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'center',
    }
})