package booksapp.root.models;

import java.util.HashMap;

import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.firestore.QueryDocumentSnapshot;

import booksapp.root.models.GlobalConstants.BookCollectionFields;

public class BookDTO {
    private String bookTitle;
    private String authorUsername;
    private String bookID;
    private Integer numberOfChapters;

    public BookDTO() {
        this.bookTitle = "";
        this.authorUsername = "";
        this.bookID = "";
        this.numberOfChapters = 0;
    }

    public BookDTO(String bookID, String bookTitle, String authorUsername, Integer numberOfChapters) {
        this.bookTitle = bookTitle;
        this.authorUsername = authorUsername;
        this.bookID = bookID;
        this.numberOfChapters = numberOfChapters;
    }

    public BookDTO(QueryDocumentSnapshot book) {
        this.bookID = book.getId();
        this.authorUsername = book.get(BookCollectionFields.AUTHOR_USERNAME.getFieldName()).toString();
        this.bookTitle = book.get(BookCollectionFields.NAME.getFieldName()).toString();
        
        Long numberOfChaptersLong = book.getLong(BookCollectionFields.NUMBER_OF_CHAPTERS.getFieldName());
        if (numberOfChaptersLong != null) {
            this.numberOfChapters = numberOfChaptersLong.intValue();
        } else {
            this.numberOfChapters = 0;
        }
    }
    
    public String getAuthorUsername() {
        return authorUsername;
    }
    public String getBookTitle() {
        return bookTitle;
    }
    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }
    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }
    public String getBookID() {
        return bookID;
    }
    public void setBookID(String bookID) {
        this.bookID = bookID;
    }
    public Integer getNumberOfChapters() {
        return numberOfChapters;
    }
    public void setNumberOfChapters(Integer numberOfChapters) {
        this.numberOfChapters = numberOfChapters;
    }

    public String toString() {
        String str = "";
        str += authorUsername + " " + bookID  + " " + bookTitle;
        return str;
    }
    public HashMap<String, String> toHashMap() {
        HashMap<String, String> result = new HashMap<String, String>();
        result.put("authorUsername", authorUsername);
        result.put("id", bookID);
        result.put("name", bookTitle);
        return result;
    }
}
