package booksapp.root.services;

import booksapp.root.models.Book;
import booksapp.root.models.GlobalConstants.BookCollectionFields;
import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.models.bookcomponents.BookChapter;
import booksapp.root.models.bookcomponents.BookContent;
import booksapp.root.models.bookcomponents.BookParagraph;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;


@Service
public class writingBookService {
    private Firestore DB;
    private final CollectionReference booksCollectionDB;
    private final userDataService userDataService;
    
    public writingBookService(Firestore firestore, userDataService userDataService) {
        this.DB = firestore;
        this.booksCollectionDB = DB.collection(GlobalConstants.BOOKS_COLLECTION_NAME);
        this.userDataService = userDataService;
    }

    //add new chapter to book with BookID
    public int addNewChapterToBook(String chapterTitle, String bookID) {
        // get the document refference from book with book ID
        DocumentReference book = null;
    
        try {
            book = booksCollectionDB.document(bookID);
            Book foundBook = book.get().get().toObject(Book.class);

            if(book != null) {
                //add the new title
                foundBook.addChapterTitle(chapterTitle);
      
                //add new empty chapter
                BookContent bookContent = foundBook.getBookContent();     
                bookContent.addChapter(new BookChapter());

                //increase number of chapters
                foundBook.incrementNumberOfChapters();
      
                //update book fields
                book.set(foundBook);

                return GlobalConstants.STATUS_SUCCESSFUL;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } 

        return GlobalConstants.STATUS_FAILED;
    }


    public Book addNewTitleToBookTitles(DocumentSnapshot book, String chapterTitle) {
        if(book != null) {
            try {
                Book foundBook = new Book(book);
                foundBook.addChapterTitle(chapterTitle);
                return foundBook;
            } catch (Exception e) {
                e.printStackTrace();
            } 
        }
        return null;
    }

    
    public Book increaseNumberOfChapters(DocumentSnapshot book, String chapterTitle) {
        if(book != null) {
            try {
                Book foundBook = new Book(book);
                foundBook.setNumberOfChapters(foundBook.getNumberOfChapters() + 1);
                return foundBook;
            } catch (Exception e) {
                e.printStackTrace();
            } 
        }
        return null;
    }


    //add new paragraph to chapter with ID from book with ID
    public int addNewParagraphToBook(Integer chapterNumber, String bookID, String paragraphContent) {
        int returnedStatus = GlobalConstants.STATUS_FAILED;

        // get the document refference from book with book ID
        DocumentReference bookDoc = null;

        try {
            bookDoc = booksCollectionDB.document(bookID);
            Book foundBook = bookDoc.get().get().toObject(Book.class);
            
            BookParagraph newParagraph = new BookParagraph();
            newParagraph.setContent(paragraphContent);
            foundBook.getBookContent().getChapters().get(chapterNumber.toString()).addParagraph(newParagraph);
           
            bookDoc.set(foundBook);

            returnedStatus = GlobalConstants.STATUS_SUCCESSFUL;
        }
        catch (Exception e) {
            e.printStackTrace();
            returnedStatus = GlobalConstants.STATUS_FAILED;
        }
        return returnedStatus;
    }


    public ArrayList<HashMap<String, String>> getAllBooksWrittenByUser(String UID) {
        //filter all books to have book author username == UID
        Query collectionDocumentsQuery;
        ArrayList<HashMap<String, String>> booksFields = null;

        try {
            collectionDocumentsQuery = booksCollectionDB.get().get().getQuery();
            collectionDocumentsQuery = collectionDocumentsQuery.whereEqualTo(BookCollectionFields.AUTHOR_USERNAME.getFieldName(), this.userDataService.getUsernameByUserId(UID));
            List<QueryDocumentSnapshot> resultedBooks = collectionDocumentsQuery.get().get().getDocuments();
            if(resultedBooks.size() > 0) {
                for (QueryDocumentSnapshot bookSnapshot : resultedBooks) {
                    booksFields = new ArrayList<HashMap<String, String>>();
                    Book foundBook = new Book(bookSnapshot);
                    booksFields.add(foundBook.toHashMapString(bookSnapshot.getId()));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } 

        return booksFields;
    }


    public List<String> getAllChaptersOfBook(String bookID) {
        DocumentReference book = null;
        List<String> chapters = null;
        try {
            book = booksCollectionDB.document(bookID);
            Book foundBook = book.get().get().toObject(Book.class);
            chapters = foundBook.getChaptersTitles();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return chapters;
    }

}
