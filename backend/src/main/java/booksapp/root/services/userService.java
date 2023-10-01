package booksapp.root.services;

import booksapp.root.database.FirebaseInitializer;
import booksapp.root.models.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

//business logic
@Service
public class userService {

    private Firestore DB;
    private CollectionReference userCollectionDB;
    @Autowired //this is how dependency injection works
    public userService(Firestore firestore) {
        this.DB = firestore;
        userCollectionDB = DB.collection("users");
    }
    public String hello(){
        return "hello bee";
    }

    public boolean saveUser(User user) {
        Map<String, Object> userMap = user.toHashMap();
        if(this.isUserEmailOK(user.getEmailAddress()) && this.isUserPasswordOK(user.getPassword())){
            ApiFuture<DocumentReference> addedDocRef = userCollectionDB.add(userMap);
            System.out.println("tot ok");
            return true;
        }
        return false;
    }

    public boolean isUserEmailOK(String userEmail) {
        CharSequence emailCharacters = "@.";
        String endingSequence = ".com";
        return userEmail.contains(emailCharacters) && userEmail.endsWith(endingSequence);
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
                (passwordContainsAny(userPassword, cNumbers) &&
                (passwordContainsAny(userPassword, cSpecialCharacters)));
    }

    private boolean passwordContainsAny(String userPassword, String characters) {
        for (int i = 0; i < characters.length(); i++) {
            if(-1 != userPassword.indexOf(characters.charAt(i))) {
                return true;
            }
        }
        return false;
    }
}
