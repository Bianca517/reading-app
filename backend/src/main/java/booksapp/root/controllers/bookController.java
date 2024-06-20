package booksapp.root.controllers;

import booksapp.root.models.Book;
import booksapp.root.models.BookDTO;
import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.services.booksCommentsService;
import booksapp.root.services.booksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping
public class bookController {

    private final booksService booksService;
    private final booksCommentsService bookCommentsService;

    @Autowired // Inject the service dependency
    public bookController(booksService booksService, booksCommentsService bookCommentsService) {
        this.booksService = booksService;
        this.bookCommentsService = bookCommentsService;
    }

    @GetMapping(value = "/getpopularbooks")
    public ResponseEntity<List<BookDTO>> getAllPopularBooks() throws ExecutionException, InterruptedException { 
        List<BookDTO> books = null;
        int status = GlobalConstants.STATUS_FAILED;
        books = this.booksService.getAllPopularBooks();

        if (books != null && !books.isEmpty()) {
            status = GlobalConstants.STATUS_SUCCESSFUL;
        }
        
        if (status == GlobalConstants.STATUS_SUCCESSFUL) {
            return new ResponseEntity<>(books, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/getinterestingbooks")
    public ResponseEntity<List<BookDTO>> getAllBooksThatCouldInterestUser(@RequestParam String UID) throws InterruptedException, ExecutionException {
        List<BookDTO> books = null;
        int status = GlobalConstants.STATUS_FAILED;

        if (UID != null) {
            books = this.booksService.getRecommendationsForUserWithID(UID);

            if (books != null && !books.isEmpty()) {
                status = GlobalConstants.STATUS_SUCCESSFUL;
            }
            else {
                System.out.println("books empty");
            }
        }
   
        if (status == GlobalConstants.STATUS_SUCCESSFUL) {
            return new ResponseEntity<>(books, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    public List<Map<String, Object>> convertChaptersContents(String jsonString) {
        ObjectMapper objectMapper = new ObjectMapper();
        List<Map<String, Object>> chaptersContents = new ArrayList<Map<String, Object>>();

        try {
            chaptersContents = objectMapper.readValue(jsonString, List.class);
            System.out.println(chaptersContents);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return chaptersContents;
    }
    
    
    @GetMapping(value = "/getbookchapters")
    public int getBookTotalNrOfChapters(@RequestParam String bookID) throws InterruptedException, ExecutionException {
        //System.out.println("inc ontroller");
        int bookChapters = this.booksService.getBookChapters(bookID);
        return bookChapters;
    }


    @GetMapping(value = "/getbookchaptertitle")
    public String getBookChapterTitle(@RequestParam String bookID, int chapterNumber) throws InterruptedException, ExecutionException {
        //System.out.println("inc ontroller");
        String bookChapterTitle = this.booksService.getBookChapterTitle(bookID, chapterNumber);
        Gson gson = new Gson();
        String gsonData = gson.toJson(bookChapterTitle);
        return gsonData;
    }

    @GetMapping(value = "/getbookchaptercontent")
    public String getBookChapterContent(@RequestParam String bookID, int chapterNumber) {
        //System.out.println("inc ontroller");
        HashMap<String, String> bookChapterContent = this.booksService.getBookChapterContent(bookID, chapterNumber);
        //bookChapterContent = bookChapterContent.substring(1, bookChapterContent.length() - 1);
        Gson gson = new Gson();
        String gsonData = gson.toJson(bookChapterContent);
        return gsonData;
    }

    @GetMapping(value = "/getbookdescription")
    public String getBookDescription(@RequestParam String bookID) throws InterruptedException, ExecutionException {
        System.out.println("in controller");
        String bookDescription = this.booksService.getBookDescription(bookID);
        Gson gson = new Gson();
        String gsonData = gson.toJson(bookDescription);
        return gsonData;
    }
    
    @GetMapping(value = "/getbookparagraphcomments")
    public String getBookParagraphComments(@RequestParam String bookID, int chapterNumber, int paragraphNumber) throws InterruptedException, ExecutionException {
        System.out.println("in controller for comments");
        HashMap<String, String> paragraphComments = this.bookCommentsService.getAllComments(paragraphNumber, chapterNumber, bookID);
        Gson gson = new Gson();
        String gsonData = gson.toJson(paragraphComments);
        return gsonData;
    }

    @GetMapping(value = "/getbookwithgenre")
    public ResponseEntity<List<BookDTO>> getBookWithGenre(@RequestParam String genre) throws InterruptedException, ExecutionException {
        List<BookDTO> books = null;
        int status = GlobalConstants.STATUS_FAILED;

        if (genre != null) {
            books = this.booksService.getBooksWithGenre(genre);

            if (books != null && !books.isEmpty()) {
                status = GlobalConstants.STATUS_SUCCESSFUL;
            }
        }
   
        if (status == GlobalConstants.STATUS_SUCCESSFUL) {
            return new ResponseEntity<>(books, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/getbookwithname")
    public ResponseEntity<List<BookDTO>> getBookWithName(@RequestParam String name) throws InterruptedException, ExecutionException {
        List<BookDTO> books = null;
        int status = GlobalConstants.STATUS_FAILED;

        if (name != null) {
            books = this.booksService.getBooksWithName(name);

            if (books != null && !books.isEmpty()) {
                status = GlobalConstants.STATUS_SUCCESSFUL;
            }
        }
   
        if (status == GlobalConstants.STATUS_SUCCESSFUL) {
            return new ResponseEntity<>(books, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

}
