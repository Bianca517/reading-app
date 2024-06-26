package booksapp.root.models;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.cloud.firestore.DocumentSnapshot;

import booksapp.root.models.GlobalConstants.BookCollectionFields;
import booksapp.root.models.GlobalConstants.GlobalConstants;
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
    private boolean isFinished;

    // Constructors

    public Book() {
        this.bookContent = new BookContent();
        this.numberOfChapters = 0;
        this.readers = 0;
        this.chaptersTitles = new ArrayList<String>();
        this.isFinished = false;
    }

    public Book(String authorUsername, BookContent bookcontent, List<String> chaptersTitles,
                String description, String genre, String name, int numberOfChapters, int readers, boolean isFinished) {
        this.authorUsername = authorUsername;
        this.bookContent = bookcontent;
        this.chaptersTitles = chaptersTitles;
        this.description = description;
        this.genre = genre;
        this.name = name;
        this.numberOfChapters = numberOfChapters;
        this.readers = readers;
        this.isFinished = isFinished;
    }

    @SuppressWarnings("unchecked")
    public Book(DocumentSnapshot bookSnapshot) {
        this.authorUsername = bookSnapshot.get(BookCollectionFields.AUTHOR_USERNAME.getFieldName()).toString();

        this.bookContent = new BookContent((HashMap<String, BookChapter>)bookSnapshot.getData().get(BookCollectionFields.BOOK_CONTENT.getFieldName()));
   
        this.chaptersTitles = (ArrayList<String>)bookSnapshot.get(BookCollectionFields.CHAPTERS_TITLES.getFieldName());
        this.description = bookSnapshot.get(BookCollectionFields.DESCRIPTION.getFieldName()).toString();
        this.genre = bookSnapshot.get(BookCollectionFields.GENRE.getFieldName()).toString();
        this.name = bookSnapshot.get(BookCollectionFields.NAME.getFieldName()).toString();
        this.numberOfChapters = Integer.parseInt(bookSnapshot.get(BookCollectionFields.NUMBER_OF_CHAPTERS.getFieldName()).toString());
        this.readers = Integer.parseInt(bookSnapshot.get(BookCollectionFields.READERS.getFieldName()).toString());
        
        //different handling for is finished because it was added afterwards
        if(bookSnapshot.get(BookCollectionFields.IS_FINISHED.getFieldName()) != null) {
            this.isFinished = Boolean.parseBoolean(bookSnapshot.get(BookCollectionFields.IS_FINISHED.getFieldName()).toString());
        }
        else {
            this.isFinished = false;
        }
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

    public boolean getIsFinished() {
        return isFinished;
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

    public void setIsFinished(boolean isFinished) {
        this.isFinished = isFinished;
    }

    public void addChapterTitle(String title) {
        if(this.chaptersTitles == null) {
            this.chaptersTitles = new ArrayList<String>();
        }
        
        this.chaptersTitles.add(title);
    }

    public void incrementNumberOfChapters() {
        this.numberOfChapters++;
    }

    public void addChapter(BookChapter newChapter) {
        bookContent.addChapter(newChapter);
        this.numberOfChapters++;
    }

    public HashMap<String, String> toHashMapString(String bookID) {
        HashMap<String, String> bookFields = new HashMap<String, String>();
        // book id
        bookFields.put(BookCollectionFields.ID.getFieldName(), bookID);
        // book name
        bookFields.put(BookCollectionFields.NAME.getFieldName(), this.name);
        // book author
        bookFields.put(BookCollectionFields.AUTHOR_USERNAME.getFieldName(), this.authorUsername);
        
        return bookFields;
    }

    public String toString() {
        return "this book is: " + this.name + " by " + this.authorUsername;
    }
}
