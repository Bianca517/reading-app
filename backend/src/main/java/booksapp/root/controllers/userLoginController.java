package booksapp.root.controllers;

import booksapp.root.models.User;
import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.services.userLoginService;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.google.gson.JsonObject;


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

        ArrayList<String> loginStatus = this.userLoginService.loginUserWithEmail(emailAddress, password);
        int loginStatusCode = Integer.valueOf(loginStatus.get(0));
        String UID = loginStatus.get(1);

        System.out.println("aici");
        System.out.println(emailAddress + " " + password);

        JsonObject response = new JsonObject();
        switch (loginStatusCode) {
            case GlobalConstants.EMAIL_DOES_NOT_EXIST:
                response.addProperty("success_code", GlobalConstants.EMAIL_DOES_NOT_EXIST);
                response.addProperty("user_id", "");
                //System.out.println("raspuns " + response);
                return new ResponseEntity<String>(response.toString(), HttpStatus.NOT_FOUND);
            case GlobalConstants.PASSWORDS_DO_NOT_MATCH:
                response.addProperty("success_code", GlobalConstants.PASSWORDS_DO_NOT_MATCH);
                response.addProperty("user_id", "");
                //System.out.println("raspuns " + response);
                return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
            default:
                response.addProperty("success_code", GlobalConstants.USER_LOGGED_IN);
                response.addProperty("user_id", UID);
                //System.out.println("raspuns " + response);
                return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
        }
    }
}
