package booksapp.root.services;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;

import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.models.GlobalConstants.UserCollectionFields;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class userLoginService {
    private Firestore DB;
    private final CollectionReference userCollectionDB;

    @Autowired // this is how dependency injection works
    public userLoginService(Firestore firestore) {
        this.DB = firestore;
        userCollectionDB = DB.collection(GlobalConstants.USERS_COLLECTION_NAME);

        // Initialize Firebase Authentication and get a reference to the service
         
    }

    
    public ArrayList<String> loginUserWithEmail(String userEmail, String userPassword) {
        DocumentSnapshot userStoredInDB = searchForExistingUserWithEmailInDB(userEmail);
        int returnedCode;
        String UID = "";
        String username = "";

        ArrayList<String> returnedList = new ArrayList<String>();
        
        if (null != userStoredInDB) {
            UID = userStoredInDB.getId();
            username = userStoredInDB.getString(UserCollectionFields.USERNAME.getFieldName());
            String userPasswordInDB = (String) userStoredInDB.get(UserCollectionFields.PASSWORD.getFieldName());
            String userSalt = (String) userStoredInDB.get(UserCollectionFields.SALT.getFieldName());

            // check if passwords match
            assert userPasswordInDB != null;
            boolean match = BCrypt.checkpw(userPassword, userPasswordInDB);

            if (match) {
                System.out.println("user logged in");
                returnedCode = GlobalConstants.USER_LOGGED_IN;
            } else {
                returnedCode = GlobalConstants.PASSWORDS_DO_NOT_MATCH;
            }
        } else {
            returnedCode = GlobalConstants.EMAIL_DOES_NOT_EXIST;
        }

        returnedList.add(Integer.toString(returnedCode));
        returnedList.add(UID);
        returnedList.add(username);
        return returnedList;
    }

    public DocumentSnapshot searchForExistingUserWithEmailInDB(String userEmail) {
        // asynchronously retrieve multiple documents
        ApiFuture<QuerySnapshot> usersWithSameEmailQuery = userCollectionDB
                .whereEqualTo(UserCollectionFields.EMAIL.getFieldName(), userEmail).get();

        try {
            List<QueryDocumentSnapshot> usersWithSameEmailQueryResult = usersWithSameEmailQuery.get().getDocuments();

            for (DocumentSnapshot userDocument : usersWithSameEmailQueryResult) {
                return userDocument; // should be only one
            }
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
        return null;
    }
    


}
