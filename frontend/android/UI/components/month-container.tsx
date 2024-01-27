import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ImageBackground, TouchableHighlight, ScrollView } from 'react-native';
import Globals from '../_globals/Globals';
import { useNavigation } from '@react-navigation/native';
import { get_readings_planned_for_month} from "../../services/reading-planner-service";
import Book from './book';
import EditableBook from './book-editable';
import { delete_planned_book_for_month } from '../../services/reading-planner-service'

const windowWidth = Dimensions.get('window').width;

interface PlannedBook {
    key: string;
    value: string;
  }

type Props = {
    index: number,
    height: number,
    inEditMode: boolean,
    plannedBookList: any,
    onBookRemovedCallback: (bookID: string, bookTitle: string, bookAuthor: string) => void,
};

export default function MonthContainer( {index, height, inEditMode, plannedBookList, onBookRemovedCallback}: Props) {
    const navigation = useNavigation();
    let [statePlannedBookList, setStatePlannedBookList] = useState([]);

    //fetch image background path based on received index
    //get name from index 
    let currentMonthName = Globals.MONTHS_LIST[index].toLowerCase();
    currentMonthName = currentMonthName[0].toUpperCase() + currentMonthName.substring(1);
    //build firebase storage uri
    const monthImagePath = Globals.MONTHS_BACKGROUND_IMAGES.replace('MONTH', currentMonthName.toLowerCase());
    console.log(monthImagePath);

    let rightButtonText = inEditMode === true ? 'Done' : 'Edit';

    //this executes on page load
    useEffect(() => {
        //console.log('rerender moonth ' + currentMonthName);
        //console.log("am primit", plannedBookList);
    }, []);

    useEffect(() => {
        setStatePlannedBookList(plannedBookList);
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

    function renderBooks() {
        if(plannedBookList.length > 0) {
            return (
                <View style={styles.booksGridContainer}>
                {
                    /*Warning: Each child in a list should have a unique "key" prop.*/
                    statePlannedBookList.map((book, index) => (
                        inEditMode ? (
                            <EditableBook key={index} bookFields={JSON.stringify(book)} bookCoverWidth={110} bookCoverHeight={150} currentMonthName={currentMonthName} onBookRemovedCallback={onBookRemovedCallback}/>
                        ) : (
                            <Book key={index} bookFields={JSON.stringify(book)} bookCoverWidth={110} bookCoverHeight={180} bookWithDetails={true} />
                        )
                    ))
                }
            </View>
            )
        }
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
                
                {renderBooks()}
                
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
    },
    headerMonthContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        paddingHorizontal: 10,
        marginBottom: 0,
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
        flex: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingHorizontal: 10,
        height: 500,
        width: '100%',
    },
})

