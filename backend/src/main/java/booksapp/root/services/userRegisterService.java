package booksapp.root.services;

import booksapp.root.database.FirebaseInitializer;
import booksapp.root.models.User;
import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.models.GlobalConstants.UserCollectionFields;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.UserRecord.CreateRequest;
import org.springframework.stereotype.Service;

//business logic
@Service
public class userRegisterService {
    private Firestore DB;
    private final CollectionReference userCollectionDB;
    private FirebaseAuth auth;

    @Autowired // this is how dependency injection works
    public userRegisterService(Firestore firestore) {
        this.DB = firestore;
        userCollectionDB = DB.collection(GlobalConstants.USERS_COLLECTION_NAME);
        auth = FirebaseAuth.getInstance();
    }

    public String hello() {
        //final User user = new User("tralala@gmail.com", "Hawaii");
        CreateRequest request = new CreateRequest()
                .setEmail("email@fdklvmd.com")
                .setPassword("password");

        try {
            UserRecord userRecord = auth.createUser(request);
        } catch (FirebaseAuthException e) {
            throw new RuntimeException(e);
        }

        return "hello bee";
    }


    private Integer checkUserEmailAndPassword(String emailAddress, String password, String userName, boolean loggedInWithGoogle) {
        Integer errorCode = 0;
        if (!this.isUserEmailOK(emailAddress)) {
            errorCode = GlobalConstants.EMAIL_NOT_MEETING_CRITERIA_ERROR_CODE;
        } 
        else if (!loggedInWithGoogle && !this.isUserPasswordOK(password)) {
            //password will be null if user authenticates with google
            errorCode = GlobalConstants.PASSWORD_NOT_MEETING_CRITERIA_ERROR_CODE;
        } 
        else if (this.emailAlreadyExistsInDB(emailAddress)) {
            errorCode = GlobalConstants.EMAIL_OR_USERNAME_ALREADY_USED_ERROR_CODE;
        } 
        else if (this.userNameAlreadyExistsInDB(userName)) {
            errorCode = GlobalConstants.EMAIL_OR_USERNAME_ALREADY_USED_ERROR_CODE;
        } 

        return errorCode;
    }


    public ArrayList<String> saveUser(String emailAddress, String password, String userName, boolean loggedInWithGoogle) {
        ArrayList<String> returnList = new ArrayList<String>();

        Integer errorCode = GlobalConstants.STATUS_FAILED;
        errorCode = checkUserEmailAndPassword(emailAddress, password, userName, loggedInWithGoogle);

        String UID = "";
        if(0 == errorCode) {
            final String salt = BCrypt.gensalt();
            User user = new User(userName, emailAddress, password, salt);
            user.setPassword(BCrypt.hashpw(user.getPassword(), salt));
            errorCode = GlobalConstants.USER_CREATED;

            //save user ID
            try {
                ApiFuture<DocumentReference> addedDocRef = userCollectionDB.add(user);
                UID = addedDocRef.get().get().get().getId();
            } catch (Exception e) {
                e.printStackTrace();
            } 
        }
   

        returnList.add(errorCode.toString());
        returnList.add(UID);
        returnList.add(userName);

        return returnList;
    }

    public boolean isUserEmailOK(String userEmail) {
        String emailCharacters = "@.";
        for (int i = 0; i < emailCharacters.length(); i++) {
            if (-1 == (userEmail.indexOf(emailCharacters.charAt(i)))) {
                return false;
            }
        }
        return true;
        // TO DO: regex to match email
    }

    public boolean isUserPasswordOK(String userPassword) {
        // password rules:
        // - more than 7 characters
        // - contain 1 number
        // - contain 1 special character
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

    public boolean emailAlreadyExistsInDB(String userEmail) {
        // asynchronously retrieve multiple documents
        ApiFuture<QuerySnapshot> usersWithSameEmailQuery = userCollectionDB
                .whereEqualTo(UserCollectionFields.EMAIL.getFieldName(), userEmail).get();

        try {
            List<QueryDocumentSnapshot> usersWithSameEmailQueryResult = usersWithSameEmailQuery.get().getDocuments();
            if (usersWithSameEmailQueryResult.isEmpty()) {
                return false;
            }
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
        return true;
    }

    private boolean userNameAlreadyExistsInDB(String userName) {
        // asynchronously retrieve multiple documents
        ApiFuture<QuerySnapshot> usersWithSameUsernameQuery = userCollectionDB
                .whereEqualTo(UserCollectionFields.USERNAME.getFieldName(), userName).get();

        try {
            List<QueryDocumentSnapshot> usersWithSameUsernameQueryResult = usersWithSameUsernameQuery.get()
                    .getDocuments();
            if (usersWithSameUsernameQueryResult.isEmpty()) {
                return false;
            }
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
        return true;
    }

}
