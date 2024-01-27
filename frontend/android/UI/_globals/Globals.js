export default {
    COLORS: {
        BACKGROUND_GRAY: '#2d2d2d',
        BACKGROUND_WHITE: '#FFFFFF',
        BACKGROUND_YELLOW: '#FFFFCC',
        BACKGROUND_LIGHT_GRAY: '#5E5E5E',
        PURPLE: '#d807f2',
        FOR_YOU_SECTION: '#aa78cf',
        CHECKBOX_CHECKED_GREEN: '#47af2c',
        INTEREST_CONTAINER_BACKGROUND_LIGHT_PINK: '#db81f1',
        INTEREST_CONTAINER_BACKGROUND_COLOR_1: '#c56cf0',
        INTEREST_CONTAINER_BACKGROUND_COLOR_2: '#f39be5',
        INTEREST_CONTAINER_BACKGROUND_COLOR_3: '#a450c9',
        INTEREST_CONTAINER_BACKGROUND_COLOR_4: '#f7a8ff',
    },
    LIBRARY_SECTIONS: {
        CURRENT_READINGS: 0,
        FINALIZED_READINGS: 1,
        READING_TRACKER: 2,
    },
    BOOK_COVER_URI_TEMPLATE: 'https://firebasestorage.googleapis.com/v0/b/reading-app-d23dc.appspot.com/o/book_covers%2FNAME_AUTHOR.png?alt=media',
    BOOK_COLLECTION_FIELDS: ["name", "authorUsername", "chaptersContents", "cover", "readers", "genre", "id"],
    BOOK_COLLECTION_FIELDS_NAME_INDEX: 0,
    BOOK_COLLECTION_FIELDS_AUTHOR_USERNAME_INDEX: 1,
    BOOK_COLLECTION_FIELDS_CHAPTERS_CONTENTS_INDEX: 2,
    BOOK_COLLECTION_FIELDS_COVER_INDEX: 3,
    BOOK_COLLECTION_FIELDS_READERS_INDEX: 4,
    BOOK_COLLECTION_FIELDS_ID_INDEX: 6,
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
    MONTH_CONTAINER_HEIGHT_IN_MAIN_READING_TRACKER: 410,
    MONTH_CONTAINER_HEIGHT_IN_EDIT_READING_TRACKER: 350,
    BACKEND_HTTP: "http://192.168.1.135:8080",
    Y_INDEX_OF_BEGINNING_MONTH_CONTAINER: -190,
    INTERESTS_LIST: [
        "Fiction",
        "Science Fiction",
        "Romance",
        "Comedy",
        "Horror",
        "Thriller",
        "War",
        "History",
        "Music",
        "Biography",
        "Drama",
        "Fan-Fiction"
    ],
    DEFAULT_FONT_FAMILY: 'System',
    DEFAULT_FONT_SIZE: 15,
    MIN_FONT_SIZE: 12,
    MAX_FONT_SIZE: 23,
    BACKGROUND_COLOR_0: 'white',
    FONT_COLOR_0: 'black',
    BACKGROUND_COLOR_1: 'black',
    FONT_COLOR_1: 'white',
    BACKGROUND_COLOR_2: 'yellow',
    FONT_COLOR_2: "#333333",
}
