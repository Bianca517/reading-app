const BACKEND_HTTPS: string = "http://192.168.1.236:8080"
const GET_FINALIZED_READINGS_ENDPOINT: string = "/getusersfinalizedreadings"
const GET_CURRENT_READINGS_ENDPOINT: string = "/getusercurrentreadings"

export async function retrieve_finalized_readings() {
    const HTTPS_REQUEST = BACKEND_HTTPS + GET_FINALIZED_READINGS_ENDPOINT
    var body = ""
    console.log("in retrieve finalized readings");

    var returnedFinalizedBooks = await fetch(HTTPS_REQUEST, {
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
            return { success: true, responseData};
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, e};
        });
    return returnedFinalizedBooks
}


export async function retrieve_current_readings() {
    const HTTPS_REQUEST = BACKEND_HTTPS + GET_CURRENT_READINGS_ENDPOINT
    var body = ""
    console.log("in retrieve current readings");

    var returnedCurrentBooks = await fetch(HTTPS_REQUEST, {
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
            return { success: true, responseData};
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, e};
        });
    return returnedCurrentBooks
}