package booksapp.root.models;

import java.util.List;
import java.util.Map;

public class Book {

    private String authorUsername;
    private List<Map<String, Object>> chaptersContents;
    private List<String> chaptersTitles;
    private String description;
    private String genre;
    private String name;
    private int numberOfChapters;
    private int readers;

    // Constructors

    public Book() {
    }

    public Book(String authorUsername, List<Map<String, Object>> chaptersContents, List<String> chaptersTitles,
                String description, String genre, String name, int numberOfChapters, int readers) {
        this.authorUsername = authorUsername;
        this.chaptersContents = chaptersContents;
        this.chaptersTitles = chaptersTitles;
        this.description = description;
        this.genre = genre;
        this.name = name;
        this.numberOfChapters = numberOfChapters;
        this.readers = readers;
    }

    // Getters

    public String getAuthorUsername() {
        return authorUsername;
    }

    public List<Map<String, Object>> getChaptersContents() {
        return chaptersContents;
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
}
