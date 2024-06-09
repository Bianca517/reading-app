package booksapp.root.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import com.google.gson.JsonObject;

import booksapp.root.models.UserInterests;
import booksapp.root.services.userInterestsService;
//this class has all User Resources for the application
//API
@RestController
@RequestMapping
public class userInterestsController {
    private userInterestsService interestsService;

    @Autowired // Inject the userService dependency
    public userInterestsController(userInterestsService interestsService) {
        this.interestsService = interestsService;
    }

    @PostMapping(value = "/addinterests", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> registerUser(@RequestBody UserInterests requestedUserInterests) {
        String[] userInterestsExtracted = requestedUserInterests.getUserInterests();
        String UID = requestedUserInterests.getUserID();
        
        //System.out.println(Arrays.toString(userInterestsExtracted));
        //System.out.println(UID);

        interestsService.saveUserInterests(UID, List.of(userInterestsExtracted));

        JsonObject response = new JsonObject();
        response.addProperty("message", "User interests successfully added! :)");
        return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
    }
}
