package booksapp.root.models;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

// this is the USER model for the books-app
@Component
public class User {
    private Long id;
    private String userName;
    private String emailAddress;
    private String password;

    public User() {
    }

    public User(Long id, String userName, String emailAddress, String password) {
        this.id = id;
        this.userName = userName;
        this.emailAddress = emailAddress;
        this.password = password;
    }

    public User(String userName, String emailAddress, String password) {
        this.userName = userName;
        this.emailAddress = emailAddress;
        this.password = password;
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
        dictionary.put("userName", this.userName);
        dictionary.put("emailAddress", this.emailAddress);
        dictionary.put("password", this.password);
        return dictionary;
    }
}
