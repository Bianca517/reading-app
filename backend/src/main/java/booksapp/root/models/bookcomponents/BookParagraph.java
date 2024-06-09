package booksapp.root.models.bookcomponents;

import java.util.HashMap;

public class BookParagraph {
    private HashMap<String, String> comments;
    private String content;

    public BookParagraph() {
        this.comments = new HashMap<String, String>();
    }
    
    public void setComments(HashMap<String, String> paragraphComment) {
        this.comments = paragraphComment;
    }

    public void setContent(String paragraphContent) {
        this.content = paragraphContent;
    }

    public HashMap<String, String> getComments() {
        return comments;
    }

    public String getContent() {
        return content;
    }

    public void addComment(String userName, String content) {
        if(this.comments == null) {
            this.comments = new HashMap<String, String>();
        }
        comments.put(userName, content);
    }

    public String toString() {
        String toReturn = "";
        toReturn += "Content: " + this.content + "\n";
        toReturn += "Comments: " + this.comments + "\n";
        return toReturn;
    }
}
