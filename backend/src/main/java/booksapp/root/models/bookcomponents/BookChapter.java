package booksapp.root.models.bookcomponents;

import java.util.HashMap;
import java.util.Map;


public class BookChapter {
    private HashMap<String, BookParagraph> paragraphs;

    public BookChapter() {
        paragraphs = new HashMap<String, BookParagraph>();
    }

    public BookParagraph getParagraph(int i) {
        return paragraphs.get(Integer.toString(i));
    }

    public BookParagraph setParagraph(int i, BookParagraph paragraph) {
        return paragraphs.put(Integer.toString(i), paragraph);
    }

    public String addParagraph(BookParagraph paragraph) {
        String newParagraphID = Integer.toString(paragraphs.size());
        paragraphs.put(newParagraphID, paragraph);
        return newParagraphID;
    }

    public HashMap<String, BookParagraph> getParagraphs() {
        return paragraphs;
    }

    public void setParagraphs(HashMap<String, BookParagraph> paragraphs) {
        this.paragraphs = paragraphs;
    }

    public void setParagraphsMap(Map<String, Object> paragraphs) {
        if(paragraphs.get("0") instanceof BookParagraph) {
            for (Integer i = 0; i < paragraphs.size(); i++) {
                this.paragraphs.put(i.toString(), (BookParagraph)paragraphs.get(i.toString()));
            }
        }
    }

    public String toString() {
        return paragraphs.toString();
    }
}