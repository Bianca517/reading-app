package booksapp.root.controllers;

import booksapp.root.models.GlobalConstants;
import booksapp.root.models.User;
import booksapp.root.services.userRegisterService;
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

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        // Check if all required fields are present in the user object
        if((user.getUserName() == null) || (user.getEmailAddress() == null) || (user.getPassword() == null)) {
            return ResponseEntity.badRequest().body("Incomplete user data");
        }

        System.out.println("in controller");
        System.out.println(user);
        
        int registerStatus = userRegisterService.saveUser(user);
        JsonObject response = new JsonObject();
        
        switch (registerStatus) 
        {
            case GlobalConstants.EMAIL_NOT_MEETING_CRITERIA_ERROR_CODE:
                response.addProperty("message", "Email has wrong format!");
                return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        
            case GlobalConstants.PASSWORD_NOT_MEETING_CRITERIA_ERROR_CODE:
                response.addProperty("message", "Password does not meet criteria!");
                return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
            
            case GlobalConstants.EMAIL_ALREADY_USED_ERROR_CODE:
                response.addProperty("message", "An account with this email already exists!");
                return new ResponseEntity<String>(response.toString(), HttpStatus.IM_USED);

            default:
                response.addProperty("message", "User registered successfully! :)");
                return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
        }
    }
}
