package booksapp.root.models.bookcomponents;

import java.util.HashMap;

public class BookContent {
    private HashMap<String, BookChapter> chapters;

    public BookContent() {
        chapters = new HashMap<String, BookChapter>();
    }

    public BookContent(HashMap<String, BookChapter> newBookContent) {
        chapters = new HashMap<String, BookChapter>();

        /* 
        if(newBookContent instanceof HashMap<String, BookChapter>) {
            if(newBookContent.keySet().iterator().next().equals(GlobalConstants.BOOK_COLLECTION_FIELDS[11])) {
                //this means that the hashmap is already chaptersContent: {} and we want just the value
                chapters = (HashMap<String,BookChapter>)newBookContent.get(GlobalConstants.BOOK_COLLECTION_FIELDS[11]);
            }
        }
        */
    }

    public void setChapters(HashMap<String, BookChapter> chapters) {
        this.chapters = chapters;
    }

    public HashMap<String, BookChapter> getChapters() {
        return chapters;
    }

    public String toString() {
        return chapters.toString();
    }

    public void addChapter(BookChapter newChapter) {
        String newChapterID = Integer.toString(chapters.size());
        //System.out.println("\nsize: " + newChapterID);
        chapters.put(newChapterID, newChapter);
    }

    public void addChapter(Integer i, BookChapter newChapter) {
        String newChapterID = i.toString();
        chapters.put(newChapterID, newChapter);
    }
}
