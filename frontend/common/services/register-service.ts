import Globals from "../UI/_globals/Globals"
import { UserAuthenticationResponseType } from "../types"
import { processResponse } from "./API-process-response"
const REGISTER_ENDPOINT: string = "/register"

export async function register_user_service(userEmail: string, userPassword: string, userName: string): Promise<UserAuthenticationResponseType> {
    const HTTPS_REQUEST = Globals.BACKEND_HTTP + REGISTER_ENDPOINT;
    //console.log("aici " + userEmail + " " + userPassword + " " + HTTPS_REQUEST)
    
    var returnValue: UserAuthenticationResponseType = { HttpStatus: -1,  Data: {success_code: -1, user_id: ""}};
    
    await fetch(HTTPS_REQUEST, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            emailAddress: userEmail,
            password: userPassword,
            userName: userName
        }),
    })
        .then(processResponse)
        .then((responseData) => {
            const { statusCode, data } = responseData;
            
            returnValue.HttpStatus = statusCode;
            returnValue.Data = data;
        })
        .catch(async (e) => {
            console.log("register failed");
            console.log(e);
            returnValue.HttpStatus = 404;
            returnValue.Data = e;
        })

    return returnValue;
}