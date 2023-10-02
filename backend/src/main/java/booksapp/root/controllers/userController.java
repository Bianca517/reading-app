package booksapp.root.controllers;

import booksapp.root.models.User;
import booksapp.root.services.userService;
import com.google.firebase.auth.hash.Bcrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

//this class has all User Resources for the application
//API
@RestController
@RequestMapping
public class userController {
    private final userService UserService;

    @Autowired // Inject the userService dependency
    public userController(userService userService) {
        this.UserService = userService;
    }

    @GetMapping("hello")
    public String hello() {
      return UserService.hello();
    }

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        // Check if all required fields are present in the user object
        if(user.getUserName() == null || user.getEmailAddress() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Incomplete user data");
        }

        System.out.println("in controller");
        System.out.println(user);

        if(!UserService.saveUser(user)) {
            return ResponseEntity.badRequest().body("Email or password not OK");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }
}
