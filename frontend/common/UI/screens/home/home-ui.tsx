import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Footer from '../../components/footer';
import Book from '../../components/book';
import { get_finalized_readings, get_current_readings, get_popular_readings, get_recommended_readings } from '../../../services/retrieve-books-service';
import Globals from '../../_globals/Globals';
import { useNavigation } from '@react-navigation/native';
import GlobalBookData from '../../_globals/GlobalBookData';
import { ResponseType, ResponseTypeRetrieveBooks, bookDTO } from '../../../types';
import { loadCurrentPlannedBooks, loadUserCurrentPositions, loadFinalizedReadingBooks, loadCurrentReadingBooks } from '../../components/service-calls-wrapper';
import GlobalUserData from '../../_globals/GlobalUserData';

export default function HomePageUI() {
    const navigation = useNavigation();

    const [popularBooks, setPopularBooks] = useState<bookDTO[]>([]);
    const [currentReadingBooks, setCurrentReadingBooks] = useState<bookDTO[]>([]);
    const [recommendedBooks, setRecommendedBooks] = useState<bookDTO[]>([]);

    //this executes on page load
    useEffect(() => {
        navigation.setOptions({
            headerBackVisible: false
        });
        
        loadRecommendedReadingBooks();
        loadPopularBooks();
        loadCurrentReadingBooks().then((books: bookDTO[]) => {
            console.log("sicciiiiiiiiii");
            console.log(books);
            if(books!=null) {
                setCurrentReadingBooks(books);
            }
        });
        
        loadFinalizedReadingBooks();
        //load this for the reading planner here as it takes a long time and it shall be prepared until user gets there
        loadCurrentPlannedBooks();
        loadUserCurrentPositions();
    }, []);

    async function loadPopularBooks() {
        get_popular_readings().then((fetchResponse: bookDTO[]) => {
            if (fetchResponse != null && fetchResponse.length > 0) {
                setPopularBooks(fetchResponse);
            }
        });
    }

    async function loadRecommendedReadingBooks() {
        get_recommended_readings(GlobalUserData.LOGGED_IN_USER_DATA.uid).then((fetchResponse: bookDTO[]) => {
            if (fetchResponse != null && fetchResponse.length > 0) {
                console.log("recommended");
                //console.log(fetchResponse);
                setRecommendedBooks(fetchResponse);
            }
        });
    }


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
                                    Continue reading
                                </Text>
                            </View>

                            <View style={[styles.right_line_through, { marginLeft: -30 }]}></View>
                        </View>

                        <View style={[styles.books_container, { backgroundColor: '#81179b' }]}>
                        <ScrollView horizontal={true}>
                                {
                                    currentReadingBooks && (currentReadingBooks.length > 0) ?
                                    (
                                        /*Warning: Each child in a list should have a unique "key" prop.*/
                                        currentReadingBooks.map((book, index) => (
                                            <Book key={index} bookDTO={book} bookCoverWidth={110} bookCoverHeight={175} bookWithDetails={false} bookNavigationOptions={Globals.BOOK_NAVIGATION_OPTIONS.TO_READING_SCREEN}/>
                                        ))
                                    ) : 
                                    (
                                        <Text style={[styles.section_text, {alignSelf: 'center'}]}>
                                            Your library is currently empty :( 
                                        </Text>
                                    )
                                }
                            </ScrollView>
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
                                    recommendedBooks && 
                                    /*Warning: Each child in a list should have a unique "key" prop.*/
                                    recommendedBooks.map((book, index) => (
                                        <Book key={index} bookDTO={book} bookCoverWidth={110} bookCoverHeight={175} bookWithDetails={false} bookNavigationOptions={Globals.BOOK_NAVIGATION_OPTIONS.ADDITIONAL_CHECK}/>
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
                                    popularBooks &&
                                    /*Warning: Each child in a list should have a unique "key" prop.*/
                                    popularBooks.map((book, index) => (
                                        <Book key={index} bookDTO={book} bookCoverWidth={110} bookCoverHeight={175} bookWithDetails={false} bookNavigationOptions={Globals.BOOK_NAVIGATION_OPTIONS.ADDITIONAL_CHECK}/>
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

