package booksapp.root.controllers;

import booksapp.root.models.GlobalConstants;
import booksapp.root.models.User;
import booksapp.root.services.userLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class userLoginController {
    private final userLoginService userLoginService;
    @Autowired // Inject the userService dependency
    public userLoginController(userLoginService userLoginService) {
        this.userLoginService = userLoginService;
    }

    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> loginUser(@RequestBody User user) {
        String emailAddress = user.getEmailAddress();
        String password = user.getPassword();
        int loginStatus = this.userLoginService.loginUserWithEmail(emailAddress, password);
        System.out.println("aici");
        System.out.println(emailAddress + " " + password);
        return switch (loginStatus) {
            case GlobalConstants.EMAIL_DOES_NOT_EXIST ->
                    ResponseEntity.status(HttpStatus.CREATED).body("Cannot find user with given email!");
            case GlobalConstants.PASSWORDS_DO_NOT_MATCH ->
                    ResponseEntity.status(HttpStatus.CREATED).body("Passwords do not match!");
            default -> ResponseEntity.status(HttpStatus.CREATED).body("User successfully logged in! :)");
        };
    }
}
