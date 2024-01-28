import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions, SafeAreaView, TextInput , ScrollView} from 'react-native';
import Globals from '../../_globals/Globals';
import { useNavigation } from '@react-navigation/native';
import { ResponseType } from '../../../types';
import { Ionicons } from '@expo/vector-icons';
import InterestContainer from '../../components/interest-container';


export default function SearchResultsUI({route}) {
    const navigation = useNavigation();
    const searchedBook = route.params.searchedBook;

    useEffect(() => {
        console.log("Searched book", searchedBook);
    }, []);
    
    return(
        <SafeAreaView style={styles.fullscreen_container}>

            <View style={styles.header_container}>
                        
                <Text style = {styles.display_results_text}>
                    Results for books with name
                </Text>   
                <Text style = {[styles.display_results_text, {fontStyle: 'italic'}]}>
                    {searchedBook}
                </Text>   

                <View style={styles.right_line_through}></View>   
            </View>

            <View style={styles.display_books_grid}>
                <ScrollView contentContainerStyle={styles.display_books_scroll}>
                    <Text> display results here</Text>
                </ScrollView>
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
    header_container: {
        flex: 1,
        //backgroundColor: 'pink',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    display_books_grid:{
        flex: 9,
        backgroundColor: 'lightcyan',
        paddingTop: 2,
    },
    right_line_through: {
        backgroundColor: 'white',
        height: 2,
        width: '90%',
        marginTop: 0,
        marginLeft: 0,
    },
    display_results_text: {
        flex: 3,
        marginTop: 3,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        justifyContent: 'flex-start',
        marginHorizontal: 3,
    },
    display_books_scroll: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'center',
    }
})