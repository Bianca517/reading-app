import Globals from "../UI/_globals/Globals"
import * as FileSystem from 'expo-file-system';

const UPLOAD_BOOK_COVER_ENDPOINT: string = "/uploadbookcover"
const BOOK_TITLE_PARAMETER: string = "bookTitle="
const BOOK_AUTHOR_PARAMETER: string = "bookAuthor="

export async function upload_book_cover(bookTitle: string, bookAuthor: string, coverURI:string): Promise<number>{
    let HTTP_REQUEST: string = Globals.BACKEND_HTTP + UPLOAD_BOOK_COVER_ENDPOINT + '?'
        + BOOK_TITLE_PARAMETER + bookTitle + '&'
        + BOOK_AUTHOR_PARAMETER + bookAuthor;

    let statusToReturn: number = -1;

    try {
        const response = await FileSystem.uploadAsync(HTTP_REQUEST, coverURI, {
          fieldName: 'bookCoverImage',
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        });
        console.log("in upload image fetch");
        console.log(JSON.stringify(response, null, 4));
        let HttpStatus = response.status;
        const { status } = JSON.parse(response.body);
        console.log(HttpStatus, "ggg", status);
        statusToReturn = ((HttpStatus === 200) && (status === 0)) ? 0 : 1;

      } catch (error) {
        console.log(error);
        statusToReturn = 1;
      }
    
      return statusToReturn;
}