package booksapp.root.services;

import booksapp.root.models.Book;
import booksapp.root.models.GlobalConstants.BookCollectionFields;
import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.models.bookcomponents.BookChapter;
import booksapp.root.models.bookcomponents.BookContent;
import booksapp.root.models.bookcomponents.BookParagraph;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.firebase.cloud.StorageClient;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import javax.swing.text.html.ImageView;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class writingBookService {
    private Firestore DB;
    private final CollectionReference booksCollectionDB;
    private final userDataService userDataService;
    private final Bucket FirebaseStorage;
    private final String bucketName = "reading-app-d23dc.appspot.com";
    private Storage storage;
    private GoogleCredentials googleCredentials;
    private Bucket topLevelBucket; 
    
    public writingBookService(Firestore firestore, userDataService userDataService) {
        this.DB = firestore;
        this.booksCollectionDB = DB.collection(GlobalConstants.BOOKS_COLLECTION_NAME);
        this.userDataService = userDataService;

        /* initialize firebase storage */
        FirebaseStorage = StorageClient.getInstance().bucket();
        try {
            googleCredentials = GoogleCredentials.fromStream(new FileInputStream("./backend/src/main/resources/serviceAccountKey.json"));
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

    //add new chapter to book with BookID
    public int addNewChapterToBook(String chapterTitle, String bookID) {
        // get the document refference from book with book ID
        DocumentReference book = null;
    
        try {
            book = booksCollectionDB.document(bookID);

            Book foundBook = book.get().get().toObject(Book.class);
            
            System.out.println("fdlkk");
            System.out.println(foundBook);

            if(foundBook != null) {
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

    private ArrayList<String> parseChapterContent(String chapterContent) {
        String[] chapterContentSplit;
        chapterContentSplit = chapterContent.split("\n");

        ArrayList<String> paragraphs = new ArrayList<String>();
        for(int i = 0; i < chapterContentSplit.length; i++) {
            if(chapterContentSplit[i].length() > 0) {
                paragraphs.add(chapterContentSplit[i]);
            }
        }
        return paragraphs;
    }

    public int addListOfParagraphsToBook(Integer chapterNumber, String bookID, String chapterContent) {
        int returnedStatus = GlobalConstants.STATUS_FAILED;

        // get the document refference from book with book ID
        DocumentReference bookDoc = null;

        try {
            bookDoc = booksCollectionDB.document(bookID);
            
            Book foundBook = bookDoc.get().get().toObject(Book.class);
            
            ArrayList<String> paragraphs = parseChapterContent(chapterContent);
            for (String paragraph : paragraphs) {
                BookParagraph newParagraph = new BookParagraph();
                newParagraph.setContent(paragraph);
                foundBook.getBookContent().getChapters().get(chapterNumber.toString()).addParagraph(newParagraph);
            }
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
        booksFields = new ArrayList<HashMap<String, String>>();

        try {
            collectionDocumentsQuery = booksCollectionDB.get().get().getQuery();
            collectionDocumentsQuery = collectionDocumentsQuery.whereEqualTo(BookCollectionFields.AUTHOR_USERNAME.getFieldName(), this.userDataService.getUsernameByUserId(UID));
            List<QueryDocumentSnapshot> resultedBooks = collectionDocumentsQuery.get().get().getDocuments();
            if(resultedBooks.size() > 0) {
                for (QueryDocumentSnapshot bookSnapshot : resultedBooks) {
                    Book foundBook = new Book(bookSnapshot);
                    //System.out.println("found book by user " + this.userDataService.getUsernameByUserId(UID));
                    //System.out.println(foundBook);
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

    public int addNewBook(String bookTitle, String authorUsername, String description, String bookGenre) {
        /* 
        Map<String, Object> bookMap = new HashMap<>();

        bookMap.put(BookCollectionFields.AUTHOR_USERNAME.getFieldName(), authorUsername);
        bookMap.put(BookCollectionFields.CHAPTERS_CONTENT.getFieldName(), "");
        bookMap.put(BookCollectionFields.CHAPTERS_TITLES.getFieldName(), "");
        bookMap.put(BookCollectionFields.DESCRIPTION.getFieldName(), description);
        bookMap.put(BookCollectionFields.GENRE.getFieldName(), bookGenre);
        bookMap.put(BookCollectionFields.NAME.getFieldName(), bookTitle);
        bookMap.put(BookCollectionFields.NUMBER_OF_CHAPTERS.getFieldName(), 0);
        bookMap.put(BookCollectionFields.READERS.getFieldName(), 0);
          
        booksCollectionDB.add(bookMap);
        */
        int returnedStatus = GlobalConstants.STATUS_FAILED;

        Book book = new Book();
        book.setAuthorUsername(authorUsername);
        book.setName(bookTitle);
        book.setGenre(bookGenre);
        book.setDescription(description);
        ApiFuture<DocumentReference> resp = booksCollectionDB.add(book);
        try {
            resp.get();
            returnedStatus = GlobalConstants.STATUS_SUCCESSFUL;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return returnedStatus;
    }

    
    public int uploadBookCoverToStorage(String bookTitle, String bookAuthor, MultipartFile bookCoverImage) {
        int returnedStatus = GlobalConstants.STATUS_FAILED;
        String fileName = constructBookCoverImageName(bookTitle, bookAuthor);

        // Convert MultipartFile to byte array
        byte[] bytes;
        try {
            bytes = bookCoverImage.getBytes();
            // Upload the byte array to Firebase Storage
            Blob blob = topLevelBucket.create(GlobalConstants.FIREBASE_STORAGE_COVERS_FOLDER + fileName, bytes, bookCoverImage.getContentType());
            returnedStatus = GlobalConstants.STATUS_SUCCESSFUL;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return returnedStatus;
    } 

    // create the name for the book cover in the format title_author
    private String constructBookCoverImageName(String bookTitle, String bookAuthor) {
        String bookTitleAux = "";
        String bookAuthorAux = "";

        if(bookTitle.contains(" ")) {
            String[] bookTitleWords = bookTitle.split(" ");
            for (String word : bookTitleWords) {
                bookTitleAux += word;
            }
        }
        else {
            bookTitleAux = bookTitle;
        }

        if(bookAuthor.contains(" ")) {
            String[] bookAuthorWords = bookAuthor.split(" ");
            for (String word : bookAuthorWords) {
                bookAuthorAux += word;
            }
        }
        else {
            bookAuthorAux = bookAuthor;
        }

        String bookCoverName = bookTitleAux.toLowerCase() + "_" + bookAuthorAux.toLowerCase() + ".png";
        return bookCoverName;
    }

    public int uploadSongToStorage(String bookID, String chapterNumber, MultipartFile songUri) {
        int returnedStatus = GlobalConstants.STATUS_FAILED;

        String fileName = constructSongName(bookID, chapterNumber);

        // Convert MultipartFile to byte array
        byte[] bytes;
        try {
            bytes = songUri.getBytes();
            // Upload the byte array to Firebase Storage
            // Upload the byte array to Firebase Storage
            System.out.println("Uploading to" + topLevelBucket.getName());
            BlobId blobId = BlobId.of(topLevelBucket.getName(), "docu");
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(songUri.getContentType()).build();

            Storage storage = StorageOptions.getDefaultInstance().getService();
            Blob blob = topLevelBucket.create(GlobalConstants.FIREBASE_STORAGE_AUDIOS_FOLDER + fileName, bytes, "audio/mpeg");
            
            Map<String, String> metadata = blob.getMetadata();

            // If metadata map is null, initialize it
            if (metadata == null) {
                metadata = new HashMap<>();
            }
    
            // Add custom metadata
            metadata.put("firebaseStorageDownloadTokens", UUID.randomUUID().toString());

            blob.toBuilder().setMetadata(metadata).build().update();

            returnedStatus = GlobalConstants.STATUS_SUCCESSFUL;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return returnedStatus;
    }

    private String constructSongName(String bookID, String chapterNumber) {
        return bookID + '_' + chapterNumber;
    }
}
