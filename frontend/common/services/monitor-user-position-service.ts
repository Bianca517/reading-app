import { useEffect } from "react"
import Globals from "../UI/_globals/Globals"
import { UserPositions } from "../types"

const GET_CURRENT_POSITION_IN_BOOK:string = "/getuserpositioninbook"
const UPDATE_CURRENT_POSITION_IN_BOOK:string = "/updateuserpositioninbook"
const UID_PARAMETER:string = "UID="
const BOOK_ID_PARAMETER:string = "bookID="
const CHAPTER_NUMBER_PARAMETER:string = "chapterNumber="
const GET_ALL_POSITIONS_ENDPOINT: string = "/getallbooksinlibrarywithpositions"

export async function updateUserCurrentPositionInBook(UID: string, bookID: string, chapterNumber: string): Promise<Boolean> {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + UPDATE_CURRENT_POSITION_IN_BOOK + '?' +
        UID_PARAMETER + UID + '&' +
        BOOK_ID_PARAMETER + bookID + '&' +
        CHAPTER_NUMBER_PARAMETER + chapterNumber;

    let success: Boolean = false;

    await fetch(HTTPS_REQUEST, {
        method: "PUT",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            const {status} = responseData;
            success = status == 0 ? true : false;
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            success = false;
        });

    return success;
}


export async function getUserCurrentPositionInBook(UID: string, bookID: string): Promise<Number> {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + UPDATE_CURRENT_POSITION_IN_BOOK + '?' +
        UID_PARAMETER + UID + '&' +
        BOOK_ID_PARAMETER + bookID;

    let chapterNumberToReturn: Number = null;

    await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            const {status, chapterNumber} = responseData;
            //response data format is {"status":"0","chapterNumber":"-1"}
            let success = (status == 0) ? true : false;
            chapterNumberToReturn = success && (chapterNumber > -1) ? chapterNumber : null;
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            chapterNumberToReturn = null;
        });
        
    return chapterNumberToReturn;
}


export async function getAllUserPositions(UID: string) {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_ALL_POSITIONS_ENDPOINT + '?' +
    UID_PARAMETER + UID;

    let userPositions: UserPositions = {};

    await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
    .then((response) => response.json())
    .then((responseData: { [key: string]: number }) => {
        userPositions = responseData;
    })
    .catch(async (e) => {
        console.log("intra pe catch");
        console.log(e);
       
    });
    
    return userPositions;
}