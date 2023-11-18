package booksapp.root.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import booksapp.root.services.booksService;
import booksapp.root.services.userReadingService;

@CrossOrigin(origins = "http://192.168.1.236:8080")
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
        HashMap<String, ArrayList<String>> books = this.userReadingService
                .getUserCurrentReadings("4zgcWtT9c3RSy5FpFI18");
        return books.toString();
    }

    @GetMapping(value = "/getusersfinalizedreadings")
    public String getUserFinalizedReadings() throws ExecutionException, InterruptedException {
        HashMap<String, ArrayList<String>> books = this.userReadingService
                .getUserFinalizedReadings("4zgcWtT9c3RSy5FpFI18");
        return books.toString();
    }
}
