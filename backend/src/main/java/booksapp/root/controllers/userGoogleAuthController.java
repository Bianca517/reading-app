package booksapp.root.controllers;

import booksapp.root.services.userGoogleAuthService;
import booksapp.root.services.userRegisterService;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.gson.JsonObject;
import booksapp.root.models.UserFromGoogleAuth;
import booksapp.root.models.GlobalConstants.GlobalConstants;

//this class has all User Resources for the application
//API
@RestController
@RequestMapping
public class userGoogleAuthController {
    private final userGoogleAuthService userGoogleAuthService;
    @Autowired // Inject the userService dependency
    public userGoogleAuthController(userGoogleAuthService userGoogleAuthService, userRegisterService userRegisterService) {
        this.userGoogleAuthService = userGoogleAuthService;
       
    }

    @PostMapping(value = "/googleauth", consumes = MediaType.APPLICATION_JSON_VALUE) 
    public ResponseEntity<String> authenticateUserWithGoogle(@RequestBody UserFromGoogleAuth UserWithEmailAndUserName) {
        String userEmail = UserWithEmailAndUserName.getEmailAddress();
        String userName = UserWithEmailAndUserName.getUserName();
        System.out.println("in backend google auth am primit: " + userEmail + " " + userName);

        ArrayList<String> authStatus = userGoogleAuthService.authUserWithGoogle(userEmail, userName);
        int returnedCode = Integer.valueOf(authStatus.get(0));
        String UID = authStatus.get(1);

        JsonObject response = new JsonObject();

        System.out.println("returnedCode: " + returnedCode);
        System.out.println("UID: " + UID);

        switch(returnedCode) {
            case GlobalConstants.USER_CREATED:
            case GlobalConstants.USER_LOGGED_IN:
                response.addProperty("success_code", returnedCode);
                response.addProperty("user_id", UID);
                return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
            default:
                response.addProperty("error", "error_code: " + returnedCode);
                return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }
}
