import Globals from "../UI/_globals/Globals"
const ADD_NEW_BOOK_ENDPOINT: string = "/addnewbook"

export async function add_new_book(bookTitle: string, authorUsername: string, description: string, bookGenre: string) {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + ADD_NEW_BOOK_ENDPOINT + '?';
    HTTPS_REQUEST += "bookTitle=" + bookTitle + '&'
    HTTPS_REQUEST += "authorUsername=" + authorUsername + '&'
    HTTPS_REQUEST += "description=" + description + '&'
    HTTPS_REQUEST += "bookGenre=" + bookGenre
    console.log("aici\n");
    console.log(HTTPS_REQUEST);

    await fetch(HTTPS_REQUEST, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bookTitle: bookTitle,
            authorUsername: authorUsername,
            description: description,
            bookGenre: bookGenre,
        }),
    })
        .then((response) => response.json())
        .then((responseData) => {
            //console.log("sosaj");
            console.log(JSON.stringify(responseData));
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
        })
    return 0;
}