package booksapp.root.controllers;

import booksapp.root.models.GlobalConstants;
import booksapp.root.models.User;
import booksapp.root.services.userRegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        // Check if all required fields are present in the user object
        if(user.getUserName() == null || user.getEmailAddress() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Incomplete user data");
        }

        System.out.println("in controller");
        System.out.println(user);

        return switch (userRegisterService.saveUser(user)) {
            case GlobalConstants.EMAIL_NOT_MEETING_CRITERIA_ERROR_CODE ->
                    ResponseEntity.status(HttpStatus.CREATED).body("Email has wrong format!");
            case GlobalConstants.PASSWORD_NOT_MEETING_CRITERIA_ERROR_CODE ->
                    ResponseEntity.status(HttpStatus.CREATED).body("Password does not meet criteria!");
            case GlobalConstants.EMAIL_ALREADY_USED_ERROR_CODE ->
                    ResponseEntity.status(HttpStatus.CREATED).body("Email already exists!");
            default -> ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully! :)");
        };
    }
}
