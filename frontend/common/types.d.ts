
export type ResponseType = {
        success: boolean;
        message: string;
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

export type booKDTO = {
    name: string;
    authorUsername: string;
    id: string;
}

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
        "authorUsername": string
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
