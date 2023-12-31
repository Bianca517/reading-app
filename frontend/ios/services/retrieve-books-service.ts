import Globals from "../UI/_globals/Globals"
const GET_FINALIZED_READINGS_ENDPOINT: string = "/getusersfinalizedreadings"
const GET_CURRENT_READINGS_ENDPOINT: string = "/getusercurrentreadings"

export async function get_finalized_readings() {
    const HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_FINALIZED_READINGS_ENDPOINT
    var body = ""
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
            return { success: true, responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, e };
        });
    return returnedFinalizedBooks
}


export async function get_current_readings() {
    const HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_CURRENT_READINGS_ENDPOINT
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
            return { success: true, responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, e };
        });
    return returnedCurrentBooks
}


