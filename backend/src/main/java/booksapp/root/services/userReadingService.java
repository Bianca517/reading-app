package booksapp.root.services;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutures;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.StorageClient;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.MoreExecutors;
import com.google.cloud.storage.Blob;

import booksapp.root.models.Book;
import booksapp.root.models.BookDTO;
import booksapp.root.models.User;
import booksapp.root.models.GlobalConstants.BookCollectionFields;
import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.models.GlobalConstants.UserCollectionFields;


@Service
public class userReadingService {
    private Firestore DB;
    private final CollectionReference userCollectionDB;
    private final CollectionReference booksCollectionDB;

    private final Bucket FirebaseStorage;
    private final String bucketName = "reading-app-d23dc.appspot.com";
    private Storage storage;
    private GoogleCredentials googleCredentials;
    private Bucket topLevelBucket; 

    public userReadingService(Firestore firestore) {
        DB = firestore;
        this.booksCollectionDB = DB.collection(GlobalConstants.BOOKS_COLLECTION_NAME);
        this.userCollectionDB = DB.collection(GlobalConstants.USERS_COLLECTION_NAME);
    
        /* initialize firebase storage */
        FirebaseStorage = StorageClient.getInstance().bucket();
        try {
            googleCredentials = GoogleCredentials.fromStream(new FileInputStream("./src/main/resources/serviceAccountKey.json"));
            storage = StorageOptions.newBuilder().setCredentials(googleCredentials).build().getService();
            topLevelBucket = storage.get(bucketName);
        } catch (Exception e) {
            googleCredentials = null;
            storage = null;
            topLevelBucket = null;
            System.out.println("could not initialize firebase storage");
            e.printStackTrace();
        }
    }

