package booksapp.root.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import booksapp.root.services.booksService;
import booksapp.root.services.userReadingService;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping
public class userReadingController {
    private final userReadingService userReadingService;

    @Autowired // Inject the service dependency
    public userReadingController(userReadingService userReadingService) {
        this.userReadingService = userReadingService;
    }

    @GetMapping(value = "/getuserinterests")
    public String getUserBookInterests() throws ExecutionException, InterruptedException {
        ArrayList<String> userInterests = this.userReadingService.getUsersGeneresInterests("4zgcWtT9c3RSy5FpFI18");
        return userInterests.toString();
    }

    @GetMapping(value = "/getusercurrentreadings")
    public String getUserCurrentReadings() throws ExecutionException, InterruptedException {
        ArrayList<HashMap<String, String>> books = this.userReadingService
                .getUserCurrentReadings("4zgcWtT9c3RSy5FpFI18");
        Gson gson = new Gson();
        String gsonData = gson.toJson(books);
        return gsonData;
    }

    @GetMapping(value = "/getusersfinalizedreadings")
    public String getUserFinalizedReadings() throws ExecutionException, InterruptedException {
        System.out.println("in backend");
        ArrayList<HashMap<String, String>> books = this.userReadingService
                .getUserFinalizedReadings("4zgcWtT9c3RSy5FpFI18");
        Gson gson = new Gson();
        String gsonData = gson.toJson(books);
        return gsonData;
    }

    @GetMapping(value = "/getusersplannedreadings")
    public String getUserPlannedReadings(@RequestParam String monthName) throws ExecutionException, InterruptedException {
        System.out.println("in backend");
        ArrayList<HashMap<String, String>> books = this.userReadingService
                .getUserPlannedReadingsForMonth("4zgcWtT9c3RSy5FpFI18", monthName);
        Gson gson = new Gson();
        String gsonData = gson.toJson(books);
        return gsonData;
    }

    @PostMapping(value = "/planbookformonth")
    public String planBookForMonth(@RequestParam String monthName, String bookID) throws ExecutionException, InterruptedException {
        int returnedStatus = this.userReadingService.addBookAsPlannedForMonth("4zgcWtT9c3RSy5FpFI18", monthName, bookID);
        if(returnedStatus == 0) {
            return "Successfully planned book with ID " + bookID + " for month " + monthName;
        }
        else {
            return "Could not plan book for month " + monthName;
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
    public String planBookForMonth(@RequestParam String bookID) throws ExecutionException, InterruptedException {
        int returnedStatus = this.userReadingService.addBookToLibrary("4zgcWtT9c3RSy5FpFI18", bookID);
        if(returnedStatus == 0) {
            return "Successfully added book with ID " + bookID;
        }
        else {
            return "Could not add book";
        }
    }
}
