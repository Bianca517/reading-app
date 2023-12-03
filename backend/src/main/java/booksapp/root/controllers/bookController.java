package booksapp.root.controllers;

import booksapp.root.services.booksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@CrossOrigin(origins = "http://192.168.1.236:8080")
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
}
