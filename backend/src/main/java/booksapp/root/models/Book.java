package booksapp.root.models;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.cloud.firestore.DocumentSnapshot;

import booksapp.root.models.bookcomponents.BookChapter;
import booksapp.root.models.bookcomponents.BookContent;

public class Book {

    private String authorUsername;
    private BookContent bookContent;
    private List<String> chaptersTitles;
    private String description;
    private String genre;
    private String name;
    private int numberOfChapters;
    private int readers;

    // Constructors

    public Book() {
    }

    public Book(String authorUsername, BookContent cali, List<String> chaptersTitles,
                String description, String genre, String name, int numberOfChapters, int readers) {
        this.authorUsername = authorUsername;
        this.bookContent = cali;
        this.chaptersTitles = chaptersTitles;
        this.description = description;
        this.genre = genre;
        this.name = name;
        this.numberOfChapters = numberOfChapters;
        this.readers = readers;
    }

    @SuppressWarnings("unchecked")
    public Book(DocumentSnapshot bookSnapshot) {
        this.authorUsername = bookSnapshot.get(GlobalConstants.BOOK_COLLECTION_FIELDS[2]).toString();

        this.bookContent = new BookContent((HashMap<String, BookChapter>)bookSnapshot.getData().get(GlobalConstants.BOOK_COLLECTION_FIELDS[4]));
   
        this.chaptersTitles = (ArrayList<String>)bookSnapshot.get(GlobalConstants.BOOK_COLLECTION_FIELDS[3]);
        this.description = bookSnapshot.get(GlobalConstants.BOOK_COLLECTION_FIELDS[9]).toString();
        this.genre = bookSnapshot.get(GlobalConstants.BOOK_COLLECTION_FIELDS[8]).toString();
        this.name = bookSnapshot.get(GlobalConstants.BOOK_COLLECTION_FIELDS[1]).toString();
        this.numberOfChapters = Integer.parseInt(bookSnapshot.get(GlobalConstants.BOOK_COLLECTION_FIELDS[5]).toString());
        this.readers = Integer.parseInt(bookSnapshot.get(GlobalConstants.BOOK_COLLECTION_FIELDS[7]).toString());
    }

    // Getters

    public String getAuthorUsername() {
        return authorUsername;
    }

    public BookContent getBookContent() {
        if(bookContent == null) {
            return new BookContent();
        }
        else {
            return bookContent;
        }
    }

    public List<String> getChaptersTitles() {
        return chaptersTitles;
    }

    public String getDescription() {
        return description;
    }

    public String getGenre() {
        return genre;
    }

    public String getName() {
        return name;
    }

    public int getNumberOfChapters() {
        return numberOfChapters;
    }

    public int getReaders() {
        return readers;
    }

    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }

    public void setBookContent(BookContent pipi) {
        this.bookContent = pipi;
    }

    public void setChaptersTitles(List<String> chaptersTitles) {
        this.chaptersTitles = chaptersTitles;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setNumberOfChapters(int numberOfChapters) {
        this.numberOfChapters = numberOfChapters;
    }

    public void setReaders(int readers) {
        this.readers = readers;
    }

    public void addChapterTitle(String title) {
        this.chaptersTitles.add(title);
    }

    public void incrementNumberOfChapters() {
        this.numberOfChapters++;
    }
}
