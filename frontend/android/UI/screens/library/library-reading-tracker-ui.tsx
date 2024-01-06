import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, SafeAreaView, Dimensions } from 'react-native';
import Globals from '../../_globals/Globals';
import Footer from '../../components/footer';
import LibraryPageNavigator from '../../components/library-navigator';
import MonthContainer from '../../components/month-container';
import { get_readings_planned_for_month } from "../../../services/reading-planner-service";
import { useIsFocused } from "@react-navigation/native";

const windowWidth = Dimensions.get('window').width;

interface yearlyBooksPlanned {
    key: string;
    value: string;
}

export default function LibraryPageReadingTrackerUI() {
    const [booksAreLoaded, setBooksAreLoaded] = useState<boolean>(false);
    const isFocused = useIsFocused();

    let [januaryPlannedBooks, setJanuaryPlannedBooks] = useState<yearlyBooksPlanned[]>([]);
    let [februaryPlannedBooks, setFebruaryPlannedBooks] = useState<yearlyBooksPlanned[]>([]);
    let [marchPlannedBooks, setMarchPlannedBooks] = useState<yearlyBooksPlanned[]>([]);
    let [aprilPlannedBooks, setAprilPlannedBooks] = useState<yearlyBooksPlanned[]>([]);
    let [mayPlannedBooks, setMayPlannedBooks] = useState<yearlyBooksPlanned[]>([]);
    let [junePlannedBooks, setJunePlannedBooks] = useState<yearlyBooksPlanned[]>([]);
    let [julyPlannedBooks, setJulyPlannedBooks] = useState<yearlyBooksPlanned[]>([]);
    let [augustPlannedBooks, setAugustPlannedBooks] = useState<yearlyBooksPlanned[]>([]);
    let [septemberPlannedBooks, setSeptemberPlannedBooks] = useState<yearlyBooksPlanned[]>([]);
    let [octoberPlannedBooks, setOctoberPlannedBooks] = useState<yearlyBooksPlanned[]>([]);
    let [novemberPlannedBooks, setNovemberPlannedBooks] = useState<yearlyBooksPlanned[]>([]);
    let [decemberPlannedBooks, setDecemberPlannedBooks] = useState<yearlyBooksPlanned[]>([]);

    const yearlyBooks = [
        januaryPlannedBooks,
        februaryPlannedBooks,
        marchPlannedBooks,
        aprilPlannedBooks,
        mayPlannedBooks,
        junePlannedBooks,
        julyPlannedBooks,
        augustPlannedBooks,
        septemberPlannedBooks,
        octoberPlannedBooks,
        novemberPlannedBooks,
        decemberPlannedBooks,
    ];
    
    function setMonthPlannedBooks(monthIndex: number, plannedBooks: any): void {
        switch(monthIndex) {
            case 0:
                setJanuaryPlannedBooks(plannedBooks);
                break;
            case 1:
                setFebruaryPlannedBooks(plannedBooks);
                break;
            case 2:
                setMarchPlannedBooks(plannedBooks);
                break;
            case 3:
                setAprilPlannedBooks(plannedBooks);
                break;
            case 4:
                setMayPlannedBooks(plannedBooks);
                break;
            case 5:
                setJunePlannedBooks(plannedBooks);
                break;
            case 6:
                setJulyPlannedBooks(plannedBooks);
                break;
            case 7:
                setAugustPlannedBooks(plannedBooks);
                break;
            case 8:
                setSeptemberPlannedBooks(plannedBooks);
                break;
            case 9:
                setOctoberPlannedBooks(plannedBooks);
                break;
            case 10:
                setNovemberPlannedBooks(plannedBooks);
                break;
            case 11:
                setDecemberPlannedBooks(plannedBooks);
                break;
        }
    }

    function onBookRemovedCallback(bookid: string, booktitle: string, bookauthor: string) {
        //dummy function needed for month container
    }

    function renderMonths() {
        if(booksAreLoaded) {
            return (
                Globals.MONTHS_LIST.map((month, index) => (
                    <MonthContainer 
                        index={index} 
                        height={Globals.MONTH_CONTAINER_HEIGHT_IN_MAIN_READING_TRACKER}
                        inEditMode={false}
                        plannedBookList={yearlyBooks[index]}
                        onBookRemovedCallback={onBookRemovedCallback}>
                    </MonthContainer>
                ))
            )
        }
    }

    async function loadCurrentPlannedBooks() {
        const promises = Globals.MONTHS_LIST.map(async (month, index) => {
            let fetchResponse = await get_readings_planned_for_month(month).then();
            if (fetchResponse.success) {
                const booksForMonth = JSON.parse(fetchResponse.responseData);
                setMonthPlannedBooks(index, booksForMonth);
            }
        });

        Promise.all(promises).then(() => setBooksAreLoaded(true));
    }

    //this executes on page load
    useEffect(() => {
        if (isFocused) {
         loadCurrentPlannedBooks(); 
        }
    }, [isFocused]);

    return (
        <SafeAreaView style={styles.fullscreen_view}>

            <View style={styles.navigation_view}>
                <LibraryPageNavigator librarySection={Globals.LIBRARY_SECTIONS['READING_TRACKER']} />
            </View>

            <View style={styles.whiteLine}></View>

            <View style={styles.monthsListContainer}>
                <ScrollView>
                    {
                        renderMonths()
                    }
                </ScrollView>

            </View>
            <Footer />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    fullscreen_view: {
        backgroundColor: Globals.COLORS.BACKGROUND_GRAY,
        flex: 1,
        flexDirection: 'column',
    },
    navigation_view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    whiteLine: {
        backgroundColor: 'white',
        width: '90%',
        height: 1,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    monthsListContainer: {
        flex: 6,
        flexDirection: 'row',
        paddingHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

