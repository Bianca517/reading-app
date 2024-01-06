import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Footer from '../../components/footer';
import Book from '../../components/book';
import { get_finalized_readings, get_current_readings } from '../../../services/retrieve-books-service';
import Globals from '../../_globals/Globals';
import { useNavigation } from '@react-navigation/native';
import GlobalBookData from '../../_globals/GlobalBookData';
import { ResponseType } from '../../../types';
import { loadCurrentPlannedBooks } from '../../components/service-calls-wrapper';

export default function HomePageUI() {
    const navigation = useNavigation();

    const [popularBooks, setPopularBooks] = useState([]);
    const [currentReadingBooks, setCurrentReadingBooks] = useState([]);

    async function loadPopularBooks() {
        const fetchResponse: ResponseType = await get_finalized_readings().then();

        if (fetchResponse.success) {
            setPopularBooks(JSON.parse(fetchResponse.message));
            GlobalBookData.FINALIZED_READINGS = JSON.parse(fetchResponse.message);
        }
    }

    async function loadCurrentReadingBooks() {
        const fetchResponse: ResponseType = await get_current_readings().then();

        if (fetchResponse.success) {
            setCurrentReadingBooks(JSON.parse(fetchResponse.message));
            //console.log(JSON.parse(fetchResponse.message));
            GlobalBookData.CURRENT_READINGS = JSON.parse(fetchResponse.message);
        }
    }

    //this executes on page load
    useEffect(() => {
        navigation.setOptions({
            headerBackVisible: false
        });
    
        loadPopularBooks();
        loadCurrentReadingBooks();
        //load this for the reading planner here as it takes a long time and it shall be prepared until user gets there
        loadCurrentPlannedBooks();
    }, []);

    return (
        <LinearGradient
            // Background Linear Gradient
            colors={['#2d2d2d', '#4b3c51', '#9762aa', '#d58df0']}
            style={styles.fullscreen_container}
        >
            <SafeAreaView style={styles.fullscreen_container}>

                <View style={styles.body_view_container}>
                    <View style={styles.body_last_readings_container}>
                        <View style={styles.section_title_container}>
                            <View style={styles.left_line_through}></View>

                            <View style={styles.section_text}>
                                <Text style={styles.section_text}>
                                    Your last readings
                                </Text>
                            </View>

                            <View style={[styles.right_line_through, { marginLeft: -20 }]}></View>
                        </View>

                        <View style={[styles.books_container, { backgroundColor: '#81179b' }]}>

                        </View>
                    </View>

                    <View style={styles.body_for_you_container}>
                        <View style={styles.section_title_container}>
                            <View style={styles.left_line_through}></View>

                            <View style={styles.section_text}>
                                <Text style={styles.section_text}>
                                    For you
                                </Text>
                            </View>

                            <View style={[styles.right_line_through, { marginLeft: -140 }]}></View>
                        </View>

                        <View style={[styles.books_container, { backgroundColor: Globals.COLORS.FOR_YOU_SECTION }]}>
                            <ScrollView horizontal={true}>
                                {
                                    /*Warning: Each child in a list should have a unique "key" prop.*/
                                    currentReadingBooks.map((book, index) => (
                                        <Book key={index} bookFields={JSON.stringify(book)} bookCoverWidth={110} bookCoverHeight={175} bookWithDetails={false}/>
                                    ))
                                }
                            </ScrollView>
                        </View>
                    </View>

                    <View style={styles.body_popular_container}>
                        <View style={styles.section_title_container}>
                            <View style={styles.left_line_through}></View>

                            <View style={styles.section_text}>
                                <Text style={styles.section_text}>
                                    Popular right now
                                </Text>
                            </View>

                            <View style={[styles.right_line_through, { marginLeft: -20 }]}></View>
                        </View>

                        <View style={[styles.books_container, { backgroundColor: '#b9bff3' }]}>
                            <ScrollView horizontal={true}>
                                {
                                    /*Warning: Each child in a list should have a unique "key" prop.*/
                                    popularBooks.map((book, index) => (
                                        <Book key={index} bookFields={JSON.stringify(book)} bookCoverWidth={110} bookCoverHeight={175} />
                                    ))
                                }
                            </ScrollView>
                        </View>
                    </View>
                </View>

                <Footer />
            </SafeAreaView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    debug_text: {
        color: "black",
    },
    fullscreen_container: {
        flex: 1,
        flexDirection: 'column',
        //backgroundColor: 'purple',
    },
    header_view_container: {
        flex: 1,
        paddingHorizontal: 15
        //backgroundColor: 'pink'
    },
    body_view_container: {
        flex: 11,
        //backgroundColor: 'blue',
        flexDirection: 'column',
        padding: 15
    },
    footer_view_container: {
        flex: 1,
        //backgroundColor: 'yellow'
    },
    body_last_readings_container: {
        flex: 1,
        //backgroundColor: 'magenta',
        flexDirection: 'column',
        paddingHorizontal: 7,
    },
    body_for_you_container: {
        flex: 1,
        //backgroundColor: 'aquamarine',
        flexDirection: 'column',
        paddingHorizontal: 7,
    },
    body_popular_container: {
        flex: 1,
        //backgroundColor: 'brown',
        flexDirection: 'column',
        paddingHorizontal: 7,
    },
    section_title_container: {
        flex: 1,
        //backgroundColor: 'black',
        flexDirection: 'row',
    },
    right_line_through: {
        flex: 3,
        backgroundColor: 'white',
        height: 2,
        marginTop: 15,
        marginLeft: 0
    },
    left_line_through: {
        flex: 1,
        backgroundColor: 'white',
        height: 2,
        marginTop: 15,
        marginRight: 0
    },
    section_text: {
        flex: 3,
        marginTop: 3,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        justifyContent: 'flex-start',
    },
    books_container: {
        flex: 7,
        //backgroundColor: 'green',
        borderRadius: 15,
        paddingHorizontal: 15
    },

})

