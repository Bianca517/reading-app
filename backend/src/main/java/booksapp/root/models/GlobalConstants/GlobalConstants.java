package booksapp.root.models.GlobalConstants;

public class GlobalConstants {
        public final static String USERS_COLLECTION_NAME = "users";
        public final static String BOOKS_COLLECTION_NAME = "books";
        public final static int BOOK_PARAGRAPHS_INDEX = 10;

        public final static String[] PARAGRAPH_FIELDS = {"comments", "content"};
        public final static int PARAGRAPH_CONTENT_INDEX = 1;
        public final static int PARAGRAPH_COMMENTS_INDEX = 0;
        
        public final static String FIREBASE_STORAGE_COVERS_FOLDER = "book_covers/";
        public final static String FIREBASE_STORAGE_AUDIOS_FOLDER = "audios/";
        public final static int EMAIL_OR_USERNAME_ALREADY_USED_ERROR_CODE = 6;
        public final static int PASSWORD_NOT_MEETING_CRITERIA_ERROR_CODE = 5;
        public final static int EMAIL_NOT_MEETING_CRITERIA_ERROR_CODE = 4;
        public final static int USER_LOGGED_IN = 0;
        public final static int PASSWORDS_DO_NOT_MATCH = 1;
        public final static int EMAIL_DOES_NOT_EXIST = 2;
        public final static int USER_CREATED = 3;
        public final static int DISPLAYED_BOOKS_IN_HOME_SCREEN = 20;

        public final static int STATUS_SUCCESSFUL = 0;
        public final static int STATUS_FAILED = 1;
}
