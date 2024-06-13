import Globals from "../UI/_globals/Globals"
const GET_CHAPTER_CONTENT_ENDPOINT: string = "/getbookparagraphcomments?bookID=BOOK_ID&chapterNumber=CHAPTER_NUMBER&paragraphNumber=PAR_NUMBER"
const BOOK_ID_STRING_TO_REPLACE: string = "BOOK_ID"
const CHAPTER_NUMBER_STRING_TO_REPLACE: string = "CHAPTER_NUMBER"
const PARAGRAPH_NUMBER_STRING_TO_REPLACE: string = "PAR_NUMBER"
const POST_COMMENT_ENDPOINT: string = "/addcommenttobook"
const UID_PARAMETER: string = "UID="
const BOOK_ID_PARAMETER: string = "bookID="
const CHAPTER_NR_PARAMETER: string = "chapterNumber="
const PARAGRAPH_NR_PARAMETER: string = "paragraphID="
const COMMENT_CONTENT_PARAMETER: string = "comment="

export async function get_book_paragraph_comments(bookID: string, chapterNumber: number, paragraphNumber: number) {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + GET_CHAPTER_CONTENT_ENDPOINT;
    HTTPS_REQUEST = HTTPS_REQUEST.replace(BOOK_ID_STRING_TO_REPLACE, bookID);
    HTTPS_REQUEST = HTTPS_REQUEST.replace(CHAPTER_NUMBER_STRING_TO_REPLACE, chapterNumber.toString());
    HTTPS_REQUEST = HTTPS_REQUEST.replace(PARAGRAPH_NUMBER_STRING_TO_REPLACE, paragraphNumber.toString());
    console.log(HTTPS_REQUEST);

    var paragraphComments = await fetch(HTTPS_REQUEST, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            console.log("got it");
            responseData = JSON.stringify(responseData);
            console.log(responseData);
            return { success: true, message: responseData };
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
            return { success: false, message: e };
        });
    return paragraphComments
}

export async function add_new_comment(
    userID: string, 
    bookID: string, 
    chapterNumber: number, 
    paragraphNumber: number, 
    commentContent: string) : Promise<boolean> {
    let HTTPS_REQUEST = Globals.BACKEND_HTTP + POST_COMMENT_ENDPOINT + '?' +
        UID_PARAMETER + userID + '&' + 
        COMMENT_CONTENT_PARAMETER + commentContent + '&' +
        PARAGRAPH_NR_PARAMETER + paragraphNumber + '&' +
        CHAPTER_NR_PARAMETER + chapterNumber + '&' +
        BOOK_ID_PARAMETER + bookID;

    console.log(HTTPS_REQUEST);
    let success: boolean = false;

    await fetch(HTTPS_REQUEST, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseData) => {
            const {status} = responseData
            success = (status == 0) ? true : false;
        })
        .catch(async (e) => {
            console.log("intra pe catch");
            console.log(e);
        });
    return success;
}