import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  SafeAreaView,
  Dimensions,
  FlatList,
} from "react-native";
import Globals from "../../_globals/Globals";
import BookDraggable from "../../components/book-draggable";
import Footer from "../../components/footer";
import LibraryPageNavigator from "../../components/library-navigator";
import MonthContainer from "../../components/month-container";
import { get_current_readings } from "../../../services/retrieve-books-service";
import { plan_book_for_month, get_readings_planned_for_month } from "../../../services/reading-planner-service";
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";
import GlobalBookData from "../../_globals/GlobalBookData";
import GlobalUserData from "../../_globals/GlobalUserData";
import { loadCurrentReadingBooks, loadPlannedBooksForAMonth } from "../../components/service-calls-wrapper";
import { bookDTO } from "../../../types";

import * as Sentry from "@sentry/react-native";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

interface Book {
  authorUsername: string;
  id: string;
  name: string;
}

export default function LibraryPageReadingTrackerEdit({ route: routeProps }) {
  const isFocused = useIsFocused();
  const currentMonthIndex = routeProps.params["monthIndex"];
  const [currentReadingBooks, setCurrentReadingBooks] = useState<bookDTO[]>([]);
  const [currentReadingFilteredBooks, setCurrentReadingFilteredBooks] = useState<bookDTO[]>([]);
  const [plannedBookList, setPlannedBookList] = useState<bookDTO[]>(routeProps.params["plannedBookList"]);

  //get month name as string because it is needed for the backend GET request
  let currentMonthName: string = Globals.MONTHS_LIST[currentMonthIndex].toLowerCase();
  currentMonthName = currentMonthName[0].toUpperCase() + currentMonthName.substring(1);

  //this executes on page load
  useEffect(() => {
    if (isFocused) {

      //get current readings
      if(GlobalBookData.CURRENT_READINGS == null || GlobalBookData.CURRENT_READINGS.length == 0) {
        loadCurrentReadingBooks().then((books: bookDTO[]) => {
          setCurrentReadingBooks(books);
          filterCurrentReadingBooks(GlobalBookData.CURRENT_READINGS);
        });
      }
      else {
        filterCurrentReadingBooks(GlobalBookData.CURRENT_READINGS);
      }

      if(GlobalBookData.MONTH_PLANNED_BOOKS[currentMonthName].length != null || GlobalBookData.MONTH_PLANNED_BOOKS[currentMonthName].length > 0) {
        loadPlannedBooksForAMonth(currentMonthName).then((books: bookDTO[]) => {
            setPlannedBookList(books);
        });
      }
      else {
        setPlannedBookList(GlobalBookData.MONTH_PLANNED_BOOKS[currentMonthName]);
      }
      
    }
  }, [isFocused]);




  function filterCurrentReadingBooks(currentBooks: bookDTO[]) {
    // get IDs from the planned books
    const plannedBookIDs: Set<string> = new Set(plannedBookList.map((book: bookDTO) => book.bookID));
    // filter books in current readings that dont have the id in planned books
    const result: bookDTO[] = currentBooks.filter((book: bookDTO) => !plannedBookIDs.has(book.bookID));
    console.log("result"); 
    console.log(result);
    if(result && result.length > 0) {
      console.log("bug1", result);
      setCurrentReadingFilteredBooks(result);
    }
    //console.log("filtered current readings: ", currentReadingFilteredBooks);
  }

  function createBook (bookId: string, bookTitle: string, bookAuthor: string, numberOfChapters: number): bookDTO {
    let book: bookDTO = {
      bookID : bookId,
      bookTitle : bookTitle,
      authorUsername : bookAuthor,
      numberOfChapters : numberOfChapters,
    };

    return book;
  };

  async function onAddedBook(bookId: string, bookTitle: string, bookAuthor: string, numberOfChapters: number) {
    console.log("book was dropped");

    const result = await Sentry.startSpan(
      { name: "Plan book for month" },
      async () => {
        return (
            //if book was dropped => add it as planned for the current month
            plan_book_for_month(GlobalUserData.LOGGED_IN_USER_DATA.uid, currentMonthName, bookId)
            .then((success: Boolean) => {
              console.log(success);
              if(success) {
                console.log("adaug peste tot cartea");
                const addedBook: bookDTO = createBook(bookId, bookTitle, bookAuthor, numberOfChapters);

                GlobalBookData.MONTH_PLANNED_BOOKS[currentMonthName].push(addedBook);
                // console.log("teoretic added");
                // console.log(plannedBookList);

                if(plannedBookList === undefined) {
                  const aux: bookDTO[] = [addedBook];
                  setPlannedBookList(aux);
                }
                else {
                  setPlannedBookList((plannedBookList: bookDTO[]) => [...plannedBookList, addedBook]);
                }
                
                setCurrentReadingFilteredBooks((prevBooks: bookDTO[]) =>
                  prevBooks.filter((book: bookDTO) => book.bookID !== bookId)
                );
              }
            })
            .catch(() => {
              
              })
        )},
    );
  }

  function onBookRemovedCallback(bookId: string, bookTitle: string, bookAuthor: string, numberOfChapters: number) {
    const removedPlannedBook: bookDTO = createBook(bookId, bookTitle, bookAuthor, numberOfChapters);

    //if book was dropped => remove it from planned for the current month
    GlobalBookData.MONTH_PLANNED_BOOKS[currentMonthName] = GlobalBookData.MONTH_PLANNED_BOOKS[currentMonthName].filter((book: bookDTO) => book.bookID != bookId);

    console.log("book was removed ", removedPlannedBook);
    console.log("book was removed ", currentMonthName);
    console.log("book was removed ", GlobalBookData.MONTH_PLANNED_BOOKS[currentMonthName]);
    console.log(GlobalBookData.MONTH_PLANNED_BOOKS);

    setPlannedBookList(plannedBookList.filter((book: bookDTO) => book.bookID != bookId));
    //console.log("filtered current readings: ", [...currentReadingFilteredBooks, removedPlannedBook]);
    setCurrentReadingFilteredBooks([...currentReadingFilteredBooks, removedPlannedBook]);
    
  }

  const renderItem = ({ item }: { item: bookDTO }) => {
    return (
      <BookDraggable
        bookFields={item}
        bookCoverWidth={90}
        bookCoverHeight={140}
        bookAddedCallback={onAddedBook}
      />
    );
  };

  return (
    <SafeAreaView style={styles.fullscreen_view}>
      <View style={styles.navigation_view}>
        <LibraryPageNavigator
          librarySection={Globals.LIBRARY_SECTIONS["READING_TRACKER"]}
        />
      </View>

      <View style={styles.whiteLine}></View>

      <GestureHandlerRootView style={styles.bodyContentContainer}>
        <View style={styles.bodyContentContainer}>

          <LinearGradient
            colors={["#626261", "#494948", "#3a3a39"]}
            style={styles.currentReadingsContainer}
          >

              <MonthContainer
                index={currentMonthIndex}
                height={Globals.MONTH_CONTAINER_HEIGHT_IN_EDIT_READING_TRACKER}
                inEditMode={true}
                plannedBookList={plannedBookList}
                onBookRemovedCallback={onBookRemovedCallback}
              ></MonthContainer>

              <View style={styles.yourLibraryInfo}>
                <Text style={styles.yourLibraryInfoText}> Your Library </Text>
              </View>
              
                {
                  /*Warning: Each child in a list should have a unique "key" prop.*/
                  <FlatList
                  data={currentReadingFilteredBooks}
                  keyExtractor={(item) => item.bookID}
                  horizontal={true}
                  renderItem={renderItem}
                  contentContainerStyle={styles.scrollviewContent}
                />
                }
             
          </LinearGradient>
        </View>
      </GestureHandlerRootView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullscreen_view: {
    backgroundColor: Globals.COLORS.BACKGROUND_GRAY,
    flex: 1,
    flexDirection: "column",
  },
  navigation_view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  whiteLine: {
    backgroundColor: "white",
    width: "90%",
    height: 1,
    marginHorizontal: 20,
    marginTop: 0,
    marginBottom: 5,
  },
  bodyContentContainer: {
    flex: 6,
    flexDirection: "column",
    paddingHorizontal: 25,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Globals.COLORS.BACKGROUND_GRAY,
  },
  currentReadingsContainer: {
    backgroundColor: 'blue',
    width: windowWidth - 30,
    borderRadius: 20,
    marginTop: 0,
    height: windowHeight - 210,
    paddingRight: 0,
    flexGrow: 1,
  },
  yourLibraryInfo: {
    width: 130,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 5,
    marginLeft: 15,
    marginRight: 500,
    borderRadius: 10,
    marginBottom: 10,
  },
  yourLibraryInfoText: {
    fontSize: 17,
    fontWeight: "bold",
    color: Globals.COLORS.PURPLE,
  },
  scrollview: {

  },
  scrollviewContent: {
    //backgroundColor: 'purple',
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    //alignItems: "center", // Align items to the start within each row
    columnGap: 3,
  }
});
