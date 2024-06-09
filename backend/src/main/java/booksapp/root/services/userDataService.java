package booksapp.root.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;

import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.models.GlobalConstants.UserCollectionFields;

@Service
public class userDataService {
        private Firestore DB;
    private final CollectionReference userCollectionDB;

    @Autowired // this is how dependency injection works
    public userDataService(Firestore firestore) {
        this.DB = firestore;
        userCollectionDB = DB.collection(GlobalConstants.USERS_COLLECTION_NAME);  
    }

    public String getUsernameByUserId(String userId) {
        DocumentSnapshot userDoc;
        String username = null;
        try {
            userDoc = userCollectionDB.document(userId).get().get();
            if (userDoc.exists()) {
                username = userDoc.getString(UserCollectionFields.USERNAME.getFieldName());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return username;
    }
    
}


