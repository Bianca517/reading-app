import React, { useState, useEffect, ReactNode } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions, SafeAreaView, TextInput , ScrollView, FlatList, ActivityIndicator} from 'react-native';
import Globals from '../../_globals/Globals';
import { useNavigation } from '@react-navigation/native';
import { ResponseType, bookDTO } from '../../../types';
import Book from '../../components/book';
import { get_users_written_books } from '../../../services/write-book-service';
import GlobalUserData from '../../_globals/GlobalUserData';

const windowWidth = Dimensions.get('window').width;


export default function WriteABookUI() {
    const navigation = useNavigation();
    const [userHasWrittenBooks, setUserHasWrittenBooks] = useState(true); //start with this on TRUE so it does not display the sorry message before the fetch from DB is done
    const [booksWrittenByUser, setBooksWrittenByUser] = useState<bookDTO[]>([]);
    const [booksAreLoaded, setBooksAreLoaded] = useState<boolean>(false);
    
    //this loads at start of page
    useEffect(() => {
        loadBooksWrittenByUser();
    }, []);

    async function loadBooksWrittenByUser() {
        let fetchedResponse: bookDTO[] = await get_users_written_books(GlobalUserData.LOGGED_IN_USER_DATA.uid).then();
        console.log("books by user:");
        console.log(fetchedResponse);
        if(fetchedResponse) {
            setBooksWrittenByUser(fetchedResponse);
            setBooksAreLoaded(true);

            if(fetchedResponse.length > 0) {
                setUserHasWrittenBooks(true);
            }
            else {
                setUserHasWrittenBooks(false);
            }
        }
    }

    const renderItem = ({ item }: { item: bookDTO }) => {
        return (
            <Book 
                key={item.bookID} 
                bookDTO={item} 
                bookCoverWidth={90} 
                bookCoverHeight={160} 
                bookWithDetails={true} 
                bookNavigationOptions={Globals.BOOK_NAVIGATION_OPTIONS.TO_CONTINUE_WRITING}
            />
        );
    }

    function renderWhenEmpty() {
        if(!booksAreLoaded) {
            return (
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color={Globals.COLORS.PURPLE}/>
                </View> 
            )
        }
        else if(booksAreLoaded && !userHasWrittenBooks) {
            return (
                <Text style={[styles.continue_writing_text, {textAlign: 'center', marginTop: 30}]}> 
                    We are sorry. You currently don't have any written books :( 
                </Text>       
            )
        }
    }

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
                    {
   
                        <FlatList
                            data={booksWrittenByUser}
                            renderItem={renderItem}
                            keyExtractor={item => item.bookID}
                            numColumns={3} 
                            initialNumToRender={12}
                            ListEmptyComponent={() => renderWhenEmpty()}
                            contentContainerStyle={styles.flatlist_content_container}
                        />
                        
                    }  
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
        //backgroundColor: 'grey',
        flex: 9,
    },
    header_info: {
        //backgroundColor: 'green',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'flex-start',
    },
    page_footer: {
        flex: 1,
        //backgroundColor: 'purple',
        marginTop: 20,
        paddingLeft: 20,
    },
    written_books_grid: {
        //backgroundColor: 'yellow',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start', // Align rows to the start
        alignItems: 'flex-start', // Align items to the start within each row
        columnGap: 0,
        rowGap: 10,
        paddingHorizontal: 7,
        marginBottom: 30,
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
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 20
      },
      horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
      },
      flatlist_content_container: {
        paddingBottom: 10,
      }
})