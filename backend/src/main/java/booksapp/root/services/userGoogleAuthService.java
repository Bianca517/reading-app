package booksapp.root.services;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;

import booksapp.root.models.GlobalConstants;
import booksapp.root.models.User;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

@Service
public class userGoogleAuthService {
    private final userLoginService userLoginService;
    private final userRegisterService userRegisterService;

    public userGoogleAuthService(userLoginService userLoginService, userRegisterService userRegisterService) {
        this.userLoginService = userLoginService;
        this.userRegisterService = userRegisterService;
    }

    //use Firebase Admin to verify the Google ID token
    //returns the decoded token, which contains information about the user, including the UID
    public FirebaseToken verifyGoogleIdToken(String idToken) throws FirebaseAuthException {
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
        return decodedToken;
    }

    //This method takes the decoded token as input and returns the user's UID extracted from the token
    public String getUserUidFromToken(FirebaseToken decodedToken) {
        return decodedToken.getUid();
    }

    public ArrayList<String> authUserWithGoogle(String userEmail, String userName) {
        String returnedCode = "-1";
        String UID = "";
        ArrayList<String> returnedList = new ArrayList<String>();

        //check if email is already registered. if email is already registered => log in
        DocumentSnapshot user = this.userLoginService.searchForExistingUserWithEmailInDB(userEmail);
        if(null != user) {
            UID = user.getId();
            returnedCode = Integer.toString(GlobalConstants.USER_LOGGED_IN);
        }
        //else, create new account
        else {
            final User newUser = new User(userName, userEmail, "");
            
            ArrayList<String> registerStatus = this.userRegisterService.saveUser(newUser, true);
            returnedCode = registerStatus.get(0);
            UID = registerStatus.get(1);
        }

        returnedList.add(returnedCode);
        returnedList.add(UID);
        return returnedList;
    }
}
