package booksapp.root.controllers;

import booksapp.root.models.Book;
import booksapp.root.models.GlobalConstants;
import booksapp.root.services.booksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

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

    @Autowired // Inject the service dependency
    public bookController(booksService booksService) {
        this.booksService = booksService;
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

    @GetMapping(value = "/addbooks")
    public String addBooks() {
        String jsonString = "[{\"paragraphs\":[{\"comments\":[{\"readerX\":\"Nerve-wracking suspense!\"}],\"content\":\"In the shadows of a city plagued by corruption, journalist Olivia Harper uncovers a trail of dark secrets that lead to the highest echelons of power. As she races against time to expose the truth, Olivia becomes entangled in a web of danger, deception, and a conspiracy that could shake the foundations of society.\"}]},{\"paragraphs\":[{\"comments\":[{\"readerY\":\"Edge-of-your-seat thrills!\"}],\"content\":\"With every revelation, Olivia's life hangs in the balance, and the line between ally and enemy blurs. 'Shattered Reality' is a relentless thriller that will keep you guessing until the final page, where the shocking truth emerges from the depths of a sinister labyrinth.\"}]},{\"paragraphs\":[{\"comments\":[{\"readerZ\":\"A rollercoaster of twists!\"}],\"content\":\"As the cityscape becomes a playground for power-hungry puppeteers, Olivia must navigate the treacherous terrain of truth and deception. In 'Shattered Reality,' the clock is ticking, and every decision could be her last as she races towards an explosive climax that will redefine justice and expose the shadows that lurk in plain sight.\"}]}]";

    List<Map<String, Object>> chaptersContents = convertChaptersContents(jsonString);
    List<String> chaptersTitles = List.of("Web of Deceit", "City of Shadows", "Dangerous Pursuit", "Final Revelation", "Shattered Reality");

    Book thrillerBook2 = new Book("thriller_author_78", chaptersContents, chaptersTitles,
            "Embark on a thrilling journey...", "Thriller", "Shattered Reality", 5, 0);

    this.booksService.addBooks(thrillerBook2);
    return "added thriller book 2";
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
    public String getBookChapterContent(@RequestParam String bookID, int chapterNumber) throws InterruptedException, ExecutionException {
        System.out.println("inc ontroller");
        ArrayList<HashMap<String, Object>> bookChapterContent = this.booksService.getBookChapterContent(bookID, chapterNumber);
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
