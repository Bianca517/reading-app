package booksapp.root.controllers;

import booksapp.root.models.GlobalConstants;
import booksapp.root.services.booksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.ExecutionException;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping
public class bookController {

    private final booksService booksService;

    @Autowired // Inject the service dependency
    public bookController(booksService booksService) {
        this.booksService = booksService;
    }

    @GetMapping(value = "/getpopularbooks")
    public String getAllPopularBooks() throws ExecutionException, InterruptedException {
        String popularBooks = this.booksService.getAllPopularBooks().toString();
        return popularBooks;
    }

    @GetMapping(value = "/getinterestingbooks")
    public String getAllBooksThatCouldInterestUser() throws InterruptedException, ExecutionException {
        String interestingBooks = this.booksService
                .getRecommendationsForUsedWithID("4zgcWtT9c3RSy5FpFI18").toString();
        return interestingBooks;
    }

    @GetMapping(value = "/addbooks")
    public String addBooks() {
        this.booksService.addBooks();
        return "added books";
    }

    @GetMapping(value = "/getbookchapters")
    public int getBookTotalNrOfChapters(@RequestParam String bookID) throws InterruptedException, ExecutionException {
        System.out.println("inc ontroller");
        int bookChapters = this.booksService.getBookChapters(bookID);
        return bookChapters;
    }


    @GetMapping(value = "/getbookchaptertitle")
    public String getBookChapterTitle(@RequestParam String bookID, int chapterNumber) throws InterruptedException, ExecutionException {
        System.out.println("inc ontroller");
        String bookChapterTitle = this.booksService.getBookChapterTitle("GRav9LLWPj6ISCOGxfVZ", chapterNumber);
        Gson gson = new Gson();
        String gsonData = gson.toJson(bookChapterTitle);
        return gsonData;
    }

    @GetMapping(value = "/getbookchaptercontent")
    public String getBookChapterContent(@RequestParam String bookID, int chapterNumber) throws InterruptedException, ExecutionException {
        System.out.println("inc ontroller");
        ArrayList<HashMap<String, Object>> bookChapterContent = this.booksService.getBookChapterContent("GRav9LLWPj6ISCOGxfVZ", chapterNumber);
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
        ArrayList<HashMap<String, Object>> paragraphComments = this.booksService.getBookParagraphComments(bookID, chapterNumber, paragraphNumber);
        Gson gson = new Gson();
        String gsonData = gson.toJson(paragraphComments);
        return gsonData;
    }


}