    public ArrayList<String> getUsersGeneresInterests(String userID) {
        DocumentReference user = userCollectionDB.document(userID);
        User founduser;
        ArrayList<String> interests = new ArrayList<String>();
        try {
            founduser = user.get().get().toObject(User.class);
            interests = founduser.getInterests();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return interests;
    }

    public ArrayList<BookDTO> getUserCurrentReadings(String userID) {
        DocumentReference user = null;
        HashMap<String, String> currentReadings = null;
        ArrayList<BookDTO> bookDTOs = null;

        try {
            user = userCollectionDB.document(userID);
            User foundUser = user.get().get().toObject(User.class);
          
            currentReadings = new HashMap<String, String>();
            currentReadings = foundUser.getCurrentReadings();
            
            bookDTOs = new ArrayList<BookDTO>();
            // Convert the key set to a list
            ArrayList<String> keys = new ArrayList<>(currentReadings.keySet());

            for(int i = 0; i < keys.size(); i++) {
                bookDTOs.add(createBookDTO(keys.get(i)));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return bookDTOs;
    }


    public ArrayList<BookDTO> getUserFinalizedReadings(String userID) {
        DocumentReference user = null;
        ArrayList<String> finalizedReadings = null;
        ArrayList<BookDTO> bookDTOs = null;

        try {
            user = userCollectionDB.document(userID);
            User foundUser = user.get().get().toObject(User.class);
          
            finalizedReadings = new ArrayList<String>();
            finalizedReadings = foundUser.getFinalizedReadings();
            
            bookDTOs = new ArrayList<BookDTO>();
    
            for(int i = 0; i < finalizedReadings.size(); i++) {
                bookDTOs.add(createBookDTO(finalizedReadings.get(i)));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return bookDTOs;
    }

    public String getDownloadURL(String imagePath) {
        Blob blob = this.FirebaseStorage.get(imagePath);
        if (blob != null) {
            return blob.getMediaLink();
        } else {
            throw new RuntimeException("Book cover with url: " + imagePath + " not found");
        }
    }


    public ArrayList<BookDTO> getUserPlannedReadingsForMonth(String userID, String monthName) {
        DocumentReference user = null;
        ArrayList<String> plannedBooks = null;
        ArrayList<BookDTO> bookDTOs = null;

        try {
            user = userCollectionDB.document(userID);
            User foundUser = user.get().get().toObject(User.class);
          
            plannedBooks = new ArrayList<String>();
            plannedBooks = foundUser.getPlannedBooks().get(monthName);
            
            bookDTOs = new ArrayList<BookDTO>();
    
            for(int i = 0; i < plannedBooks.size(); i++) {
                bookDTOs.add(createBookDTO(plannedBooks.get(i)));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return bookDTOs;
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
        User user = userDocument.get().get().toObject(User.class);
        user.addBookAsPlannedForMonth(bookID, monthName);
        userDocument.set(user);
        
        /* 
        DocumentReference userDocument = userCollectionDB.document(userID);
        String planningFieldName = UserCollectionFields.PLANNED_BOOKS.getFieldName(); 
        String formattedUpdateString = "" + planningFieldName + "." + monthName + "";
        ApiFuture<WriteResult> updateResult = userDocument.update(formattedUpdateString, FieldValue.arrayUnion(bookID));
        */
        //System.out.println(updateResult.toString());
        //i wanted to test the value of updateResult but it does not containt the update status as expected
        return 0;
    }   

    public Boolean removeBookAsPlannedForMonth(String userID, String monthName, String bookID) {
        DocumentReference userDocument = userCollectionDB.document(userID);
        User user;
        boolean success = false;

        try {
            user = userDocument.get().get().toObject(User.class);
            HashMap<String,ArrayList<String>> currentPlannedBooks = user.getPlannedBooks();
            currentPlannedBooks.get(monthName).remove(bookID);
            user.setPlannedBooks(currentPlannedBooks);
            userDocument.set(user);
            success = true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        
        return success;
    }   

    public int addBookToCurrentReadings(String userID, String bookID) {
        DocumentReference user = null;
        int status = GlobalConstants.STATUS_FAILED;

        try {
            user = userCollectionDB.document(userID);
            User foundUser = user.get().get().toObject(User.class);
            foundUser.addBookToCurrentReadings(bookID);
            user.set(foundUser);
            status = GlobalConstants.STATUS_SUCCESSFUL;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return status;
    }

    public int addBookToFinalizedReadings(String userID, String bookID) throws InterruptedException, ExecutionException {
        DocumentReference userDocument = userCollectionDB.document(userID);
        userDocument.update(UserCollectionFields.FINALIZED_READINGS.getFieldName(), FieldValue.arrayUnion(bookID));
        return 0;
    }

    public Blob getsong(String bookID, String chapterNumber) {
        String songName = bookID + '_' + chapterNumber + ".mp3";
        Blob stream = topLevelBucket.get(GlobalConstants.FIREBASE_STORAGE_AUDIOS_FOLDER + songName);
        return stream;
    }

    public int deleteBookFromCurrentReadings(String UID, String bookID) {
        int status = GlobalConstants.STATUS_FAILED;
        DocumentReference user = null;

        try {
            user = userCollectionDB.document(UID);
            User foundUser = user.get().get().toObject(User.class);
            foundUser.removeBookFromCurrentReadings(bookID);
            user.set(foundUser);
            status = GlobalConstants.STATUS_SUCCESSFUL;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return status;
    }

    public ArrayList<Integer> getUserPositionInBook(String UID, String bookID) {
        ArrayList<Integer> returnValue = new ArrayList<Integer>();
        int status = GlobalConstants.STATUS_FAILED;
        String userPosition = "";
        DocumentReference user = null;

        try {
            user = userCollectionDB.document(UID);
            User foundUser = user.get().get().toObject(User.class);
            userPosition = foundUser.retrieveUserCurrentPositionInBook(bookID);
            status = GlobalConstants.STATUS_SUCCESSFUL;
        } catch (Exception e) {
            e.printStackTrace();
        }

        returnValue.add(status);
        returnValue.add(Integer.parseInt(userPosition));
        return returnValue;
    }
    

    public int updateUserPositionInBook(String UID, String bookID, String chapterNumber) {
        int status = GlobalConstants.STATUS_FAILED;
        DocumentReference user = null;

        try {
            user = userCollectionDB.document(UID);
            User foundUser = user.get().get().toObject(User.class);
            foundUser.updateUserCurrentPositionInBook(bookID, chapterNumber);
            user.set(foundUser);
            status = GlobalConstants.STATUS_SUCCESSFUL;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return status;
    }

    public HashMap<String, String> getAllBookInLibraryWithPosition(String UID) {
        DocumentReference user = null;
        HashMap<String, String> positions = new HashMap<String, String>();

        try {
            user = userCollectionDB.document(UID);
            User foundUser = user.get().get().toObject(User.class);
            positions = foundUser.getCurrentReadings();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return positions;
    }

     public BookDTO createBookDTO(String bookID) {
        DocumentSnapshot book = null;
        BookDTO foundBookDTO = null;

        try {
            book = booksCollectionDB.document(bookID).get().get();
            Book foundBook = new Book(book);
            foundBook = book.toObject(Book.class);

            foundBookDTO = new BookDTO();
            foundBookDTO.setBookID(bookID);
            foundBookDTO.setAuthorUsername(foundBook.getAuthorUsername());
            foundBookDTO.setBookTitle(foundBook.getName());
            foundBookDTO.setNumberOfChapters(foundBook.getNumberOfChapters());
        } catch (Exception e) {
            e.printStackTrace();
        } 
        return foundBookDTO;
    }

}
