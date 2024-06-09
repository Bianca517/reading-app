import axios from 'axios';
import Globals from "../UI/_globals/Globals"
const UPLOAD_BOOK_COVER_ENDPOINT: string = "/bookcover="

export async function upload_book_cover(formData: FormData): Promise<void> {
    let HTTP_REQUEST: string = Globals.BACKEND_HTTP + '?' + UPLOAD_BOOK_COVER_ENDPOINT;
    
    try {
        const response = await axios.post(HTTP_REQUEST, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};