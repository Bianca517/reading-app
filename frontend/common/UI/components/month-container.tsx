import React, { ReactNode, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ImageBackground, TouchableHighlight, ScrollView, FlatList } from 'react-native';
import Globals from '../_globals/Globals';
import { useNavigation } from '@react-navigation/native';
import { get_readings_planned_for_month} from "../../services/reading-planner-service";
import Book from './book';
import EditableBook from './book-editable';
import { delete_planned_book_for_month } from '../../services/reading-planner-service'
import { bookDTO } from '../../types';

const windowWidth = Dimensions.get('window').width;

interface PlannedBook {
    key: string;
    value: string;
  }

type Props = {
    index: number,
    height: number,
    inEditMode: boolean,
    plannedBookList: bookDTO[],
    onBookRemovedCallback: (bookID: string, bookTitle: string, bookAuthor: string, numberOfChapters: number) => void,
};

export default function MonthContainer( {index, height, inEditMode, plannedBookList, onBookRemovedCallback}: Props) {
    const navigation = useNavigation();
    let [statePlannedBookList, setStatePlannedBookList] = useState([]);
    let [plannedBookListPages, setPlannedBookListPages] = useState<bookDTO[][]>([]);

    //fetch image background path based on received index
    //get name from index 
    let currentMonthName = Globals.MONTHS_LIST[index].toLowerCase();
    currentMonthName = currentMonthName[0].toUpperCase() + currentMonthName.substring(1);
    //build firebase storage uri
    const monthImagePath = Globals.MONTHS_BACKGROUND_IMAGES.replace('MONTH', currentMonthName.toLowerCase());
    //console.log(monthImagePath);

    let rightButtonText = inEditMode === true ? 'Done' : 'Edit';

    //this executes on page load
    useEffect(() => {
        console.log('rerender moonth ' + currentMonthName);
        console.log("am primit", plannedBookList);
    }, []);

    useEffect(() => {
        setStatePlannedBookList(plannedBookList);
        distributeBooksInPages();
    }, [plannedBookList]);

    function checkNavigationOfRightButton() {
        if(true == inEditMode) {
            navigation.navigate('Reading Tracker' as never);
            //TODO: save configurations here
        }
        else {
            navigation.navigate('Edit Reading Tracker', { 'monthIndex' : index, "plannedBookList" : plannedBookList});
        }
    }

    function distributeBooksInPages() {
        console.log('distributeBooksInPages');
        console.log(plannedBookListPages);
        console.log(plannedBookList);
        let i: number = 0;
        plannedBookListPages = [[]];

        if(plannedBookList) {
            plannedBookList.forEach((book: bookDTO) => {
                if(plannedBookListPages[i] == null) {
                    plannedBookListPages[i] = [];
                }
    
                if(!plannedBookListPages[i].includes(book)){
                    console.log("face push");
                    plannedBookListPages[i].push(book);
                }
                //once there are 4 books in a page, increase i to indicate new page
                if(plannedBookListPages[i].length >= 4) {
                    i++;
                }
            });
            if(plannedBookListPages) {
                setPlannedBookListPages(plannedBookListPages);
            }
            
            console.log(plannedBookListPages);
        }
       
    }

    function emptyPlannedBookList() {
        plannedBookListPages.forEach((books: bookDTO[]) => {
            books = [];
        })
    }

    function renderBooksInPage({ item }: { item: bookDTO[] }) {
        if (item != null && item.length > 0) {
            return (
                <View style={styles.book_page}>
                    {item.map((book: bookDTO, index: number) => (
                        renderBook(book)
                    ))}
                </View>
            );
        }
    }

    function renderBook(book: bookDTO): ReactNode {
        return (
            inEditMode ? (
                <EditableBook key={book.bookID} bookFields={book} bookCoverWidth={110} bookCoverHeight={140} currentMonthName={currentMonthName} onBookRemovedCallback={onBookRemovedCallback}/>
            ) : (
                <Book 
                    key={book.bookID} 
                    bookDTO={book} 
                    bookCoverWidth={110} 
                    bookCoverHeight={180} 
                    bookWithDetails={true}
                    bookNavigationOptions={Globals.BOOK_NAVIGATION_OPTIONS.TO_READING_SCREEN} 
                />
            )
        )    
    }

    return (
        <View style={[styles.monthContainer, { height: height}]}>
            <ImageBackground source={{ uri: monthImagePath }} style={[styles.monthBackground, { height: height}]} imageStyle={{ borderRadius: 20 }}>
                <View style={styles.headerMonthContainer}>

                    <View style={[styles.monthTextContainer]}>
                        <Text style={styles.monthNameAndEditText}> {currentMonthName} </Text>
                    </View>

                    <TouchableHighlight style={[styles.monthTextContainer, { marginLeft: 115, width: 70 }]}
                        underlayColor={Globals.COLORS.PURPLE}
                        onPress={() => {checkNavigationOfRightButton()}
                        }>
                        <Text style={[styles.monthNameAndEditText]}> {rightButtonText} </Text>
                    </TouchableHighlight>

                </View>
                
                <FlatList
                    data={plannedBookListPages}
                    renderItem={renderBooksInPage}
                    horizontal={true}
                    contentContainerStyle = {styles.booksGridContainer}
                />
                
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    monthContainer: {
        width: windowWidth - 40,
        paddingTop: 10,
        paddingHorizontal: 5,
        marginBottom: 25,
        //flex: 1,
        //flexDirection: 'column',
        //justifyContent: 'flex-start',
    },
    headerMonthContainer: {
        //backgroundColor: 'blue',
        //flex: 1,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        paddingHorizontal: 10,
        marginBottom: 0,
        height: 'auto',
    },
    monthTextContainer: {
        borderRadius: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 20,
    },
    monthNameAndEditText: {
        fontWeight: 'bold',
        fontSize: 17
    },
    monthBackground: {
        flex: 1,
        paddingTop: 15,
    },
    booksGridContainer: {
        //backgroundColor: 'red',
        //flex: 9,
        flexDirection: 'row',
        flexWrap: 'wrap',
        //alignItems: 'flex-end',
        //paddingHorizontal: 10,
        //height: 500,
        //width: '100%',
    },
    book_page: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        width: windowWidth - 40, // or any width that makes sense for your layout   
    }
})

