import Globals from "../UI/_globals/Globals"
const GET_NUMBER_OF_CHAPTERS_ENDPOINT: string = "/getbookchapters?bookID=BOOK_ID"
const GET_CHAPTER_TITLE_ENDPOINT: string = "/getbookchaptertitle?bookID=BOOK_ID&chapterNumber=CHAPTER_NUMBER"
const GET_CHAPTER_CONTENT_ENDPOINT: string = "/getbookchaptercontent?bookID=BOOK_ID&chapterNumber=CHAPTER_NUMBER"
const BOOK_ID_STRING_TO_REPLACE: string = "BOOK_ID"
const CHAPTER_NUMBER_STRING_TO_REPLACE: string = "CHAPTER_NUMBER"

export async function get_number_of_chapters_of_book(bookID: string) {
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
            console.log("got it");
            //console.log(JSON.stringify(responseData));
            responseData = JSON.stringify(responseData);
            return { success: true, responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, e };
        });
    return returnedNumberOfChapters
}

export async function get_book_chapter_content(bookID: string, chapterNumber: number) {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_CHAPTER_CONTENT_ENDPOINT;
    HTTPS_REQUEST = HTTPS_REQUEST.replace(BOOK_ID_STRING_TO_REPLACE, bookID);
    HTTPS_REQUEST = HTTPS_REQUEST.replace(CHAPTER_NUMBER_STRING_TO_REPLACE, chapterNumber.toString());
    console.log(HTTPS_REQUEST);

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
            return { success: true, responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, e };
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
            responseData = JSON.stringify(responseData);
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


