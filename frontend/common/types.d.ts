
export type ResponseType = {
        success: boolean;
        message: string;
    }


export type UserAuthenticationResponseType = {
    HttpStatus: number;
    Data: {
        success_code: number;
        user_id: string;
    }
}

export type textParagraph = {
        id: string;
        content: string;
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
    }
}
