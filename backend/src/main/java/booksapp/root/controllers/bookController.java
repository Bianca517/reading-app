package booksapp.root.controllers;

import booksapp.root.services.booksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.gson.JsonObject;

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
    public int getBookChapters(@RequestParam String bookID) throws InterruptedException, ExecutionException {
        System.out.println("inc ontroller");
        int bookChapters = this.booksService.getBookChapters("GRav9LLWPj6ISCOGxfVZ");
        return bookChapters;
    }


    @GetMapping(value = "/getbookchaptertitle")
    public String getBookChapterTitle(@RequestParam String bookID, int chapterNumber) throws InterruptedException, ExecutionException {
        System.out.println("inc ontroller");
        String bookChapterTitle = this.booksService.getBookChapterTitle("GRav9LLWPj6ISCOGxfVZ", chapterNumber);
        return bookChapterTitle;
    }

    @GetMapping(value = "/getbookchaptercontent")
    public String getBookChapterContent(@RequestParam String bookID, int chapterNumber) throws InterruptedException, ExecutionException {
        System.out.println("inc ontroller");
        String bookChapterContent = this.booksService.getBookChapterContent("GRav9LLWPj6ISCOGxfVZ", chapterNumber);
        return bookChapterContent;
    }


}
