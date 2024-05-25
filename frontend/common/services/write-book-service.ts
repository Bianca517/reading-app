import Globals from "../UI/_globals/Globals"
import { ResponseType } from "../types";
const ADD_NEW_BOOK_ENDPOINT: string = "/addnewbook"
const GET_BOOKS_WRITTEN_BY_ENDPOINT: string = "/getallbooksbyuser"
const GET_ALL_BOOK_CHAPTERS_ENDPOINT: string = "/getallchaptersofbook"
const USER_ID_PARAMETER_IN_ENDPOINT: string = "?UID="
const BOOK_ID_PARAMETER_IN_ENDPOINT: string = "?bookID="

export async function add_new_book(bookTitle: string, authorUsername: string, description: string, bookGenre: string) {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + ADD_NEW_BOOK_ENDPOINT + '?';
    HTTPS_REQUEST += "bookTitle=" + bookTitle + '&'
    HTTPS_REQUEST += "authorUsername=" + authorUsername + '&'
    HTTPS_REQUEST += "description=" + description + '&'
    HTTPS_REQUEST += "bookGenre=" + bookGenre
    //console.log("aici\n");
    //console.log(HTTPS_REQUEST);

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
            //console.log("sosaj");
            console.log(JSON.stringify(responseData));
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
        })
    return 0;
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
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_ALL_BOOK_CHAPTERS_ENDPOINT + BOOK_ID_PARAMETER_IN_ENDPOINT + bookID;

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