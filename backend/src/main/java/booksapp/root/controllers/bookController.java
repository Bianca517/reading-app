package booksapp.root.controllers;

import booksapp.root.models.Book;
import booksapp.root.services.booksCommentsService;
import booksapp.root.services.booksService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public String getAllPopularBooks() throws ExecutionException, InterruptedException {
        ArrayList<HashMap<String, String>> popularBooks = this.booksService.getAllPopularBooks();
        Gson gson = new Gson();
        String gsonData = gson.toJson(popularBooks);
        return gsonData;
    }

    @GetMapping(value = "/getinterestingbooks")
    public String getAllBooksThatCouldInterestUser() throws InterruptedException, ExecutionException {
        ArrayList<HashMap<String, String>> interestingBooks = this.booksService
                .getRecommendationsForUserWithID("4zgcWtT9c3RSy5FpFI18");
        Gson gson = new Gson();
        String gsonData = gson.toJson(interestingBooks);
        return gsonData;
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
        System.out.println("inc ontroller");
        int bookChapters = this.booksService.getBookChapters(bookID);
        return bookChapters;
    }


    @GetMapping(value = "/getbookchaptertitle")
    public String getBookChapterTitle(@RequestParam String bookID, int chapterNumber) throws InterruptedException, ExecutionException {
        System.out.println("inc ontroller");
        String bookChapterTitle = this.booksService.getBookChapterTitle(bookID, chapterNumber);
        Gson gson = new Gson();
        String gsonData = gson.toJson(bookChapterTitle);
        return gsonData;
    }

    @GetMapping(value = "/getbookchaptercontent")
    public String getBookChapterContent(@RequestParam String bookID, int chapterNumber) {
        System.out.println("inc ontroller");
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
    public String getBookWithGenre(@RequestParam String genre) throws InterruptedException, ExecutionException {
        System.out.println("in controller for comments");
        ArrayList<HashMap<String, String>> booksWithSpecifiedGenre = this.booksService.getBooksWithGenre(genre);
        Gson gson = new Gson();
        String gsonData = gson.toJson(booksWithSpecifiedGenre);
        return gsonData;
    }

    @GetMapping(value = "/getbookwithname")
    public String getBookWithName(@RequestParam String name) throws InterruptedException, ExecutionException {
        System.out.println("in controller for comments");
        ArrayList<HashMap<String, String>> booksWithSpecifiedGenre = this.booksService.getBooksWithName(name);
        Gson gson = new Gson();
        String gsonData = gson.toJson(booksWithSpecifiedGenre);
        return gsonData;
    }

    @PostMapping(value = "/addnewbook")
    public String addNewBook(@RequestParam String bookTitle, String authorUsername, String description, String bookGenre) 
        throws InterruptedException, ExecutionException {
            System.out.println("in controller for addnewbooks");
            
            this.booksService.addNewBook(bookTitle, authorUsername, description, bookGenre);
            Gson gson = new Gson();
            String gsonData = gson.toJson("successfully added new book");
            return gsonData;
    }


}
