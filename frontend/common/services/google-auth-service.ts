import Globals from "../UI/_globals/Globals"
import { UserAuthenticationResponseType } from "../types"
import { processResponse } from "./API-process-response"
const GOOGLE_AUTH_ENDPOINT: string = "/googleauth"

export async function login_user_with_google_service(userEmail: string, userName: string): Promise<UserAuthenticationResponseType> {
    const HTTPS_REQUEST = Globals.BACKEND_HTTP + GOOGLE_AUTH_ENDPOINT
    //console.log("google auth " + userEmail + " " + userName + " " + HTTPS_REQUEST)
    
    var returnValue: UserAuthenticationResponseType = { HttpStatus: -1,  Data: {success_code: -1, user_id: ""}};

    await fetch(HTTPS_REQUEST, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            emailAddress: userEmail,
            userName: userName
        }),
    })
        .then(processResponse)
        .then((responseData) => {
            const { statusCode, data } = responseData;
            
            //data is like this {"success_code": 0, "user_id": "2nJwCJkTBUwjMNLuwzHr"}
            returnValue.HttpStatus = statusCode;
            returnValue.Data = data;
        })
        .catch(async (e) => {
            console.log("auth with google failed. error:");
            console.log(e);
            returnValue.HttpStatus = 404;
            returnValue.Data = e;
        })

    return returnValue;
}

