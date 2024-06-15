import Globals from "../_globals/Globals";

export function constructURIForBookCover(bookTitle: string, bookAuthor: string) {
    //replace spaces from strings
    if(bookTitle.includes(' ')) {
        var bookTitleWords: string[] = bookTitle.split(' ');
        bookTitle = "";
        bookTitleWords.forEach(word => {
            bookTitle += word;
        });
    }

    if(bookAuthor.includes(' ')) {
        var bookAuthorWords: string[] = bookAuthor.split(' ');
        bookAuthor = "";
        bookAuthorWords.forEach(word => {
            bookAuthor += word;
        });
    }

    var URIForBookCover = Globals.BOOK_COVER_URI_TEMPLATE_PNG.replace('NAME', bookTitle.toLowerCase());
    URIForBookCover = URIForBookCover.replace('AUTHOR', bookAuthor.toLowerCase());
    //console.log(URIForBookCover);
    return URIForBookCover;
}