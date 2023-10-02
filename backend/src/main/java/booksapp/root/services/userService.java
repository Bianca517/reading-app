package booksapp.root.services;

import booksapp.root.models.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.Map;

//business logic
@Service
public class userService {

    private Firestore DB;
    private CollectionReference userCollectionDB;
    private FirebaseAuth authenticator;
    @Autowired //this is how dependency injection works
    public userService(Firestore firestore) {
        this.DB = firestore;
        userCollectionDB = DB.collection("users");
        authenticator = FirebaseAuth.getInstance();
    }
    public String hello(){
        return "hello bee";
    }

    public boolean saveUser(User user) {
        final String salt = BCrypt.gensalt();
        user.setSalt(salt);
        Map<String, Object> userMap = user.toHashMap();

        if(this.isUserEmailOK(user.getEmailAddress()) && this.isUserPasswordOK(user.getPassword())) {
            user.setPassword(BCrypt.hashpw(user.getPassword(), salt));

            userMap.put("password", user.getPassword());
          
            ApiFuture<DocumentReference> addedDocRef = userCollectionDB.add(userMap);
            return true;
        }
        return false;
    }

    public boolean isUserEmailOK(String userEmail) {
        String emailCharacters = "@.";
        for(int i = 0; i < emailCharacters.length(); i++) {
            if(-1 == (userEmail.indexOf(emailCharacters.charAt(i)))) {
                return false;
            }
        }
        return true;
        //TO DO: regex to match email
    }

    public boolean isUserPasswordOK(String userPassword) {
        //password rules:
        //- more than 7 characters
        //- contain 1 number
        //- contain 1 special character
        final int cMinPasswordLength = 7;
        final String cNumbers = "0123456789";
        final String cSpecialCharacters = "[!@#$%&*()_+=|<>?{}\\[\\]~-]";
        return (userPassword.length() > cMinPasswordLength) &&
                (givenStringContainsAny(userPassword, cNumbers) &&
                (givenStringContainsAny(userPassword, cSpecialCharacters)));
    }

    private boolean givenStringContainsAny(String givenString, String characters) {
        for (int i = 0; i < characters.length(); i++) {
            if (-1 != givenString.indexOf(characters.charAt(i))) {
                return true;
            }
        }
        return false;
    }

}
