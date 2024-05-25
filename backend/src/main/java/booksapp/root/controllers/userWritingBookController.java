package booksapp.root.controllers;

import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.models.bookcomponents.BookChapter;
import booksapp.root.services.writingBookService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        final int responseStatus = this.writingBookService.addNewChapterToBook(chapterTitle, bookID);

        JsonObject response = new JsonObject();

        switch(responseStatus) {
            case GlobalConstants.STATUS_SUCCESSFUL:
                response.addProperty("success_code", Integer.toString(responseStatus));
                return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
            default:
                response.addProperty("success_code", Integer.toString(responseStatus));
                return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }
    
    //add new paragraph to chapter with number from book with ID
    @PostMapping(value = "/addnewparagraph")
    public ResponseEntity<String> addNewParagraphToBookChapter(Integer chapterNumber, String bookID, String paragraphContent) {
        final int responseStatus = this.writingBookService.addNewParagraphToBook(chapterNumber, bookID, paragraphContent);

        JsonObject response = new JsonObject();

        switch(responseStatus) {
            case GlobalConstants.STATUS_SUCCESSFUL:
                response.addProperty("success_code", Integer.toString(responseStatus));
                return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
            default:
                response.addProperty("success_code", Integer.toString(responseStatus));
                return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    //get all books written by user with ID
    @GetMapping(value = "/getallbooksbyuser")
    public ResponseEntity<String> getAllBooksWrittenByUser(String UID) {
        final ArrayList<HashMap<String, String>> booksByUser = this.writingBookService.getAllBooksWrittenByUser(UID);
        JsonObject response = new JsonObject();

        if(booksByUser != null) {
            response.addProperty("success_code", GlobalConstants.STATUS_SUCCESSFUL);
            response.addProperty("data", booksByUser.toString());
            return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
        }
        else{
            response.addProperty("success_code", GlobalConstants.STATUS_FAILED);
            return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    //get all book chapters
    @GetMapping(value = "/getallchaptersofbook")
    public ResponseEntity<String> getAllChaptersOfBook(String bookID) {
        final List<String> allChaptersOfBook = this.writingBookService.getAllChaptersOfBook(bookID);
        JsonObject response = new JsonObject();

        if(allChaptersOfBook != null) {
            response.addProperty("success_code", GlobalConstants.STATUS_SUCCESSFUL);
            response.addProperty("data", allChaptersOfBook.toString());
            return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
        }
        else{
            response.addProperty("success_code", GlobalConstants.STATUS_FAILED);
            return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }
}
