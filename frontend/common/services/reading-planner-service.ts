import Globals from "../UI/_globals/Globals"
const GET_PLANNED_BOOKS_FOR_MONTH_ENDPOINT: string = "/getusersplannedreadings?monthName="
const PLAN_NEW_BOOK_FOR_MONTH_ENDPOINT: string = "/planbookformonth?monthName=MONTH_NAME&bookID=BOOK_ID"
const DELETE_PLANNED_BOOK_FOR_MONTH_ENDPOINT: string = "/removebookplannedformonth?monthName=MONTH_NAME&bookID=BOOK_ID"

export async function get_readings_planned_for_month(monthName: string) {
    const HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_PLANNED_BOOKS_FOR_MONTH_ENDPOINT + monthName
    //console.log("in get planned books\n");

    var returnedPlannedBooks = await fetch(HTTPS_REQUEST, {
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
    return returnedPlannedBooks;
}


export async function plan_book_for_month(monthName: string, bookID: string) {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + PLAN_NEW_BOOK_FOR_MONTH_ENDPOINT
    HTTPS_REQUEST = HTTPS_REQUEST.replace("MONTH_NAME", monthName);
    HTTPS_REQUEST = HTTPS_REQUEST.replace("BOOK_ID", bookID);
    console.log("in get plan book " + HTTPS_REQUEST + "\n");

    fetch(HTTPS_REQUEST, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "monthName": monthName,
            "bookID": bookID,
        }),
    });
}

export async function delete_planned_book_for_month(monthName: string, bookID: string) {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + DELETE_PLANNED_BOOK_FOR_MONTH_ENDPOINT
    HTTPS_REQUEST = HTTPS_REQUEST.replace("MONTH_NAME", monthName);
    HTTPS_REQUEST = HTTPS_REQUEST.replace("BOOK_ID", bookID);
    console.log("in delete planned book " + HTTPS_REQUEST + "\n");

    fetch(HTTPS_REQUEST, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "monthName": monthName,
            "bookID": bookID,
        }),
    });
}