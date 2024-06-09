package booksapp.root.models.bookcomponents;

import java.util.HashMap;

public class ParagraphContent {
    private HashMap<String, String> content;

    public ParagraphContent() {
        this.content = new HashMap<String, String>();
    }

    public void setParagraph(HashMap<String, String> paragraph) {
        this.content = paragraph;
    }

    public HashMap<String, String> getparagraphContent() {
        return content;
    }
}
