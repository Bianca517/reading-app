import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  SafeAreaView,
  Dimensions,
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
  const [currentReadingBooks, setCurrentReadingBooks] = useState<Book[]>([]);
  const [currentReadingFilteredBooks, setCurrentReadingFilteredBooks] = useState<Book[]>([]);
  const [plannedBookList, setPlannedBookList] = useState<Book[]>(routeProps.params["plannedBookList"]);

  //get month name as string because it is needed for the backend GET request
  let currentMonthName: string = Globals.MONTHS_LIST[currentMonthIndex].toLowerCase();
  currentMonthName = currentMonthName[0].toUpperCase() + currentMonthName.substring(1);

  //this executes on page load
  useEffect(() => {
    if (isFocused) {
      if(!GlobalBookData.CURRENT_READINGS) {
        loadCurrentReadingBooks();
      }
      else {
        filterCurrentReadingBooks(GlobalBookData.CURRENT_READINGS);
      }
      loadPlannedBooksForAMonth();
    }
  }, [isFocused]);

  async function loadCurrentReadingBooks() {
    let fetchResponse = await get_current_readings(GlobalUserData.LOGGED_IN_USER_DATA.uid).then();

    if (fetchResponse.success) {
        const parsedData = JSON.parse(fetchResponse.message);
        filterCurrentReadingBooks(parsedData); //used parsedData because if I used setCurrentReadingFilteredBooks it would take too long to filer
        //and the filter function would use an empty array
    }
  }

  async function loadPlannedBooksForAMonth() {
    let fetchResponse = await get_readings_planned_for_month(currentMonthName).then();
    if (fetchResponse.success) {
        setPlannedBookList(JSON.parse(fetchResponse.message));
        //console.log("planned book list ", plannedBookList);
    }
  }

  function filterCurrentReadingBooks(parsedData: any) {
    // get IDs from the planned books
    const plannedBookIDs: Set<string> = new Set(plannedBookList.map((book: { [x: string]: any; }) => book[Globals.BOOK_COLLECTION_FIELDS[6]]));
    // filter books in current readings that dont have the id in planned books
    const result: string[] = parsedData.filter((book: { id: string; }) => !plannedBookIDs.has(book.id));
     
    setCurrentReadingFilteredBooks(result);
    //console.log("filtered current readings: ", currentReadingFilteredBooks);
  }

  const createBook = (bookId: string, bookTitle: string, bookAuthor: string): Book => {
    return {
      id: bookId,
      name: bookTitle,
      authorUsername: bookAuthor,
    } as Book;
  };

  async function onAddedBook(bookId: string, bookTitle: string, bookAuthor: string) {
    //if book was dropped => add it as planned for the current month
    await plan_book_for_month(currentMonthName, bookId);
    const addedBook: Book = createBook(bookId, bookTitle, bookAuthor);

    //console.log("teoretic added");
    setPlannedBookList((plannedBookList: Book[]) => [...plannedBookList, addedBook]);

    setCurrentReadingFilteredBooks((prevBooks: Book[]) =>
      prevBooks.filter((book: Book) => book["id"] !== bookId)
    );
  }

  function onBookRemovedCallback(bookId: string, bookTitle: string, bookAuthor: string,) {
    const removedPlannedBook: Book = createBook(bookId, bookTitle, bookAuthor);

    //if book was dropped => remove it from planned for the current month
    //console.log("book was removed ", removedPlannedBook);
    setPlannedBookList(plannedBookList.filter((book: { [x: string]: any; }) => book[Globals.BOOK_COLLECTION_FIELDS[6]] !== bookId));
    //console.log("filtered current readings: ", [...currentReadingFilteredBooks, removedPlannedBook]);
    setCurrentReadingFilteredBooks([...currentReadingFilteredBooks, removedPlannedBook]);
    
  }

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
            <ScrollView>

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

              <View style={styles.currentReadingsContainer}>
                <ScrollView style={styles.scrollview} contentContainerStyle={styles.scrollviewContent}>
                {
                  /*Warning: Each child in a list should have a unique "key" prop.*/
                  currentReadingFilteredBooks.map((book, index) => (
                      <BookDraggable
                        key={index}
                        bookFields={JSON.stringify(book)}
                        bookCoverWidth={100}
                        bookCoverHeight={150}
                        bookAddedCallback={onAddedBook}
                      />
                  ))
                }
                </ScrollView>
              </View>

            </ScrollView>
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
    marginTop: 10,
    marginBottom: 20,
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
    width: windowWidth - 30,
    borderRadius: 20,
    marginTop: 0,
    height: windowHeight - 230,
    paddingHorizontal: 0,
  },
  yourLibraryInfo: {
    width: 130,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 7,
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
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center", // Align items to the start within each row
    columnGap: -15
  }
});
