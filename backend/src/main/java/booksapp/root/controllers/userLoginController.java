package booksapp.root.controllers;

import booksapp.root.models.GlobalConstants;
import booksapp.root.models.User;
import booksapp.root.services.userLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.api.client.json.Json;


@CrossOrigin(origins = "http://localhost:8080")
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

        JsonObject response = new JsonObject();
        switch (loginStatus) {
            case GlobalConstants.EMAIL_DOES_NOT_EXIST:
                response.addProperty("message", "Cannot find user with given email!");
                System.out.println("raspuns " + response);
                return new ResponseEntity<String>(response.toString(), HttpStatus.NOT_FOUND);
            case GlobalConstants.PASSWORDS_DO_NOT_MATCH:
                response.addProperty("message", "Passwords do not match!");
                System.out.println("raspuns " + response);
                return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
            default:
                response.addProperty("message", "User successfully logged in! :)");
                System.out.println("raspuns " + response);
                return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
        }
    }
}
