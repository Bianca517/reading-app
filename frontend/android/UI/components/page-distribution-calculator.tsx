type textParagraph = {
    id: string;
    content: string;
}

function addLastPage(pageTexts: textParagraph[][]) {
    const numberOfPages: number = pageTexts.length;
    const lastPage: textParagraph = {
        id: (numberOfPages + 1).toString(),
        content: "End of chapter ",
    }
    pageTexts.push([lastPage]);
    return pageTexts;
}

export default function textDistributer (textToDisplay: textParagraph[], pagesHeight: number, pagesWidth: number, fontSize: number): textParagraph[][]{
    let charactersPerLine: number= Math.floor(pagesWidth / (fontSize * 0.6));  
    let linesPerPage: number = Math.floor(pagesHeight / fontSize);
    let charactersPerPage = charactersPerLine * linesPerPage;

    let pageTexts: textParagraph[][] = [];
    let currentPageIndex: number = 0;
    let currentPageTotalCharacters: number = 0;

    //console.log("received: ", textToDisplay, pagesHeight, pagesWidth, fontSize);

    for (let i = 0; i < textToDisplay.length; i++) {
        if(currentPageTotalCharacters + textToDisplay[i].content.length <= charactersPerPage) {
            if (!pageTexts[currentPageIndex]) {
                pageTexts[currentPageIndex] = [];
            }
            pageTexts[currentPageIndex].push(textToDisplay[i]);
            currentPageTotalCharacters += textToDisplay[i].content.length;
        }
        else {
            currentPageIndex++;
            currentPageTotalCharacters = 0;
            i--; //the paragraph was not yet assigned to a page
        }
    }
    pageTexts = addLastPage(pageTexts);
    //console.log("pageTexts: ", pageTexts)
    return pageTexts;
};
