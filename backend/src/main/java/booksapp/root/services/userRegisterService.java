package booksapp.root.services;

import booksapp.root.models.GlobalConstants;
import booksapp.root.models.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

//business logic
@Service
public class userRegisterService {
    private Firestore DB;
    private final CollectionReference userCollectionDB;

    @Autowired // this is how dependency injection works
    public userRegisterService(Firestore firestore) {
        this.DB = firestore;
        userCollectionDB = DB.collection(GlobalConstants.USERS_COLLECTION_NAME);
    }

    public String hello() {
        return "hello bee";
    }

    public int saveUser(User user) {
        final String salt = BCrypt.gensalt();
        user.setSalt(salt);
        Map<String, Object> userMap = user.toHashMap();

        if (!this.isUserEmailOK(user.getEmailAddress())) {
            return GlobalConstants.EMAIL_NOT_MEETING_CRITERIA_ERROR_CODE;
        } else if (!this.isUserPasswordOK(user.getPassword())) {
            return GlobalConstants.PASSWORD_NOT_MEETING_CRITERIA_ERROR_CODE;
        } else if (this.emailAlreadyExistsInDB(user.getEmailAddress())) {
            return GlobalConstants.EMAIL_ALREADY_USED_ERROR_CODE;
        } else {
            user.setPassword(BCrypt.hashpw(user.getPassword(), salt));

            userMap.put(GlobalConstants.USERS_COLLECTION_FIELDS[1], user.getPassword());

            ApiFuture<DocumentReference> addedDocRef = userCollectionDB.add(userMap);

            return 0;
        }
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

    private boolean emailAlreadyExistsInDB(String userEmail) {
        // asynchronously retrieve multiple documents
        ApiFuture<QuerySnapshot> usersWithSameEmailQuery = userCollectionDB
                .whereEqualTo(GlobalConstants.EMAIL_ADDRESS_FIELD_NAME, userEmail).get();

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
                .whereEqualTo(GlobalConstants.USERNAME_FIELD_NAME, userName).get();

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
