package booksapp.root.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;

import booksapp.root.models.GlobalConstants;

@Service
public class userReadingService {
    private Firestore DB;
    private final CollectionReference userCollectionDB;

    public userReadingService(Firestore firestore) {
        DB = firestore;
        this.userCollectionDB = DB.collection(GlobalConstants.USERS_COLLECTION_NAME);
    }

    public ArrayList<String> getUsersGeneresInterests(String userID) throws InterruptedException, ExecutionException {
        ArrayList<String> userInterests = new ArrayList<String>();

        userInterests = (ArrayList<String>) userCollectionDB.document(userID).get().get()
                .get(GlobalConstants.USERS_COLLECTION_FIELDS[4]);

        System.out.println("aici\n");
        System.out.println(userInterests);
        return userInterests;
    }

    public HashMap<String, ArrayList<String>> getUserCurrentReadings(String userID)
            throws InterruptedException, ExecutionException {
        ArrayList<String> userCurrentReadings = new ArrayList<String>();
        booksService localBookService = new booksService(DB);

        userCurrentReadings = (ArrayList<String>) userCollectionDB.document(userID).get().get()
                .get(GlobalConstants.USERS_COLLECTION_FIELDS[5]);

        HashMap<String, ArrayList<String>> booksToReturn = new HashMap<String, ArrayList<String>>();

        for (String bookID : userCurrentReadings) {
            ArrayList<String> book = new ArrayList<String>();

            Map<String, Object> bookfields = localBookService.getBookByID(bookID);
            // retrieve only relevant fields: book name, author, cover
            book.add(bookfields.get(GlobalConstants.BOOK_COLLECTION_FIELDS[0]).toString());
            book.add(bookfields.get(GlobalConstants.BOOK_COLLECTION_FIELDS[1]).toString());
            // book.add(bookfields.get(GlobalConstants.BOOK_COLLECTION_FIELDS[3]).toString());

            booksToReturn.put(bookID, book);
        }
        ;
        return booksToReturn;
    }

    public HashMap<String, ArrayList<String>> getUserFinalizedReadings(String userID)
            throws InterruptedException, ExecutionException {
        ArrayList<String> userCurrentReadings = new ArrayList<String>();
        booksService localBookService = new booksService(DB);

        userCurrentReadings = (ArrayList<String>) userCollectionDB.document(userID).get().get()
                .get(GlobalConstants.USERS_COLLECTION_FIELDS[6]);

        HashMap<String, ArrayList<String>> booksToReturn = new HashMap<String, ArrayList<String>>();

        for (String bookID : userCurrentReadings) {
            ArrayList<String> book = new ArrayList<String>();

            Map<String, Object> bookfields = localBookService.getBookByID(bookID);
            // retrieve only relevant fields: book name, author, cover
            book.add(bookfields.get(GlobalConstants.BOOK_COLLECTION_FIELDS[0]).toString());
            book.add(bookfields.get(GlobalConstants.BOOK_COLLECTION_FIELDS[1]).toString());
            // book.add(bookfields.get(GlobalConstants.BOOK_COLLECTION_FIELDS[3]).toString());

            booksToReturn.put(bookID, book);
        }
        ;
        return booksToReturn;
    }
}
