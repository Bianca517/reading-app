import Globals from "../UI/_globals/Globals"
import { bookDTO } from "../types"
const GET_PLANNED_BOOKS_FOR_MONTH_ENDPOINT: string = "/getusersplannedreadings?monthName="
const PLAN_NEW_BOOK_FOR_MONTH_ENDPOINT: string = "/planbookformonth?UID=USER_ID&monthName=MONTH_NAME&bookID=BOOK_ID"
const DELETE_PLANNED_BOOK_FOR_MONTH_ENDPOINT: string = "/removebookplannedformonth?UID=USER_ID&monthName=MONTH_NAME&bookID=BOOK_ID"
const UID_PARAMETER:string = "UID=";

export async function get_readings_planned_for_month(UID: string, monthName: string) : Promise<bookDTO[]>{
    const HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_PLANNED_BOOKS_FOR_MONTH_ENDPOINT + monthName + '&' + UID_PARAMETER + UID;
    console.log("in get planned books\n");
    console.log(HTTPS_REQUEST);

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
            console.log("am reusit");
            responseBooks = responseData.map((book: any) => {
                console.log(book)
                return {
                    bookTitle: book.bookTitle,
                    authorUsername: book.authorUsername,
                    bookID: book.bookID,
                    numberOfChapters: book.numberOfChapters,
                };
            });
        })
        .catch(async (e) => {
            console.log("intra pe catch in get planned book");
            //console.log(e);
        });
    return responseBooks;
}


export async function plan_book_for_month(UID:string, monthName: string, bookID: string): Promise<Boolean> {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + PLAN_NEW_BOOK_FOR_MONTH_ENDPOINT
    HTTPS_REQUEST = HTTPS_REQUEST.replace("MONTH_NAME", monthName);
    HTTPS_REQUEST = HTTPS_REQUEST.replace("BOOK_ID", bookID);
    HTTPS_REQUEST = HTTPS_REQUEST.replace("USER_ID", UID);
    console.log(HTTPS_REQUEST);

    let success: boolean = true;

    try {
        const response = await fetch(HTTPS_REQUEST, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });

        console.log(response);
        if (!response.ok) {
            success = false;
        }
    } catch (error) {
        console.log("Error planning book:");
        console.log(error);
        success = false;
    }    
    return success;    
}

export async function delete_planned_book_for_month(UID: string, monthName: string, bookID: string): Promise<Boolean> {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + DELETE_PLANNED_BOOK_FOR_MONTH_ENDPOINT
    HTTPS_REQUEST = HTTPS_REQUEST.replace("MONTH_NAME", monthName);
    HTTPS_REQUEST = HTTPS_REQUEST.replace("BOOK_ID", bookID);
    HTTPS_REQUEST = HTTPS_REQUEST.replace("USER_ID", UID);
    console.log("in delete planned book " + HTTPS_REQUEST + "\n");

    let success: boolean = true;

    try {
        const response = await fetch(HTTPS_REQUEST, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            success = false;
        }
    } catch (error) {
        success = false;
    }    
    return success;    
}