export default {
    COLORS: {
        BACKGROUND_GRAY: '#2d2d2d',
        PURPLE: '#d807f2',
        FOR_YOU_SECTION: '#aa78cf',
    },
    LIBRARY_SECTIONS: {
        CURRENT_READINGS: 0,
        FINALIZED_READINGS: 1,
        READING_TRACKER: 2,
    },
    BOOK_COVER_URI_TEMPLATE: 'https://firebasestorage.googleapis.com/v0/b/reading-app-d23dc.appspot.com/o/book_covers%2FNAME_AUTHOR.png?alt=media',
    BOOK_COLLECTION_FIELDS: ["name", "authorUsername", "chapters", "cover", "readers", "genre", "id"],
    MONTHS_BACKGROUND_IMAGES: 'https://firebasestorage.googleapis.com/v0/b/reading-app-d23dc.appspot.com/o/reading_tracker_months_backgrounds%2FMONTH.jpg?alt=media&token=9ef99e38-7a1b-4236-a992-b9f5021a756b',
    MONTHS_LIST: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],
    MONTH_CONTAINER_HEIGHT_IN_MAIN_READING_TRACKER: 380,
    MONTH_CONTAINER_HEIGHT_IN_EDIT_READING_TRACKER: 350,
    BACKEND_HTTP: "http://192.168.1.135:8080",
    Y_INDEX_OF_BEGINNING_MONTH_CONTAINER: -190,
}
