import Globals from "../UI/_globals/Globals"
const GET_FINALIZED_READINGS_ENDPOINT: string = "/getusersfinalizedreadings"
const GET_CURRENT_READINGS_ENDPOINT: string = "/getusercurrentreadings"
const GET_POPULAR_READINGS_ENDPOINT: string = "/getpopularbooks"
const GET_RECOMMENDED_READINGS_ENDPOINT: string = "/getinterestingbooks"
const GET_BOOKS_WITH_GENRE: string = "/getbookwithgenre"
const GET_BOOKS_WITH_NAME: string = "/getbookwithname"

const UID_PARAMETER: string = "?UID="

export async function get_finalized_readings(userID: string) {
    var HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_FINALIZED_READINGS_ENDPOINT
    HTTPS_REQUEST += UID_PARAMETER + userID;
    //console.log("in retrieve finalized readings");

    var returnedFinalizedBooks = await fetch(HTTPS_REQUEST, {
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
            responseData = JSON.stringify(responseData);
            return { success: true, message: responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, message: e };
        });
    return returnedFinalizedBooks
}

export async function get_popular_readings() {
    const HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_POPULAR_READINGS_ENDPOINT
    
    //console.log("in retrieve finalized readings");

    var returnedFinalizedBooks = await fetch(HTTPS_REQUEST, {
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
            responseData = JSON.stringify(responseData);
            return { success: true, message: responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, message: e };
        });
    return returnedFinalizedBooks
}


export async function get_recommended_readings(userID: string) {
    var HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_RECOMMENDED_READINGS_ENDPOINT
    HTTPS_REQUEST += UID_PARAMETER + userID;
    //console.log("in retrieve finalized readings");

    var returnedFinalizedBooks = await fetch(HTTPS_REQUEST, {
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
            responseData = JSON.stringify(responseData);
            return { success: true, message: responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, message: e };
        });
    return returnedFinalizedBooks
}


export async function get_current_readings(userID: string) {
    var HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_CURRENT_READINGS_ENDPOINT
    HTTPS_REQUEST += UID_PARAMETER + userID;
    //console.log(HTTPS_REQUEST);
    var returnedCurrentBooks = await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            responseData = JSON.stringify(responseData);
            return { success: true, message: responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, message: e };
        });
    return returnedCurrentBooks
}


export async function get_books_with_specified_genre(genre: string) {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_BOOKS_WITH_GENRE;
    let parametersRequest = "?genre=" + genre;
    HTTPS_REQUEST += parametersRequest;

    var returnedBooks = await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            console.log("sosaj");
            console.log(JSON.stringify(responseData));
            responseData = JSON.stringify(responseData);
            return { success: true, message: responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, message: e };
        });
    return returnedBooks
}


export async function get_books_with_specified_name(name: string) {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_BOOKS_WITH_NAME;
    let parametersRequest = "?name=" + name;
    HTTPS_REQUEST += parametersRequest;
    var body = ""

    var returnedCurrentBooks = await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            //console.log("sosaj");
            //console.log(JSON.stringify(responseData));
            responseData = JSON.stringify(responseData);
            return { success: true, message: responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, message: e };
        });
    return returnedCurrentBooks
}


