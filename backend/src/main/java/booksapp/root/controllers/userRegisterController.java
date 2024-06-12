package booksapp.root.controllers;

import booksapp.root.models.User;
import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.services.userRegisterService;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.gson.JsonObject;

//this class has all User Resources for the application
//API
@RestController
@RequestMapping
public class userRegisterController {
    private final userRegisterService userRegisterService;

    @Autowired // Inject the userService dependency
    public userRegisterController(userRegisterService userRegisterService) {
        this.userRegisterService = userRegisterService;
    }

    @GetMapping("hello")
    public String hello() {
        return userRegisterService.hello();
    }

    @PostMapping(value = "/register")
    public ResponseEntity<String> registerUser(@RequestParam String emailAddress, @RequestParam String password, @RequestParam String userName) {
        // Check if all required fields are present in the user object
        if ((userName == null) || (emailAddress == null) || (password == null)) {
            return ResponseEntity.badRequest().body("Incomplete user data");
        }

        ArrayList<String> registerStatus = userRegisterService.saveUser(emailAddress, password, userName, false);
        
        int errorCode = Integer.valueOf(registerStatus.get(0));
        String UID = registerStatus.get(1);

        JsonObject response = new JsonObject();

        switch (errorCode) {
            case GlobalConstants.EMAIL_NOT_MEETING_CRITERIA_ERROR_CODE:
            case GlobalConstants.PASSWORD_NOT_MEETING_CRITERIA_ERROR_CODE:
                response.addProperty("success_code", errorCode);
                response.addProperty("user_id", "");
                response.addProperty("username", "");
                return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);

            case GlobalConstants.EMAIL_OR_USERNAME_ALREADY_USED_ERROR_CODE:
                response.addProperty("success_code", errorCode);
                response.addProperty("user_id", "");
                response.addProperty("username", "");
                return new ResponseEntity<String>(response.toString(), HttpStatus.IM_USED);

            default:
                response.addProperty("success_code", GlobalConstants.USER_CREATED);
                response.addProperty("user_id", UID);
                response.addProperty("username", userName);
                return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
        }
    }
}
