package booksapp.root.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.StorageClient;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Blob;

import booksapp.root.models.GlobalConstants;

@Service
public class userReadingService {
    private Firestore DB;
    private Bucket FirebaseStorage;
    private final CollectionReference userCollectionDB;

    public userReadingService(Firestore firestore) {
        DB = firestore;
        FirebaseStorage = StorageClient.getInstance().bucket();
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

    public ArrayList<HashMap<String, String>> getUserCurrentReadings(String userID)
            throws InterruptedException, ExecutionException {
        ArrayList<String> userCurrentReadings = new ArrayList<String>();
        booksService localBookService = new booksService(DB);

        userCurrentReadings = (ArrayList<String>) userCollectionDB.document(userID).get().get()
                .get(GlobalConstants.USERS_COLLECTION_FIELDS[5]);

        ArrayList<HashMap<String, String>> booksToReturn = new ArrayList<HashMap<String, String>>();

        for (String bookID : userCurrentReadings) {
            HashMap<String, String> book = new HashMap<String, String>();

            Map<String, Object> bookfields = localBookService.getBookByID(bookID);
            // retrieve only relevant fields: book name, author, cover
            book.put(GlobalConstants.BOOK_COLLECTION_FIELDS[0],
                    bookfields.get(GlobalConstants.BOOK_COLLECTION_FIELDS[0]).toString());
            book.put(GlobalConstants.BOOK_COLLECTION_FIELDS[1],
                    bookfields.get(GlobalConstants.BOOK_COLLECTION_FIELDS[1]).toString());
            // book.add(bookfields.get(GlobalConstants.BOOK_COLLECTION_FIELDS[3]).toString());

            booksToReturn.add(book);
        }
        ;
        return booksToReturn;
    }

    public ArrayList<HashMap<String, String>> getUserFinalizedReadings(String userID)
            throws InterruptedException, ExecutionException {
        ArrayList<String> userCurrentReadings = new ArrayList<String>();
        booksService localBookService = new booksService(DB);

        userCurrentReadings = (ArrayList<String>) userCollectionDB.document(userID).get().get()
                .get(GlobalConstants.USERS_COLLECTION_FIELDS[6]);

        ArrayList<HashMap<String, String>> booksToReturn = new ArrayList<HashMap<String, String>>();

        for (String bookID : userCurrentReadings) {
            HashMap<String, String> book = new HashMap<String, String>();

            Map<String, Object> bookfields = localBookService.getBookByID(bookID);
            // retrieve only relevant fields: book name, author, cover
            String bookName = bookfields.get(GlobalConstants.BOOK_COLLECTION_FIELDS[0]).toString();
            book.put(GlobalConstants.BOOK_COLLECTION_FIELDS[0], bookName);

            String author = bookfields.get(GlobalConstants.BOOK_COLLECTION_FIELDS[1]).toString();
            book.put(GlobalConstants.BOOK_COLLECTION_FIELDS[1], author);

            String coverRefference = bookfields.get(GlobalConstants.BOOK_COLLECTION_FIELDS[3]).toString();
            coverRefference = new booksService(DB).makeCompleteRefferenceToBook(bookName, author,
                    coverRefference);
            // coverRefference = getDownloadURL(coverRefference);
            book.put(GlobalConstants.BOOK_COLLECTION_FIELDS[3], coverRefference);

            booksToReturn.add(book);
        }
        ;
        return booksToReturn;
    }

    public String getDownloadURL(String imagePath) {
        Blob blob = this.FirebaseStorage.get(imagePath);
        if (blob != null) {
            return blob.getMediaLink();
        } else {
            throw new RuntimeException("Book cover with url: " + imagePath + " not found");
        }
    }
}
