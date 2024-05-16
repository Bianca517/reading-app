
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
