import Globals from "../UI/_globals/Globals"
import { ResponseType, ResponseTypePOST } from "../types";
const ADD_NEW_BOOK_ENDPOINT: string = "/addnewbook"
const GET_BOOKS_WRITTEN_BY_ENDPOINT: string = "/getallbooksbyuser"
const GET_ALL_BOOK_CHAPTERS_ENDPOINT: string = "/getallchaptersofbook"
const ADD_NEW_CHAPTER_TO_BOOK_ENDPOINT: string = "/addnewchapter"
const ADD_NEW_PARAGRAPH_TO_CHAPTER_FROM_BOOK_ENDPOINT: string = "/addnewparagraph"
const ADD_NEW_CHAPTER_CONTENT_TO_CHAPTER_FROM_BOOK_ENDPOINT: string = "/addnewchaptercontent"
const USER_ID_PARAMETER_IN_ENDPOINT: string = "?UID="
const BOOK_ID_PARAMETER_IN_ENDPOINT: string = "bookID="
const CHAPTER_TITLE_PARAMETER_IN_ENDPOINT: string = "chapterTitle="
const CHAPTER_NUMBER_PARAMETER_IN_ENDPOINT: string = "chapterNumber="
const PARAGRAPH_CONTENT_PARAMETER_IN_ENDPOINT: string = "paragraphContent="
const CHAPTER_CONTENT_PARAMETER_IN_ENDPOINT: string = "chapterContent="

export async function add_new_book(bookTitle: string, authorUsername: string, description: string, bookGenre: string): Promise<number> {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + ADD_NEW_BOOK_ENDPOINT + '?';
    HTTPS_REQUEST += "bookTitle=" + bookTitle + '&'
    HTTPS_REQUEST += "authorUsername=" + authorUsername + '&'
    HTTPS_REQUEST += "description=" + description + '&'
    HTTPS_REQUEST += "bookGenre=" + bookGenre
    //console.log("aici\n");
    //console.log(HTTPS_REQUEST);
    let statusToReturn: number = -1;

    await fetch(HTTPS_REQUEST, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bookTitle: bookTitle,
            authorUsername: authorUsername,
            description: description,
            bookGenre: bookGenre,
        }),
    })
        .then((response) => response.json())
        .then((responseData) => {
            //console.log("in add book fetch");
            //console.log(JSON.stringify(responseData));
            const {status} = responseData;
            statusToReturn = status;
            //console.log("status", statusToReturn);
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            statusToReturn = 1;
        })

    return statusToReturn;
}

export async function get_users_written_books(userID: string) : Promise<ResponseType> {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_BOOKS_WRITTEN_BY_ENDPOINT + USER_ID_PARAMETER_IN_ENDPOINT + userID;

    let response: ResponseType = {success: false, message: ""};

    await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            const {success, message} = responseData;
            response.success = success == 0 ? true : false;
            response.message = message;
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            response.success = false;
            response.message = "";
        })

    return response;
}


export async function get_all_chapters_from_book(bookID: string) : Promise<ResponseType> {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_ALL_BOOK_CHAPTERS_ENDPOINT + '?' + 
        BOOK_ID_PARAMETER_IN_ENDPOINT + bookID;

    let response: ResponseType = {success: false, message: ""};

    await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            const {success, message} = responseData;
            response.success = success == 0 ? true : false;
            response.message = message;
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            response.success = false;
            response.message = "";
        })

    return response;
}

export async function add_new_chapter_to_book(bookID: string, chapterTitle: string): Promise<ResponseTypePOST> {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + ADD_NEW_CHAPTER_TO_BOOK_ENDPOINT + '?' + 
        CHAPTER_TITLE_PARAMETER_IN_ENDPOINT + chapterTitle + '&' + 
        BOOK_ID_PARAMETER_IN_ENDPOINT + bookID;
    
    let returnedStatus: ResponseTypePOST = {status: -1};

    console.log(HTTPS_REQUEST);

    await fetch(HTTPS_REQUEST, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            console.log("in service");
            console.log(responseData);
            const {status} = responseData;
            returnedStatus.status = status;
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            returnedStatus.status = -1;
        })

    return returnedStatus;
}


export async function add_new_paragraphs_list_to_chapter(bookID: string, chapterNumber: number, paragraphContent: string) : Promise<ResponseTypePOST> {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + ADD_NEW_CHAPTER_CONTENT_TO_CHAPTER_FROM_BOOK_ENDPOINT + '?' 
        + CHAPTER_NUMBER_PARAMETER_IN_ENDPOINT + chapterNumber + '&'
        + BOOK_ID_PARAMETER_IN_ENDPOINT + bookID + '&'
        + CHAPTER_CONTENT_PARAMETER_IN_ENDPOINT + paragraphContent;

    console.log(HTTPS_REQUEST);
    var returnedStatus: ResponseTypePOST = {status: -1};

    await fetch(HTTPS_REQUEST, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            const {status} = responseData;
            returnedStatus.status = status;
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            returnedStatus.status = -1;
        })

    return returnedStatus;
}
