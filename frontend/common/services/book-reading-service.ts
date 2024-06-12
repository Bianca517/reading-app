import Globals from "../UI/_globals/Globals"
import { ResponseType } from "../types"
const GET_NUMBER_OF_CHAPTERS_ENDPOINT: string = "/getbookchapters?bookID=BOOK_ID"
const GET_CHAPTER_TITLE_ENDPOINT: string = "/getbookchaptertitle?bookID=BOOK_ID&chapterNumber=CHAPTER_NUMBER"
const GET_CHAPTER_CONTENT_ENDPOINT: string = "/getbookchaptercontent?bookID=BOOK_ID&chapterNumber=CHAPTER_NUMBER"
const GET_BOOK_DESCRIPTION_ENDPOINT: string = "/getbookdescription?bookID=BOOK_ID"
const GET_TOTAL_NR_OF_CHAPTERS_ENDPOINT: string = "/getbookchapters?bookID=BOOK_ID"
const ADD_BOOK_TO_LIBRARY_ENDPOINT: string = "/addbooktolibrary?userID=USER_ID&bookID=BOOK_ID"
const ADD_BOOK_TO_FINISHED_BOOKS_ENDPOINT: string = "/addbooktofinalizedbooks?userID=USER_ID&bookID=BOOK_ID"
const REMOVE_BOOK_FROM_LIBRARY_ENDPOINT: string = "/removebookfromcurrent?UID=USER_ID&bookID=BOOK_ID"
const BOOK_ID_STRING_TO_REPLACE: string = "BOOK_ID"
const CHAPTER_NUMBER_STRING_TO_REPLACE: string = "CHAPTER_NUMBER"
const USERID_STRING_TO_REPLACE: string = "USER_ID"

export async function get_number_of_chapters_of_book(bookID: string): Promise<ResponseType> {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_NUMBER_OF_CHAPTERS_ENDPOINT;
    HTTPS_REQUEST = HTTPS_REQUEST.replace(BOOK_ID_STRING_TO_REPLACE, bookID);

    var returnedNumberOfChapters = await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            //console.log("got it");
            //console.log(JSON.stringify(responseData));
            return { success: true, message: responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, message: e };
        });
    return returnedNumberOfChapters
}

export async function get_book_chapter_content(bookID: string, chapterNumber: number) {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_CHAPTER_CONTENT_ENDPOINT;
    HTTPS_REQUEST = HTTPS_REQUEST.replace(BOOK_ID_STRING_TO_REPLACE, bookID);
    HTTPS_REQUEST = HTTPS_REQUEST.replace(CHAPTER_NUMBER_STRING_TO_REPLACE, chapterNumber.toString());
    //console.log(HTTPS_REQUEST);

    var chapterContent = await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            //console.log("got it");
            responseData = JSON.stringify(responseData);
            return { success: true, message: responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, message: e };
        });
    return chapterContent
}

export async function get_book_chapter_title(bookID: string, chapterNumber: number) {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_CHAPTER_TITLE_ENDPOINT;
    HTTPS_REQUEST = HTTPS_REQUEST.replace(BOOK_ID_STRING_TO_REPLACE, bookID);
    HTTPS_REQUEST = HTTPS_REQUEST.replace(CHAPTER_NUMBER_STRING_TO_REPLACE, chapterNumber.toString());
    //console.log(HTTPS_REQUEST);

    var chapterContent = await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            //console.log("TITLE");
            responseData = responseData.toString();
            //console.log(responseData);
            return { success: true, message: responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, message: e };
        });
    return chapterContent
}

export async function get_book_description(bookID: string) {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_BOOK_DESCRIPTION_ENDPOINT;
    HTTPS_REQUEST = HTTPS_REQUEST.replace(BOOK_ID_STRING_TO_REPLACE, bookID);
    //console.log(HTTPS_REQUEST);

    var bookDescription = await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            responseData = JSON.stringify(responseData);
            //console.log(responseData);
            return { success: true, message: responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, message: e };
        });
    return bookDescription
}

export async function get_total_nr_of_chapters(bookID: string) {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_TOTAL_NR_OF_CHAPTERS_ENDPOINT;
    HTTPS_REQUEST = HTTPS_REQUEST.replace(BOOK_ID_STRING_TO_REPLACE, bookID);
    //console.log(HTTPS_REQUEST);

    var totalNrOfChapters = await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            //responseData = JSON.stringify(responseData);
            //console.log(responseData);
            return { success: true, message: responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, message: e };
        });
    return totalNrOfChapters
}

export async function add_book_to_library(bookID: string, userID: string) {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + ADD_BOOK_TO_LIBRARY_ENDPOINT;
    HTTPS_REQUEST = HTTPS_REQUEST.replace(BOOK_ID_STRING_TO_REPLACE, bookID);
    HTTPS_REQUEST = HTTPS_REQUEST.replace(USERID_STRING_TO_REPLACE, userID);
    console.log(HTTPS_REQUEST);

    var requestResponse = await fetch(HTTPS_REQUEST, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((responseData) => {
            //responseData = JSON.stringify(responseData);
            //console.log(responseData);
            return { success: true, message: responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, message: e };
        });
    return requestResponse
}


export async function remove_book_from_library(bookID: string, userID: string): Promise<Boolean> {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + REMOVE_BOOK_FROM_LIBRARY_ENDPOINT;
    HTTPS_REQUEST = HTTPS_REQUEST.replace(BOOK_ID_STRING_TO_REPLACE, bookID);
    HTTPS_REQUEST = HTTPS_REQUEST.replace(USERID_STRING_TO_REPLACE, userID);
    console.log(HTTPS_REQUEST);

    let successToReturn: Boolean = false;

    var requestResponse = await fetch(HTTPS_REQUEST, {
        method: "DELETE",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            const {status} = responseData;
            successToReturn = status == 0 ? true : false;
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            successToReturn = false;
        });
    return successToReturn;
}


export async function add_book_to_finished_books(bookID: string, userID: string) {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + ADD_BOOK_TO_FINISHED_BOOKS_ENDPOINT;
    HTTPS_REQUEST = HTTPS_REQUEST.replace(BOOK_ID_STRING_TO_REPLACE, bookID);
    HTTPS_REQUEST = HTTPS_REQUEST.replace(USERID_STRING_TO_REPLACE, userID);
    console.log(HTTPS_REQUEST);

    var requestResponse = await fetch(HTTPS_REQUEST, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((responseData) => {
            //responseData = JSON.stringify(responseData);
            //console.log(responseData);
            return { success: true, message: responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, message: e };
        });
    return requestResponse
}

