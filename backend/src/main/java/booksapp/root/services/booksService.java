package booksapp.root.services;

import booksapp.root.models.Book;
import booksapp.root.models.BookDTO;
import booksapp.root.models.GlobalConstants.BookCollectionFields;
import booksapp.root.models.GlobalConstants.GlobalConstants;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.Query.Direction;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class booksService {
    private Firestore DB;
    private final CollectionReference booksCollectionDB;
    private userReadingService userReadingService;
   
    public booksService(Firestore firestore) {
        this.DB = firestore;
        this.booksCollectionDB = DB.collection(GlobalConstants.BOOKS_COLLECTION_NAME);
        this.userReadingService = new userReadingService(DB);
    }

    public List<BookDTO> getAllPopularBooks() throws ExecutionException, InterruptedException {
        Query collectionDocumentsQuery = booksCollectionDB.get().get().getQuery();
    
        collectionDocumentsQuery = collectionDocumentsQuery
                .orderBy(BookCollectionFields.READERS.getFieldName(), Direction.DESCENDING)
                .limit(GlobalConstants.DISPLAYED_BOOKS_IN_HOME_SCREEN);
    
        List<QueryDocumentSnapshot> documentsList = collectionDocumentsQuery.get().get().getDocuments();
    
        List<BookDTO> popularBooks = new ArrayList<>();
    
        for (QueryDocumentSnapshot document : documentsList) {
            BookDTO bookDTO = new BookDTO(document);
            popularBooks.add(bookDTO);
        }
    
        return popularBooks;
    }

    public List<BookDTO> getRecommendationsForUserWithID(String userID) throws InterruptedException, ExecutionException {
        ArrayList<String> usersInterests = userReadingService.getUsersGeneresInterests(userID);
        
        List<BookDTO> booksToReturn = new ArrayList<>();
    
        int numberOfBooksOfEachGenre = 3;
        ArrayList<QueryDocumentSnapshot> bookSnapshots = new ArrayList<QueryDocumentSnapshot>();
        Collections.shuffle(usersInterests);
        
        //List<String> userInterestsList = new ArrayList<String>();
        // if(usersInterests.size() > 3) {
        //     userInterestsList = usersInterests.subList(0, 2);
        // }
        // else {
        //     userInterestsList = usersInterests;
        // }

        usersInterests.parallelStream().forEach(genre -> {
            try{
                bookSnapshots.addAll(getXBooksWithGenre(genre, numberOfBooksOfEachGenre));
            }
            catch(Exception e) {
                e.printStackTrace();
            }
        });
    
        if(!bookSnapshots.isEmpty()) {
            for (int i = 0; i < bookSnapshots.size(); i++) {
                QueryDocumentSnapshot book = bookSnapshots.get(i);
    
                BookDTO bookDTO = new BookDTO(book);
                booksToReturn.add(bookDTO);
            }
        }
    
        return booksToReturn;
    }
        


    public ArrayList<QueryDocumentSnapshot> getXBooksWithGenre(String genre, int X) throws InterruptedException, ExecutionException {
        Query collectionDocumentsQuery = booksCollectionDB.get().get().getQuery();
    
        collectionDocumentsQuery = collectionDocumentsQuery
                .whereEqualTo(BookCollectionFields.GENRE.getFieldName(), genre)
                .limit(X);
     
        ArrayList<QueryDocumentSnapshot> resultedBooks = new ArrayList<>(collectionDocumentsQuery.get().get().getDocuments());
        return resultedBooks;
    }

    
    public List<BookDTO> getBooksWithGenre(String genre) throws ExecutionException, InterruptedException {
        Query collectionDocumentsQuery = booksCollectionDB.get().get().getQuery();
        collectionDocumentsQuery = collectionDocumentsQuery.whereEqualTo(BookCollectionFields.GENRE.getFieldName(), genre);
        List<QueryDocumentSnapshot> resultedBooks = collectionDocumentsQuery.get().get().getDocuments();

        List<BookDTO> booksToReturn = new ArrayList<>();
        for (QueryDocumentSnapshot book : resultedBooks) {
            BookDTO bookDTO = new BookDTO(book);
            booksToReturn.add(bookDTO);
        }

        return booksToReturn;
    }

    public List<BookDTO> getBooksWithName(String name) throws ExecutionException, InterruptedException {
        Query collectionDocumentsQuery = booksCollectionDB.get().get().getQuery();
        
        List<QueryDocumentSnapshot> resultedBooks = collectionDocumentsQuery.get().get().getDocuments();
    
        List<BookDTO> booksToReturn = new ArrayList<>();
    
        for (QueryDocumentSnapshot book : resultedBooks) {
            String bookName = book.getString(BookCollectionFields.NAME.getFieldName());
            String bookAuthor = book.getString(BookCollectionFields.AUTHOR_USERNAME.getFieldName());

            if ((bookName != null && bookName.toLowerCase().contains(name.toLowerCase())) || 
            (bookAuthor != null && bookAuthor.toLowerCase().contains(name.toLowerCase()))) {
                BookDTO bookDTO = new BookDTO(book);
                booksToReturn.add(bookDTO);
            }
        }
    
        return booksToReturn;
    }

    public Book getBookByID(String bookID) {
        DocumentReference bookDoc = booksCollectionDB.document(bookID);
        Book foundBook = null;
        try {
            foundBook = bookDoc.get().get().toObject(Book.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return foundBook;
    }

    public String makeCompleteRefferenceToBook(String bookName, String authorUsername, String refference) {
        return refference + GlobalConstants.FIREBASE_STORAGE_COVERS_FOLDER + "/" + bookName.toLowerCase() + "_"
                + authorUsername.toLowerCase() + ".png";
    }

    public int getBookChapters(String bookID) {
        Book book = getBookByID(bookID);
        int numberOfChapers = 0;
        if(book != null) {
            System.out.println(book.getNumberOfChapters());
            numberOfChapers = book.getNumberOfChapters();
        }
        return numberOfChapers;
    }

    public String getBookChapterTitle(String bookID, int chapterNumber) {
        Book book = getBookByID(bookID);
        String chapterTitle = book.getChaptersTitles().get(chapterNumber);
        
        return chapterTitle;
    }

    public HashMap<String, String> getBookChapterContent(String bookID, int chapterNumber) {
        Book book = getBookByID(bookID);

        // Ensure that the chapterNumber is within valid range
        if (chapterNumber < 0 || chapterNumber > book.getNumberOfChapters()) {
            throw new IllegalArgumentException("Invalid chapterNumber");
        }
        //BookChapter bookChapter = book.getBookContent().getChapters().get(Integer.toString(chapterNumber));

        return this.getBookParagraphsContents(book, Integer.toString(chapterNumber));
    }

    public String getBookDescription(String bookID) throws InterruptedException, ExecutionException {
        Book book = getBookByID(bookID);
        String bookDescription = book.getDescription();
        return bookDescription;
    }

    public HashMap<String, String> getBookParagraphsContents(Book book, String chapterNumber) {
        HashMap<String, String> content = new HashMap<String, String>();
        Integer paragraphID = 0;
        for(int i = 0; i < book.getBookContent().getChapters().get(chapterNumber).getParagraphs().size(); i++) {
            content.put(paragraphID.toString(), book.getBookContent().getChapters().get(chapterNumber).getParagraph(i).getContent());
            paragraphID++;
        }
        return content;
    }


}
