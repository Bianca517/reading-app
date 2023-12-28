import Globals from "../UI/_globals/Globals"
const LOGIN_ENDPOINT: string = "/"

export async function login_user_service(userEmail: string, userPassword: string) {
    const HTTPS_REQUEST = Globals.BACKEND_HTTP + LOGIN_ENDPOINT
    console.log("aici " + userEmail + " " + userPassword + " " + HTTPS_REQUEST)
    var body = ""
    await fetch(HTTPS_REQUEST, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            emailAddress: userEmail,
            password: userPassword
        }),
    })
        .then((response) => response.json())
        .then((responseData) => {
            console.log("sosaj");
            console.log(JSON.stringify(responseData));
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e)
        })
}