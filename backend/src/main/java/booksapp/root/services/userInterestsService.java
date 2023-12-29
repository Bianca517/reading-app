package booksapp.root.services;

import booksapp.root.models.GlobalConstants;
import com.google.cloud.firestore.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class userInterestsService {
    private Firestore DB;
    private final CollectionReference userCollectionDB;

    @Autowired // this is how dependency injection works
    public userInterestsService(Firestore firestore) {
        this.DB = firestore;
        userCollectionDB = DB.collection(GlobalConstants.USERS_COLLECTION_NAME);
    }

    public void saveUserInterests(String userID, List<String> userInterests) {
        DocumentReference userReference = userCollectionDB.document(userID);
        userReference.update(GlobalConstants.USERS_COLLECTION_FIELDS[4], userInterests);
        System.out.println("User Interests added");
    }
}
