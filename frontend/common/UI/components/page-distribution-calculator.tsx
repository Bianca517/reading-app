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
    console.log("received: ", textToDisplay, pagesHeight, pagesWidth, fontSize);
    
    let charactersPerLine: number= Math.floor(pagesWidth / (fontSize * 0.8));  
    let linesPerPage: number = Math.floor(pagesHeight / fontSize);
    let charactersPerPage = charactersPerLine * linesPerPage;

    let pageTexts: textParagraph[][] = [];
    let currentPageIndex: number = 0;
    let currentPageTotalCharacters: number = 0;

    

    for (let i = 0; i < textToDisplay.length; i++) {
        if(currentPageTotalCharacters + textToDisplay[i].content.length <= charactersPerPage) {
            if (!pageTexts[currentPageIndex]) {
                pageTexts[currentPageIndex] = [];
            }
            pageTexts[currentPageIndex].push(textToDisplay[i]);
            currentPageTotalCharacters += textToDisplay[i].content.length;
        }
        else {
            //treat case where one paragraph length is greater than the whole page
            if(currentPageTotalCharacters == 0) {
                if (!pageTexts[currentPageIndex]) {
                    pageTexts[currentPageIndex] = [];
                }

                //add in the current page array what still fits from the current paragraph
                let splittedParagraphFirstPart: textParagraph = {
                    id: textToDisplay[i].id,
                    content: textToDisplay[i].content.slice(0, charactersPerPage - currentPageTotalCharacters)
                }
                pageTexts[currentPageIndex].push(splittedParagraphFirstPart);
                currentPageTotalCharacters += charactersPerPage;

                let splittedParagraphSecondPart: textParagraph = {
                    id: textToDisplay[i].id,
                    content: textToDisplay[i].content.slice(currentPageTotalCharacters, textToDisplay[i].content.length)
                }
                
                textToDisplay[i] = splittedParagraphSecondPart;
            }
            currentPageIndex++;
            currentPageTotalCharacters = 0;
            i--; //the paragraph was not yet assigned to a page
        }
    }
    pageTexts = addLastPage(pageTexts);
    //console.log("pageTexts: ", pageTexts)
    return pageTexts;
};
