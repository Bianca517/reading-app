
import GlobalBookData from "../_globals/GlobalBookData";
import Globals from "../_globals/Globals";
import { get_readings_planned_for_month } from "../../services/reading-planner-service";
import { ResponseType } from "../../types";
import { get_total_nr_of_chapters } from "../../services/book-reading-service";

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
        const totalNumberOfChapters: ResponseType = JSON.parse(fetchResponse.message);
        return parseInt(totalNumberOfChapters.message);
    }
    return null;
}
