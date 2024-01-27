import React, { useState, useEffect, ReactNode } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions, SafeAreaView, TextInput , ScrollView} from 'react-native';
import Globals from '../../_globals/Globals';
import { useNavigation } from '@react-navigation/native';
import { ResponseType } from '../../../types';

const windowWidth = Dimensions.get('window').width;

export default function WriteABookUI() {
    const navigation = useNavigation();
    return(
        <SafeAreaView style={styles.fullscreen_container}>
            
            <View style={styles.continue_writing_container}>
                
                <View style = {styles.header_info}>
                    <View style={styles.left_line_through}></View>
                    
                    <Text style = {styles.continue_writing_text}>
                        Continue writing
                    </Text>   

                    <View style={styles.right_line_through}></View>   
                </View> 

                <View style={styles.written_books_grid}>
                    <Text> book1</Text>
                    <Text> book2</Text>
                </View>   
                 
            </View>
             

            <View style={styles.page_footer}>
                <TouchableOpacity activeOpacity={0.5} style={styles.write_new_book_button} onPress={() => navigation.navigate("Write New Book") as never}>
                    <Text style = {styles.write_new_book_text}>
                        + Write a New Book
                    </Text>
                </TouchableOpacity>
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
    continue_writing_container: {
        backgroundColor: 'grey',
    },
    header_info: {
        //backgroundColor: 'green',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'flex-start',
    },
    page_footer: {
        //backgroundColor: 'purple',
        paddingLeft: 20,
    },
    written_books_grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start', // Align rows to the start
        alignItems: 'flex-start', // Align items to the start within each row
        columnGap: -3,
        rowGap: 20,
        height: 100, // Set a fixed height for each row
        paddingHorizontal: 7,
    },
    write_new_book_button: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 170,
        alignItems: 'center',
        opacity: 1,
    },
    right_line_through: {
        flex: 4,
        backgroundColor: 'white',
        height: 2,
        marginTop: 13,
        marginLeft: 0,
    },
    left_line_through: {
        flex: 2,
        backgroundColor: 'white',
        height: 2,
        marginTop: 13,
        marginRight: 0
    },
    continue_writing_text: {
        flex: 3,
        marginTop: 3,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        justifyContent: 'flex-start',
        marginHorizontal: 3,
    },
    write_new_book_text: {
        marginTop: 3,
        color: Globals.COLORS.PURPLE,
        fontWeight: 'bold',
        fontSize: 15,
        justifyContent: 'flex-start',
        marginHorizontal: 3,
    }
})