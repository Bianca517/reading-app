package booksapp.root.services;

import booksapp.root.database.FirebaseInitialization;
import booksapp.root.models.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

//business logic
@Service
public class userService {

    private  Firestore DB;
    private  CollectionReference userCollectionDB;

    public userService() {

    }
    public String hello(){
        return "hello bee";
    }

    public void saveUser(User user) {
        this.DB = new FirebaseInitialization().getFirebase();
        this.userCollectionDB = DB.collection("users");
        Map<String, Object> userMap = user.toHashMap();
        ApiFuture<DocumentReference> addedDocRef = userCollectionDB.add(userMap);
    }

    public boolean isUserEmailOK(String userEmail) {
        CharSequence emailCharacters = "@.";
        String endingSequence = ".com";
        return userEmail.contains(emailCharacters) && userEmail.endsWith(endingSequence);
        //TO DO: regex to match email
    }
}
