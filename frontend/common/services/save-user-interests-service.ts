import GlobalUserData from "../UI/_globals/GlobalUserData";
import Globals from "../UI/_globals/Globals"
const SAVE_USER_INTERESTS_ENDPOINT: string = "/addinterests"

export async function save_user_interests(userInterests: string[]) {
    const HTTPS_REQUEST = Globals.BACKEND_HTTP + SAVE_USER_INTERESTS_ENDPOINT
    console.log(userInterests);

    await fetch(HTTPS_REQUEST, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userInterests: userInterests,
            userID: GlobalUserData.LOGGED_IN_USER_DATA.uid
        }),
    })
        .then((response) => response.json())
        .then((responseData) => {
            //console.log("sosaj");
            console.log(JSON.stringify(responseData));
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e)
        })
}