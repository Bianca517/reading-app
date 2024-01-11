package booksapp.root.models;

import java.lang.reflect.Array;
import java.util.ArrayList;

public class GlobalConstants {
        public final static String USERS_COLLECTION_NAME = "users";
        public final static String BOOKS_COLLECTION_NAME = "books";
        public final static String[] BOOK_COLLECTION_FIELDS = { "id", "name", "authorUsername", "chaptersTitles", 
                        "chaptersContents",
                        "numberOfChapters",
                        "cover",
                        "readers",
                        "genre",
                        "description",
                        "paragraphs",
                };
        public final static int BOOK_ID_INDEX = 0;
        public final static int BOOK_TITLE_INDEX = 1;
        public final static int BOOK_AUTHOR_INDEX = 2;
        public final static int CHAPTER_TITLE_INDEX = 3;
        public final static int CHAPTER_CONTENT_INDEX = 4;
        public final static int NUMBER_OF_CHAPTERS_INDEX = 5;
        public final static int BOOK_DESCRIPTION_INDEX = 9;
        public final static int BOOK_PARAGRAPHS_INDEX = 10;

        public final static String[] PARAGRAPH_FIELDS = {"comments", "content"};
        public final static int PARAGRAPH_CONTENT_INDEX = 1;

        public final static String[] USERS_COLLECTION_FIELDS = { "userName", "password", "salt", "emailAddress",
                        "interests", "currentReadings", "finalizedReadings", "plannedBooks" };
        public final static int USER_NAME_INDEX = 0;
        public final static int USER_PASSWORD_INDEX = 1;
        public final static int USER_SALT_INDEX = 2;
        public final static int USER_EMAIL_INDEX = 3;
        public final static int USER_INTERESTS_INDEX = 4;
        public final static int USER_CURRENT_READINGS_INDEX = 5;
        public final static int USER_FINALIZED_READINGS_INDEX = 6;
        public final static int USER_PLANNED_READINGS_INDEX = 7;
        
        public final static String FIREBASE_STORAGE_COVERS_FOLDER = "book_covers";
        public final static int EMAIL_ALREADY_USED_ERROR_CODE = 3;
        public final static int PASSWORD_NOT_MEETING_CRITERIA_ERROR_CODE = 2;
        public final static int EMAIL_NOT_MEETING_CRITERIA_ERROR_CODE = 1;
        public final static int USER_LOGGED_IN = 0;
        public final static int PASSWORDS_DO_NOT_MATCH = 1;
        public final static int EMAIL_DOES_NOT_EXIST = 2;
        public final static int DISPLAYED_BOOKS_IN_HOME_SCREEN = 20;
}
