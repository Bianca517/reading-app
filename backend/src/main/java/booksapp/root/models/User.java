package booksapp.root.models;

import org.springframework.stereotype.Component;

import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.models.GlobalConstants.UserCollectionFields;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

// this is the USER model for the books-app
@Component
public class User {
    private Long id;
    private String userName;
    private String emailAddress;
    private String password;
    private String salt;
    private ArrayList<String> interests;
    private ArrayList<String> currentReadings;
    private ArrayList<String> finalizedReadings;
    private HashMap<String, ArrayList<String>> plannedBooks; //month : [array of books]

    public User() {
    }

    public User(Long id, String userName, String emailAddress, String password) {
        this.id = id;
        this.userName = userName;
        this.emailAddress = emailAddress;
        this.password = password;
        initializeArrays();
    }

    public User(String userName, String emailAddress, String password) {
        this.userName = userName;
        this.emailAddress = emailAddress;
        this.password = password;
        initializeArrays();
    }

    public User(String emailAddress, String password) {
        this.emailAddress = emailAddress;
        this.password = password;
        initializeArrays();
    }

    private void initializeArrays() {
        this.interests = new ArrayList<String>();
        this.currentReadings = new ArrayList<String>();
        this.finalizedReadings = new ArrayList<String>();
        this.plannedBooks = new HashMap<String, ArrayList<String>>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    @Override
    public String toString() {
        return "user{" +
                "id=" + id +
                ", userName='" + userName + '\'' +
                ", emailAddress='" + emailAddress + '\'' +
                ", password='" + password + '\'' +
                '}';
    }

    public Map<String, Object> toHashMap() {
        Map<String, Object> dictionary = new HashMap<>();
        dictionary.put(UserCollectionFields.USERNAME.getFieldName(), this.userName);
        dictionary.put(UserCollectionFields.EMAIL.getFieldName(), this.emailAddress);
        dictionary.put(UserCollectionFields.PASSWORD.getFieldName(), this.password);
        dictionary.put(UserCollectionFields.SALT.getFieldName(), this.salt);
        return dictionary;
    }

    public ArrayList<String> getCurrentReadings() {
        return currentReadings;
    }

    public ArrayList<String> getFinalizedReadings() {
        return finalizedReadings;
    }

    public ArrayList<String> getInterests() {
        return interests;
    }

    public HashMap<String, ArrayList<String>> getPlannedBooks() {
        return plannedBooks;
    }

    public void setCurrentReadings(ArrayList<String> currentReadings) {
        this.currentReadings = currentReadings;
    }

    public void setFinalizedReadings(ArrayList<String> finalizedReadings) {
        this.finalizedReadings = finalizedReadings;
    }

    public void setInterests(ArrayList<String> interests) {
        this.interests = interests;
    }

    public void setPlannedBooks(HashMap<String, ArrayList<String>> plannedBooks) {
        this.plannedBooks = plannedBooks;
    }

    public void addBookAsPlannedForMonth(String bookID, String monthName) {
        ArrayList<String> alreadyPlannedBooks = plannedBooks.get(monthName);
        alreadyPlannedBooks.add(bookID);
        plannedBooks.put(monthName, alreadyPlannedBooks);
    }
}
