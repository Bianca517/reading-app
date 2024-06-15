package booksapp.root.controllers;

import booksapp.root.models.BookDTO;
import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.services.writingBookService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.google.gson.JsonObject;


@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping
public class userWritingBookController {
    private final writingBookService writingBookService;

    @Autowired // Inject the service dependency
    public userWritingBookController(writingBookService bookService) {
        this.writingBookService = bookService;
    }

    //add new chapter to book with BookID
    @PostMapping(value = "/addnewchapter")
    public ResponseEntity<String> addNewChapterToBook(String chapterTitle, String bookID) {
        int responseStatus;

        if(chapterTitle != null && chapterTitle != "undefined" && bookID != null && bookID != "undefined") {
            responseStatus = this.writingBookService.addNewChapterToBook(chapterTitle, bookID);
        }
        else {
            responseStatus = GlobalConstants.STATUS_FAILED;
        }

        System.out.println("in controller, resp status e: "+ responseStatus);
        JsonObject response = new JsonObject();

        switch(responseStatus) {
            case GlobalConstants.STATUS_SUCCESSFUL:
                response.addProperty("status", Integer.toString(responseStatus));
                return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
            default:
                response.addProperty("status", Integer.toString(responseStatus));
                return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }
    
    //add new paragraph to chapter with number from book with ID
    @PostMapping(value = "/addnewparagraph")
    public ResponseEntity<String> addNewParagraphToBookChapter(Integer chapterNumber, String bookID, String paragraphContent) {
        final int responseStatus = this.writingBookService.addNewParagraphToBook(chapterNumber, bookID, paragraphContent);

        System.out.println("am ajuns in conroller cu: " + paragraphContent);
        System.out.println("serviciul zice: " + responseStatus);

        JsonObject response = new JsonObject();

        switch(responseStatus) {
            case GlobalConstants.STATUS_SUCCESSFUL:
                response.addProperty("status", Integer.toString(responseStatus));
                return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
            default:
                response.addProperty("status", Integer.toString(responseStatus));
                return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    //get all books written by user with ID
    @GetMapping(value = "/getallbooksbyuser")
    public ResponseEntity<ArrayList<BookDTO>> getAllBooksWrittenByUser(String UID) {
        ArrayList<BookDTO> booksByUser = null;
        
        if(UID != null) {
            booksByUser = this.writingBookService.getAllBooksWrittenByUser(UID);
        }


        if(booksByUser != null) {
            return new ResponseEntity<ArrayList<BookDTO>>(booksByUser, HttpStatus.OK);
        }
        else{
            return new ResponseEntity<ArrayList<BookDTO>>(booksByUser, HttpStatus.BAD_REQUEST);
        }
    }

    //get all book chapters
    @GetMapping(value = "/getallchaptersofbook")
    public ResponseEntity<String> getAllChaptersOfBook(String bookID) {
        final List<String> allChaptersOfBook = this.writingBookService.getAllChaptersOfBook(bookID);

        Gson gson = new Gson();
        String bookChaptersJSON = gson.toJson(allChaptersOfBook);

        JsonObject response = new JsonObject();

        if(allChaptersOfBook != null) {
            response.addProperty("success", GlobalConstants.STATUS_SUCCESSFUL);
            response.addProperty("message", bookChaptersJSON);
            return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
        }
        else{
            response.addProperty("success", GlobalConstants.STATUS_FAILED);
            response.addProperty("message", "");
            return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }

     //add new list of paragraphs to chapter with number from book with ID
     @PostMapping(value = "/addnewchaptercontent")
     public ResponseEntity<String> addNewListOfParagraphsToBookChapter(Integer chapterNumber, String bookID, String chapterContent) {
         int responseStatus = -1;

         System.out.println("in fucking controller\n");
         System.out.println(chapterContent);
         
         if(chapterNumber != null && bookID != null && bookID != "undefined" && chapterContent != null && chapterContent != "undefined") {
            responseStatus = this.writingBookService.addListOfParagraphsToBook(chapterNumber, bookID, chapterContent);
         }
         JsonObject response = new JsonObject();
 
         switch(responseStatus) {
             case GlobalConstants.STATUS_SUCCESSFUL:
                 response.addProperty("status", Integer.toString(responseStatus));
                 return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
             default:
                 response.addProperty("status", Integer.toString(responseStatus));
                 return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
         }
     }

    @PostMapping(value = "/addnewbook")
    public ResponseEntity<String> addNewBook( String bookTitle, String authorUsername, String description, String bookGenre) {
        System.out.println("in controller for addnewbook, am primit\n");
        System.out.println(bookTitle);
 
        List<String> serviceResponse = this.writingBookService.addNewBook(bookTitle, authorUsername, description, bookGenre);
        Integer status = Integer.parseInt(serviceResponse.get(0));
        String newBookId = serviceResponse.get(1);


        JsonObject response = new JsonObject();
        if(status == GlobalConstants.STATUS_SUCCESSFUL) {
            response.addProperty("status", Integer.toString(status));
            response.addProperty("id", newBookId);
            return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
        }
        else {
            response.addProperty("status", Integer.toString(status));
            response.addProperty("id", "");
            return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/uploadbookcover", method = RequestMethod.POST, consumes = {"multipart/form-data"})
    public ResponseEntity<String> uploadBookCover(@RequestParam String bookTitle, @RequestParam String bookAuthor, @RequestPart MultipartFile bookCoverImage){
        System.out.println("in controller for upload cover, am primit\n");
        System.out.println(bookCoverImage.getOriginalFilename()); // Print the file name
        System.out.println(bookCoverImage.toString());
        System.out.println(bookTitle + " | " + bookAuthor);
        
        int status = this.writingBookService.uploadBookCoverToStorage(bookTitle, bookAuthor, bookCoverImage);
        
        JsonObject response = new JsonObject();
        if(status == GlobalConstants.STATUS_SUCCESSFUL) {
            response.addProperty("status", Integer.toString(status));
            return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
        }
        else {
            response.addProperty("status", Integer.toString(status));
            return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/uploadsong", method = RequestMethod.POST, consumes = {"multipart/form-data"})
    public ResponseEntity<String> uploadSong(@RequestParam String bookID, @RequestParam String chapterNumber, @RequestPart MultipartFile songUri){
        System.out.println("in controller for upload song, am primit\n");
        System.out.println(songUri.getOriginalFilename()); // Print the file name
        System.out.println(songUri.toString());
        System.out.println(bookID + " | " + chapterNumber);
        
        int status = GlobalConstants.STATUS_FAILED;
        
        if(songUri != null && bookID != null && bookID.length() > 0 && chapterNumber != null) {
            status = this.writingBookService.uploadSongToStorage(bookID, chapterNumber, songUri);
        }

        JsonObject response = new JsonObject();
        if(status == GlobalConstants.STATUS_SUCCESSFUL) {
            response.addProperty("status", Integer.toString(status));
            return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
        }
        else {
            response.addProperty("status", Integer.toString(status));
            return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping(value= "/setfinished")
    public ResponseEntity<String> setBookFinished(@RequestParam String bookID, @RequestParam Boolean isFinished) {
        int status = GlobalConstants.STATUS_FAILED;

        if(bookID != null) {
            status = this.writingBookService.setBookFinished(bookID, isFinished);
        }

        JsonObject response = new JsonObject();
        if(status == GlobalConstants.STATUS_SUCCESSFUL) {
            response.addProperty("status", Integer.toString(status));
            return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
        }
        else {
            response.addProperty("status", Integer.toString(status));
            return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value= "/getisfinished")
    public ResponseEntity<String> getIsBookFinished(@RequestParam String bookID) {
        int status = GlobalConstants.STATUS_FAILED;
        int isFinished = 0;

        if(bookID != null) {
            ArrayList<Integer> returnedStatus = this.writingBookService.getIsBookFinished(bookID);
            status = returnedStatus.get(0);
            isFinished = returnedStatus.get(1);
        }

        JsonObject response = new JsonObject();
        if(status == GlobalConstants.STATUS_SUCCESSFUL) {
            response.addProperty("status", Integer.toString(status));
            response.addProperty("isFinished", Integer.toString(isFinished));
            return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
        }
        else {
            response.addProperty("status", Integer.toString(status));
            response.addProperty("isFinished", Integer.toString(isFinished));
            return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }

}
