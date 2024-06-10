package booksapp.root.models;

import org.springframework.web.multipart.MultipartFile;

public class BookDTO {
    private String bookTitle;
    private String authorUsername;
    private String description;
    private String bookGenre;
    private MultipartFile bookCover;

    public String getAuthorUsername() {
        return authorUsername;
    }
    public MultipartFile getBookCover() {
        return bookCover;
    }
    public String getBookGenre() {
        return bookGenre;
    }
    public String getBookTitle() {
        return bookTitle;
    }
    public String getDescription() {
        return description;
    }
    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }
    public void setBookCover(MultipartFile bookCover) {
        this.bookCover = bookCover;
    }
    public void setBookGenre(String bookGenre) {
        this.bookGenre = bookGenre;
    }
    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String toString() {
        String str = "";
        str += authorUsername + " " + bookCover + " " + bookGenre + " " + bookTitle + " " + description;
        return str;
    }
}
