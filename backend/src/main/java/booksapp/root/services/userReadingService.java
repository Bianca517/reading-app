package booksapp.root.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutures;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.StorageClient;
import com.google.cloud.storage.Bucket;
import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.MoreExecutors;
import com.google.cloud.storage.Blob;

import booksapp.root.models.Book;
import booksapp.root.models.User;
import booksapp.root.models.GlobalConstants.BookCollectionFields;
import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.models.GlobalConstants.UserCollectionFields;

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

    @SuppressWarnings("unchecked")
    public ArrayList<String> getUsersGeneresInterests(String userID) throws InterruptedException, ExecutionException {
        ArrayList<String> userInterests = new ArrayList<String>();

        userInterests = (ArrayList<String>) userCollectionDB.document(userID).get().get()
                .get(UserCollectionFields.INTERESTS.getFieldName());

        System.out.println("interests user\n");
        System.out.println(userInterests);
        return userInterests;
    }

   @SuppressWarnings("unchecked")
    public ArrayList<HashMap<String, String>> getUserCurrentReadings(String userID) {
        ArrayList<String> userCurrentReadings = new ArrayList<String>();
        booksService localBookService = new booksService(DB);
        ArrayList<HashMap<String, String>> booksToReturn = new ArrayList<HashMap<String, String>>();

        DocumentReference userDoc = userCollectionDB.document(userID);
        User foundUser;
        try {
            foundUser = userDoc.get().get().toObject(User.class);
            userCurrentReadings = foundUser.getCurrentReadings();
          System.out.println(userCurrentReadings);
            if(userCurrentReadings != null) {
                for (String bookID : userCurrentReadings) {
                    HashMap<String, String> book = new HashMap<String, String>();
    
                    Book foundBook = localBookService.getBookByID(bookID);

                    if(foundBook != null) {
                        // retrieve only relevant fields: book id, book name, author
                        book.put(BookCollectionFields.ID.getFieldName(),
                                bookID);
                        book.put(BookCollectionFields.NAME.getFieldName(),
                                foundBook.getName());
                        book.put(BookCollectionFields.AUTHOR_USERNAME.getFieldName(),
                                foundBook.getAuthorUsername());
                        // book.add(bookfields.get(UserCollectionFields.INTERESTS.getFieldName()).toString());
        
                        booksToReturn.add(book);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return booksToReturn;
    }


    public ArrayList<HashMap<String, String>> getUserFinalizedReadings(String userID) {
        booksService localBookService = new booksService(DB);
        ArrayList<HashMap<String, String>> booksToReturn = new ArrayList<HashMap<String, String>>();

        User user;
        try {
            user = userCollectionDB.document(userID).get().get().toObject(User.class);
            //System.out.println(user.getFinalizedReadings());
            for (String bookID : user.getFinalizedReadings()) {
                HashMap<String, String> book = new HashMap<String, String>();

                Book foundBook = localBookService.getBookByID(bookID);
                // retrieve only relevant fields: book id, book name, author, cover
                book.put(BookCollectionFields.ID.getFieldName(),  bookID);

                book.put(BookCollectionFields.NAME.getFieldName(), foundBook.getName());

                book.put(BookCollectionFields.AUTHOR_USERNAME.getFieldName(), foundBook.getAuthorUsername());

                booksToReturn.add(book);
            }
        } 
        catch (Exception e) {
            e.printStackTrace();
        }
        
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


    public ArrayList<HashMap<String, String>> getUserPlannedReadingsForMonth(String userID, String monthName) throws InterruptedException, ExecutionException {
        HashMap<String, ArrayList<String>> userPlannedReadingsForCurrentMonth = new HashMap<String, ArrayList<String>>();

        userPlannedReadingsForCurrentMonth = (HashMap<String, ArrayList<String>>) userCollectionDB.document(userID).get().get()
                .get(UserCollectionFields.PLANNED_BOOKS.getFieldName());

        System.out.println(userCollectionDB.document(userID).get().get()
                .get(UserCollectionFields.PLANNED_BOOKS.getFieldName()).toString());

        System.out.println(userPlannedReadingsForCurrentMonth.get(monthName));

        ArrayList<String> bookIDsPlannedForCurrentMonth = userPlannedReadingsForCurrentMonth.get(monthName);
        ArrayList<HashMap<String, String>> booksToReturn = new ArrayList<HashMap<String, String>>();
        
        for (String bookID : bookIDsPlannedForCurrentMonth) {
            booksToReturn.add(getBookJSONfromBookID(bookID));
        };
      
        return booksToReturn;
    }



    public HashMap<String, String> getBookJSONfromBookID(String bookID) throws InterruptedException, ExecutionException {
        HashMap<String, String> book = new HashMap<String, String>();
        booksService localBookService = new booksService(DB);

        Book foundBook = localBookService.getBookByID(bookID);
        // retrieve only relevant fields: book name, author, cover
        if(foundBook != null) {
            book.put(BookCollectionFields.ID.getFieldName(), bookID);

            String bookName = foundBook.getName();
            book.put(BookCollectionFields.NAME.getFieldName(), bookName);

            String author = foundBook.getAuthorUsername();
            book.put(BookCollectionFields.AUTHOR_USERNAME.getFieldName(), author);
        }

        return book;
    }

    public int addBookAsPlannedForMonth(String userID, String monthName, String bookID) throws InterruptedException, ExecutionException {
        DocumentReference userDocument = userCollectionDB.document(userID);
        String planningFieldName = UserCollectionFields.PLANNED_BOOKS.getFieldName(); 
        String formattedUpdateString = "" + planningFieldName + "." + monthName + "";
        ApiFuture<WriteResult> updateResult = userDocument.update(formattedUpdateString, FieldValue.arrayUnion(bookID));

        //System.out.println(updateResult.toString());
        //i wanted to test the value of updateResult but it does not containt the update status as expected
        return 0;
    }   

    public int removeBookAsPlannedForMonth(String userID, String monthName, String bookID) throws InterruptedException, ExecutionException {
        DocumentReference userDocument = userCollectionDB.document(userID);
        String planningFieldName = UserCollectionFields.PLANNED_BOOKS.getFieldName(); 
        String formattedUpdateString = "" + planningFieldName + "." + monthName + "";
        ApiFuture<WriteResult> updateResult = userDocument.update(formattedUpdateString, FieldValue.arrayRemove(bookID));

        //System.out.println(updateResult.toString());
        //i wanted to test the value of updateResult but it does not containt the update status as expected
        return 0;
    }   

    public int addBookToCurrentReadings(String userID, String bookID) throws InterruptedException, ExecutionException {
        DocumentReference userDocument = userCollectionDB.document(userID);
        userDocument.update(UserCollectionFields.CURRENT_READINGS.getFieldName(), FieldValue.arrayUnion(bookID));
        return 0;
    }

    public int addBookToFinalizedReadings(String userID, String bookID) throws InterruptedException, ExecutionException {
        DocumentReference userDocument = userCollectionDB.document(userID);
        userDocument.update(UserCollectionFields.FINALIZED_READINGS.getFieldName(), FieldValue.arrayUnion(bookID));
        return 0;
    }

}
