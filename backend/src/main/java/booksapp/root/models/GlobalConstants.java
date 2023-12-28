package booksapp.root.models;

import java.lang.reflect.Array;
import java.util.ArrayList;

public class GlobalConstants {
        public final static String USERS_COLLECTION_NAME = "users";
        public final static String BOOKS_COLLECTION_NAME = "books";
        public final static String[] BOOK_COLLECTION_FIELDS = { "id", "name", "authorUsername", "chapters", "cover",
                        "readers",
                        "genre" };
        public final static String[] USERS_COLLECTION_FIELDS = { "userName", "password", "salt", "emailAddress",
                        "interests", "currentReadings", "finalizedReadings", "plannedBooks" };
        public final static String FIREBASE_STORAGE_COVERS_FOLDER = "book_covers";
        public final static int EMAIL_ALREADY_USED_ERROR_CODE = 3;
        public final static int PASSWORD_NOT_MEETING_CRITERIA_ERROR_CODE = 2;
        public final static int EMAIL_NOT_MEETING_CRITERIA_ERROR_CODE = 1;
        public final static int USER_LOGGED_IN = 0;
        public final static int PASSWORDS_DO_NOT_MATCH = 1;
        public final static int EMAIL_DOES_NOT_EXIST = 2;
        public final static int DISPLAYED_BOOKS_IN_HOME_SCREEN = 20;
}
