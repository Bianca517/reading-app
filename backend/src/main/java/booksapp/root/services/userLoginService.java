package booksapp.root.services;

import booksapp.root.models.GlobalConstants;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class userLoginService {
    private Firestore DB;
    private final CollectionReference userCollectionDB;

    @Autowired //this is how dependency injection works
    public userLoginService(Firestore firestore) {
        this.DB = firestore;
        userCollectionDB = DB.collection(GlobalConstants.USERS_COLLECTION_NAME);
    }

    public int loginUserWithEmail(String userEmail, String userPassword) {
        DocumentSnapshot userStoredInDB = searchForExistingUserWithEmailInDB(userEmail);

        if(null != userStoredInDB) {
            String userPasswordInDB = (String) userStoredInDB.get(GlobalConstants.PASSWORD_FIELD_NAME);
            String userSalt = (String) userStoredInDB.get(GlobalConstants.SALT_FIELD_NAME);

            //check if passwords match
            assert userPasswordInDB != null;
            boolean match = BCrypt.checkpw(userPassword, userPasswordInDB);

            if (match) {
                return GlobalConstants.USER_LOGGED_IN;
            }
            else {
                return GlobalConstants.PASSWORDS_DO_NOT_MATCH;
            }
        }
        return GlobalConstants.EMAIL_DOES_NOT_EXIST;
    }

    public DocumentSnapshot searchForExistingUserWithEmailInDB(String userEmail) {
        // asynchronously retrieve multiple documents
        ApiFuture<QuerySnapshot> usersWithSameEmailQuery = userCollectionDB.whereEqualTo(GlobalConstants.EMAIL_ADDRESS_FIELD_NAME, userEmail).get();

        try {
            List<QueryDocumentSnapshot> usersWithSameEmailQueryResult = usersWithSameEmailQuery.get().getDocuments();

            for (DocumentSnapshot userDocument : usersWithSameEmailQueryResult) {
                return userDocument; //should be only one
            }
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
        return null;
    }
}
