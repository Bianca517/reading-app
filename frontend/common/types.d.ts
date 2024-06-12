
export type ResponseType = {
        success: boolean;
        message: string;
}

export type ResponseTypeRetrieveBooks = {
    status: number;
    books: bookInLibrary[];
}

export type ResponseTypePOST = {
        status: number;
    }

export type UserAuthenticationResponseType = {
    HttpStatus: number;
    Data: {
        success_code: number;
        user_id: string;
        username: string
    }
}

export type GetIsFinishedResponseType = { 
    status: number;
    isFinished: number;
}

export type textParagraph = {
        id: string;
        content: string;
}

export type bookDTO = {
    bookTitle: string;
    authorUsername: string;
    bookID: string;
    numberOfChapters: number;
}

export type UserPositions = { 
    [key: string]: string 
};

export type NavigationParameters = {
    "Reading Screen":
    { 
        "id" : string, 
        "chapterNumber" : number, 
        "bookCoverImage" : string, 
        "name": string, 
        "authorUsername": string
    };

    "Prologue":
    { 
        "id" : string, 
        "chapterNumber" : number, 
        "bookCoverImage" : string, 
        "name": string, 
        "authorUsername": string,
        "numberOfChapters": number
    };

    "Continue Writing": {
        "bookID": string
    };

    "Write New Chapter": {
        "bookID": string,
        "numberOfChapters": number
    };

    "Home": {
        
    };

    "Write a Book": {
        
    }
}
