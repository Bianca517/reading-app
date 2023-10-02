package booksapp.root.models;

public class GlobalConstants {
    public final static String USERS_COLLECTION_NAME = "users";
    public final static String PASSWORD_FIELD_NAME = "password";
    public final static String EMAIL_ADDRESS_FIELD_NAME = "emailAddress";
    public final static String SALT_FIELD_NAME = "salt";
    public final static String USERNAME_FIELD_NAME = "userName";
    public final static int EMAIL_ALREADY_USED_ERROR_CODE = 3;
    public final static int PASSWORD_NOT_MEETING_CRITERIA_ERROR_CODE = 2;
    public final static int EMAIL_NOT_MEETING_CRITERIA_ERROR_CODE = 1;
    public final static int USER_LOGGED_IN = 0;
    public final static int PASSWORDS_DO_NOT_MATCH = 1;
    public final static int EMAIL_DOES_NOT_EXIST = 2;
}
