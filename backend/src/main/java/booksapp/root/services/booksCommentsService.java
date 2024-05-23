package booksapp.root.services;

import java.util.HashMap;

import org.springframework.stereotype.Service;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;

import booksapp.root.models.Book;
import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.models.bookcomponents.BookChapter;

@Service
public class booksCommentsService {
    private Firestore DB;
    private final CollectionReference booksCollectionDB;
   
    public booksCommentsService(Firestore firestore) {
        this.DB = firestore;
        this.booksCollectionDB = DB.collection(GlobalConstants.BOOKS_COLLECTION_NAME);
    }

    //add new comment to paragraph with ID from chapter with ID from book with ID
    public int addNewComment(String commentAuthorUsername, String comment, Integer paragraphID, Integer chapterNumber, String bookID) {
        int returnedStatus = GlobalConstants.STATUS_FAILED;

        // get the document refference from book with book ID
        DocumentReference bookDoc = null;

        try {
            bookDoc = booksCollectionDB.document(bookID);
            Book foundBook = bookDoc.get().get().toObject(Book.class);
            
            foundBook.getBookContent().getChapters().get(chapterNumber.toString()).getParagraph(paragraphID).addComment(commentAuthorUsername, comment);
            
            bookDoc.set(foundBook);

            returnedStatus = GlobalConstants.STATUS_SUCCESSFUL;
        }
        catch (Exception e) {
            e.printStackTrace();
            returnedStatus = GlobalConstants.STATUS_FAILED;
        }
        return returnedStatus;
    }

    //get all comments of paragraph with ID from chapter with ID from book with ID
    public HashMap<String, String> getAllComments(Integer paragraphID, Integer chapterNumber, String bookID) {
        HashMap<String, String> comments = new HashMap<String, String>();

        // get the document refference from book with book ID
        DocumentReference bookDoc = null;

        try {
            bookDoc = booksCollectionDB.document(bookID);
            Book foundBook = bookDoc.get().get().toObject(Book.class);
            
            BookChapter chapter = foundBook.getBookContent().getChapters().get(chapterNumber.toString());
            if(chapter != null){
                comments = chapter.getParagraph(paragraphID).getComments();
            }
            
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        return comments;
    }
}



