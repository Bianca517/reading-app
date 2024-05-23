package booksapp.root.services;

import com.google.cloud.firestore.*;

import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.models.GlobalConstants.UserCollectionFields;

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
        userReference.update(UserCollectionFields.INTERESTS.getFieldName(), userInterests);
        System.out.println("User Interests added");
    }
}
