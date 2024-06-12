
import GlobalBookData from "../_globals/GlobalBookData";
import Globals from "../_globals/Globals";
import { get_readings_planned_for_month } from "../../services/reading-planner-service";
import { ResponseType, UserPositions } from "../../types";
import { get_total_nr_of_chapters, get_book_chapter_title, get_book_chapter_content } from "../../services/book-reading-service";
import { textParagraph } from "../../types";
import { getAllUserPositions } from "../../services/monitor-user-position-service";
import GlobalUserData from "../_globals/GlobalUserData";

interface chapterContentFromBackend {
    [key: string]: string;
}

export async function loadCurrentPlannedBooks() {
    const promises = Globals.MONTHS_LIST.map(async (month, index) => {
        let fetchResponse = await get_readings_planned_for_month(month).then();
        if (fetchResponse.success) {
            const booksForMonth: ResponseType = JSON.parse(fetchResponse.message);
            GlobalBookData.MONTH_PLANNED_BOOKS.push(booksForMonth);
        }
    });
}

export async function loadTotalNumberOfChapters(bookID: string) {
    let fetchResponse: ResponseType = await get_total_nr_of_chapters(bookID).then();
    if (fetchResponse.success) {
        const totalNumberOfChapters = fetchResponse.message;
        return parseInt(totalNumberOfChapters);
    }
    return null;
}

export async function loadChapterTitles(bookID:string, chaptersNumber: number) {
    let receivedChapterTitles: string[] = [];
    for (let i = 0; i < chaptersNumber; i++) {
        let fetchResponse = await get_book_chapter_title(bookID, i);

        if (fetchResponse.success) {
            const chapterTitle: string = fetchResponse.message;
            receivedChapterTitles.push(chapterTitle);
        }
    }
    return receivedChapterTitles;
}

export async function loadBookChapterTitle(bookID: string, chapterNumber: number) : Promise<string> {
    const fetchResponse: ResponseType = await get_book_chapter_title(bookID, chapterNumber).then();
    let receivedChapterTitle: string = "";

    if (fetchResponse.success) {
        receivedChapterTitle = fetchResponse.message;
    }

    return receivedChapterTitle;
}


export async function loadBookChapterContent(bookID: string, chapterNumber: number) : Promise<textParagraph[]> {
    const fetchResponse = await get_book_chapter_content(bookID, chapterNumber).then();
    let receivedChapterContent: textParagraph[] = [];
    // console.log("in service for loading chapter content");
    // console.log(bookID, chapterNumber);
    // console.log(fetchResponse);

    if (fetchResponse.success) {
        let responseData: chapterContentFromBackend = JSON.parse(fetchResponse.message);
        // console.log(responseData);

        let i: number = 0;
        while(responseData[i.toString()] != null) {
            // console.log(responseData[i.toString()]);

            let temp: textParagraph = {
                id: i.toString(),
                content: responseData[i.toString()]
            };        
            
            // console.log(temp);
            receivedChapterContent.push(temp);
            i++;
        }

        console.log("AM IESIT DIN WHILE\n");
    }

    // console.log("this shall be fine\n");
    // console.log(receivedChapterContent);
    return receivedChapterContent
}

export async function loadUserCurrentPositions() {
    getAllUserPositions(GlobalUserData.LOGGED_IN_USER_DATA.uid).then(( fetchResponse: UserPositions ) => {
            if(fetchResponse != null) {
                GlobalBookData.USER_CURRENT_POSITIONS = fetchResponse;
                console.log(GlobalBookData.USER_CURRENT_POSITIONS);
            }
    })
}
