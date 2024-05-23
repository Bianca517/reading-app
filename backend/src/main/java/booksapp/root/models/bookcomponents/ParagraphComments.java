package booksapp.root.models.bookcomponents;

import java.util.HashMap;

public class ParagraphComments {
    private HashMap<String, String> paragraphComment;

    public ParagraphComments() {
        this.paragraphComment = new HashMap<String, String>();
    }

    public void setParagraphComments(HashMap<String, String> paragraph) {
        this.paragraphComment = paragraph;
    }

    public HashMap<String, String> getparagraphComments() {
        return paragraphComment;
    }

    public void addNewComment(String comment) {
        int nrComments = paragraphComment.size() - 1;
        String commentID = Integer.toString(nrComments);
        paragraphComment.put(commentID, comment);
    }
}
