import Globals from "../UI/_globals/Globals"
import { ResponseTypeRetrieveBooks, bookDTO } from "../types"
const GET_FINALIZED_READINGS_ENDPOINT: string = "/getusersfinalizedreadings"
const GET_CURRENT_READINGS_ENDPOINT: string = "/getusercurrentreadings"
const GET_POPULAR_READINGS_ENDPOINT: string = "/getpopularbooks"
const GET_RECOMMENDED_READINGS_ENDPOINT: string = "/getinterestingbooks"
const GET_BOOKS_WITH_GENRE: string = "/getbookwithgenre"
const GET_BOOKS_WITH_NAME: string = "/getbookwithname"

const UID_PARAMETER: string = "?UID="


export async function get_finalized_readings(userID: string): Promise<bookDTO[]> {
    var HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_FINALIZED_READINGS_ENDPOINT
    HTTPS_REQUEST += UID_PARAMETER + userID;
    
    let responseBooks: bookDTO[] = [];

    await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            responseBooks = responseData.map((book: any) => {
                return {
                    bookTitle: book.bookTitle,
                    authorUsername: book.authorUsername,
                    bookID: book.bookID,
                    numberOfChapters: book.numberOfChapters
                };
            });
        })
        .catch(async (e) => {
            console.log("intra pe catch finalized");
            console.log(e);
        });

    return responseBooks;
}

export async function get_popular_readings(): Promise<bookDTO[]> {
    const HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_POPULAR_READINGS_ENDPOINT
    
    let responseBooks: bookDTO[] = [];

    await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            responseBooks = responseData.map((book: any) => {
                return {
                    bookTitle: book.bookTitle,
                    authorUsername: book.authorUsername,
                    bookID: book.bookID,
                    numberOfChapters: book.numberOfChapters
                };
            });
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
        });

        return responseBooks
}


export async function get_recommended_readings(userID: string): Promise<bookDTO[]> {
    var HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_RECOMMENDED_READINGS_ENDPOINT
    HTTPS_REQUEST += UID_PARAMETER + userID;
    
    let responseBooks: bookDTO[] = [];

    await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            //console.log("interesting books am primit asa:");
            //console.log(responseData);
            responseBooks = responseData.map((book: any) => {
                return {
                    bookTitle: book.bookTitle,
                    authorUsername: book.authorUsername,
                    bookID: book.bookID,
                    numberOfChapters: book.numberOfChapters
                };
            });
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
        });
    
        return responseBooks;
}


export async function get_current_readings(userID: string): Promise<bookDTO[]> {
    var HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_CURRENT_READINGS_ENDPOINT
    HTTPS_REQUEST += UID_PARAMETER + userID;
    
    let responseBooks: bookDTO[] = [];
    console.log(HTTPS_REQUEST);

    await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            console.log(responseData);
            responseBooks = responseData.map((book: any) => {
                return {
                    bookTitle: book.bookTitle,
                    authorUsername: book.authorUsername,
                    bookID: book.bookID,
                    numberOfChapters: book.numberOfChapters
                };
            });
        })
        .catch(async (e) => {
            console.log("intra pe catch get_current_readings");
            console.log(e);
        });
        
    return responseBooks;
}


export async function get_books_with_specified_genre(genre: string): Promise<bookDTO[]> {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_BOOKS_WITH_GENRE;
    let parametersRequest = "?genre=" + genre;
    HTTPS_REQUEST += parametersRequest;

    let responseBooks: bookDTO[] = [];

    var returnedBooks = await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            responseBooks = responseData.map((book: any) => {
                return {
                    bookTitle: book.bookTitle,
                    authorUsername: book.authorUsername,
                    bookID: book.bookID,
                    numberOfChapters: book.numberOfChapters
                };
            });
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
        });
    return responseBooks;
}


export async function get_books_with_specified_name(name: string): Promise<bookDTO[]> {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_BOOKS_WITH_NAME;
    let parametersRequest = "?name=" + name;
    HTTPS_REQUEST += parametersRequest;
    
    let responseBooks: bookDTO[] = [];

    var returnedCurrentBooks = await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            responseBooks = responseData.map((book: any) => {
                return {
                    bookTitle: book.bookTitle,
                    authorUsername: book.authorUsername,
                    bookID: book.bookID,
                    numberOfChapters: book.numberOfChapters
                };
            });
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
        });
    return responseBooks;
}


