package booksapp.root.controllers;

import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.services.writingBookService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.gson.JsonObject;


@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping
public class userWritingBookController {
    private final writingBookService bookService;

    @Autowired // Inject the service dependency
    public userWritingBookController(writingBookService bookService) {
        this.bookService = bookService;
    }

    //add new chapter to book with BookID
    @PostMapping(value = "/addnewchapter")
    public ResponseEntity<String> addNewChapterToBook(String chapterTitle, String bookID) {
        final int responseStatus = this.bookService.addNewChapterToBook(chapterTitle, bookID);

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
        final int responseStatus = this.bookService.addNewParagraphToBook(chapterNumber, bookID, paragraphContent);

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
}
