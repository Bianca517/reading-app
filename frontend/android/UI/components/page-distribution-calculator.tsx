type textParagraph = {
    id: string;
    content: string;
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
    //console.log("pageTexts: ", pageTexts);
    return pageTexts;
};
