package booksapp.root.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;

import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.services.booksCommentsService;
import booksapp.root.services.userDataService;
import booksapp.root.services.userReadingService;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping
public class userReadingController {
    private final userReadingService userReadingService;
    private final userDataService userDataService;
    private final booksCommentsService bookCommentsService;
    private final List<String> monthsInYear = List.of("january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december");

    @Autowired // Inject the service dependency
    public userReadingController(userReadingService userReadingService, userDataService userDataService, booksCommentsService booksCommentsService) {
        this.userReadingService = userReadingService;
        this.userDataService = userDataService;
        this.bookCommentsService = booksCommentsService;
    }

    @GetMapping(value = "/getuserinterests")
    public String getUserBookInterests(@RequestParam String UID) throws ExecutionException, InterruptedException {
        ArrayList<String> userInterests = this.userReadingService.getUsersGeneresInterests(UID);
        return userInterests.toString();
    }

    @GetMapping(value = "/getusercurrentreadings")
    public String getUserCurrentReadings(@RequestParam String UID) throws ExecutionException, InterruptedException {
        ArrayList<HashMap<String, String>> books = this.userReadingService
                .getUserCurrentReadings(UID);
        Gson gson = new Gson();
        String gsonData = gson.toJson(books);
        return gsonData;
    }

    @GetMapping(value = "/getusersfinalizedreadings")
    public String getUserFinalizedReadings(@RequestParam String UID) {
        ArrayList<HashMap<String, String>> books = this.userReadingService.getUserFinalizedReadings(UID);
        Gson gson = new Gson();
        String gsonData = gson.toJson(books);
        return gsonData;
    }

    @GetMapping(value = "/getusersplannedreadings")
    public String getUserPlannedReadings(@RequestParam String UID, String monthName) throws ExecutionException, InterruptedException {
        System.out.println("in backend");
        ArrayList<HashMap<String, String>> books = this.userReadingService
                .getUserPlannedReadingsForMonth(UID, monthName);
        Gson gson = new Gson();
        String gsonData = gson.toJson(books);
        return gsonData;
    }

    @PostMapping(value = "/planbookformonth")
    public ResponseEntity<String> planBookForMonth(@RequestParam String UID, String monthName, String bookID)                                       throws ExecutionException, InterruptedException {
        int returnedStatus = -1;
        
        if((null != UID) && (null != monthName) && (monthsInYear.contains(monthName.toLowerCase())) && (null != bookID)) {
            returnedStatus = this.userReadingService.addBookAsPlannedForMonth(UID, monthName, bookID); 
        }
        
        if(returnedStatus == 0) {
            return new ResponseEntity<String>("Successfully planned book with ID " + bookID + " for month " + monthName, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<String>("Could not plan book for month " + monthName, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping(value = "/removebookplannedformonth")
    public String removePlannedBookForMonth(@RequestParam String monthName, String bookID) throws ExecutionException, InterruptedException {
        int returnedStatus = this.userReadingService.removeBookAsPlannedForMonth("4zgcWtT9c3RSy5FpFI18", monthName, bookID);
        if(returnedStatus == 0) {
            return "Successfully planned book with ID " + bookID + " for month " + monthName;
        }
        else {
            return "Could not plan book for month " + monthName;
        }
    }

    @PostMapping(value = "/addbooktolibrary")
    public String addBooktolibrary(@RequestParam String userID, String bookID) throws ExecutionException, InterruptedException {
        int returnedStatus = this.userReadingService.addBookToCurrentReadings(userID, bookID);
        HashMap<String, String> returnJson = new HashMap<String, String>();
        returnJson.put("status", returnedStatus == 0 ? "Successfully added book to current readings" : "Book could not be added to current readings");
        Gson gson = new Gson();
        String gsonData = gson.toJson(returnJson);
        return gsonData;
    }

    @PostMapping(value = "/addbooktofinalizedbooks")
    public String addBooktoFinalizedBooks(@RequestParam String userID, String bookID) throws ExecutionException, InterruptedException {
        int returnedStatus = this.userReadingService.addBookToFinalizedReadings(userID, bookID);
        HashMap<String, String> returnJson = new HashMap<String, String>();
        returnJson.put("status", returnedStatus == 0 ? "Successfully added book to current readings" : "Book could not be added to current readings");
        Gson gson = new Gson();
        String gsonData = gson.toJson(returnJson);
        return gsonData;
    }

    @PostMapping(value = "/addcommenttobook")
    public String addCommentToBook(@RequestParam String UID, String comment, Integer paragraphID, Integer chapterNumber, String bookID) throws ExecutionException, InterruptedException {
        String username = userDataService.getUsernameByUserId(UID);
        int returnedStatus = bookCommentsService.addNewComment(username, comment, paragraphID, chapterNumber, bookID);

        HashMap<String, Integer> returnJson = new HashMap<String, Integer>();
        returnJson.put("status", returnedStatus);
       
        Gson gson = new Gson();
        String gsonData = gson.toJson(returnJson);
        return gsonData;
    }
}
