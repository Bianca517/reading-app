package booksapp.root.services;

import booksapp.root.models.Book;
import booksapp.root.models.GlobalConstants.BookCollectionFields;
import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.models.bookcomponents.BookChapter;
import booksapp.root.models.bookcomponents.BookParagraph;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.Query.Direction;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import javax.swing.text.html.ImageView;

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

    public ArrayList<HashMap<String, String>> getAllPopularBooks() throws ExecutionException, InterruptedException {
        // get all documents from the book collection
        Query collectionDocumentsQuery = booksCollectionDB.get().get().getQuery();
    
        // order documents descending by popularity; get the first 10 popular
        collectionDocumentsQuery = collectionDocumentsQuery
                .orderBy(BookCollectionFields.READERS.getFieldName(), Direction.DESCENDING)
                .limit(GlobalConstants.DISPLAYED_BOOKS_IN_HOME_SCREEN);
    
        // get the list of documents resulted from the query
        List<QueryDocumentSnapshot> documentsList = collectionDocumentsQuery.get().get().getDocuments();
    
        // get a list of maps with the id, cover, name, author name from the documents list
        ArrayList<HashMap<String, String>> resultedBooks = new ArrayList<HashMap<String, String>>();
        for (int i = 0; i < GlobalConstants.DISPLAYED_BOOKS_IN_HOME_SCREEN && i < documentsList.size(); i++) {
            if (documentsList.get(i) != null) {
                String bookID = documentsList.get(i).getId();
                HashMap<String, String> book = new HashMap<String, String>();
                book.put(BookCollectionFields.ID.getFieldName(), bookID);
                book.put(BookCollectionFields.NAME.getFieldName(), documentsList.get(i).get(BookCollectionFields.NAME.getFieldName()).toString());
                book.put(BookCollectionFields.AUTHOR_USERNAME.getFieldName(), documentsList.get(i).get(BookCollectionFields.AUTHOR_USERNAME.getFieldName()).toString());
                resultedBooks.add(book);
            }
        }
    
        System.out.println(resultedBooks);
        return resultedBooks;
    }

    public ArrayList<HashMap<String, String>> getRecommendationsForUserWithID(String userID)
            throws InterruptedException, ExecutionException {
        // get users interests
        ArrayList<String> usersInterests = userReadingService.getUsersGeneresInterests(userID);

        ArrayList<HashMap<String, String>> booksToReturn = new ArrayList<HashMap<String, String>>(
                GlobalConstants.DISPLAYED_BOOKS_IN_HOME_SCREEN);
        //Integer numberOfBooksOfEachGenre = Math.floorDiv(GlobalConstants.DISPLAYED_BOOKS_IN_HOME_SCREEN, usersInterests.size());
        Integer numberOfBooksOfEachGenre = 3;
        // for GlobalConstants.DISPLAYED_BOOKS_IN_HOME_SCREEN number / user interests ->
        // choose a random book with that genre
        for (String genre : usersInterests) {
            ArrayList<HashMap<String, String>> booksWithGenre = getXBooksWithGenre(genre, numberOfBooksOfEachGenre);
            booksToReturn.addAll(booksWithGenre);
        }

        return booksToReturn;
    }   

    public ArrayList<HashMap<String, String>> getXBooksWithGenre(String genre, Integer X)
            throws ExecutionException, InterruptedException {
        // get all documents from the book collection
        Query collectionDocumentsQuery = booksCollectionDB.get().get().getQuery();

        // the genre shall have the first letter capital
        genre = genre.substring(0, 1).toUpperCase() + genre.substring(1);

        // get documents which contain the specified book genre
        collectionDocumentsQuery = collectionDocumentsQuery
                .whereEqualTo(BookCollectionFields.GENRE.getFieldName(), genre);

        //keep track of book ID's
        ArrayList<String> bookIds = new ArrayList<String>();

        // get a random book from the resulted books
        List<QueryDocumentSnapshot> resultedBooks = collectionDocumentsQuery.get().get().getDocuments();

        ArrayList<HashMap<String, String>> booksToReturn = new ArrayList<HashMap<String, String>>(X);

        for (int i = 0; (i < X) && (i < resultedBooks.size()); i++) {
            int randomIndex = (int) (Math.random() * resultedBooks.size());

            QueryDocumentSnapshot book = resultedBooks.get(randomIndex);

            if(!bookIds.contains(book.getId().toString())) {
                bookIds.add(book.getId().toString());
                HashMap<String, String> bookFields = new HashMap<String, String>();
                // book id
                bookFields.put(BookCollectionFields.ID.getFieldName(), book.getId().toString());
                // book name
                bookFields.put(BookCollectionFields.NAME.getFieldName(), book.get(BookCollectionFields.NAME.getFieldName()).toString());
                // book author
                bookFields.put(BookCollectionFields.AUTHOR_USERNAME.getFieldName(), book.get(BookCollectionFields.AUTHOR_USERNAME.getFieldName()).toString());

                booksToReturn.add(bookFields);
            } else {
                i--;
            }
        }
        return booksToReturn;
    }

    public ArrayList<HashMap<String, String>> getBooksWithGenre(String genre) throws ExecutionException, InterruptedException {
        // get all documents from the book collection
        Query collectionDocumentsQuery = booksCollectionDB.get().get().getQuery();

        // the genre shall have the first letter capital
        genre = genre.substring(0, 1).toUpperCase() + genre.substring(1);

        // get documents which contain the specified book genre
        collectionDocumentsQuery = collectionDocumentsQuery
                .whereEqualTo(BookCollectionFields.GENRE.getFieldName(), genre);
        
        // get resulted books
        List<QueryDocumentSnapshot> resultedBooks = collectionDocumentsQuery.get().get().getDocuments();
        System.out.println(resultedBooks);

        ArrayList<HashMap<String, String>> booksToReturn = new ArrayList<HashMap<String, String>>();

        for (int i = 0; i < resultedBooks.size(); i++) {
            QueryDocumentSnapshot book = resultedBooks.get(i);
            HashMap<String, String> bookFields = new HashMap<String, String>();
            String bookID = book.getId().toString();

            bookFields.put(BookCollectionFields.ID.getFieldName(), bookID);
            // book name
            bookFields.put(BookCollectionFields.NAME.getFieldName(), book.get(BookCollectionFields.NAME.getFieldName()).toString());
            // book author
            bookFields.put(BookCollectionFields.AUTHOR_USERNAME.getFieldName(), book.get(BookCollectionFields.AUTHOR_USERNAME.getFieldName()).toString());

            booksToReturn.add(bookFields);
        }

        return booksToReturn;
    }

    public ArrayList<HashMap<String, String>> getBooksWithName(String name) throws ExecutionException, InterruptedException {
        // get all documents from the book collection
        Query collectionDocumentsQuery = booksCollectionDB.get().get().getQuery();
        
        // get resulted books
        List<QueryDocumentSnapshot> resultedBooks = collectionDocumentsQuery.get().get().getDocuments();
        System.out.println(resultedBooks);

        ArrayList<HashMap<String, String>> booksToReturn = new ArrayList<HashMap<String, String>>();


        for (int i = 0; i < resultedBooks.size(); i++) {
            QueryDocumentSnapshot book = resultedBooks.get(i);
            String bookID = book.getId().toString();
            String bookName = book.get(BookCollectionFields.NAME.getFieldName()).toString();
            if(name.toLowerCase().contains(bookName.toLowerCase())) {
                HashMap<String, String> bookFields = new HashMap<String, String>();

                bookFields.put(BookCollectionFields.ID.getFieldName(), bookID);
                // book name
                bookFields.put(BookCollectionFields.NAME.getFieldName(), bookName);
                // book author
                bookFields.put(BookCollectionFields.AUTHOR_USERNAME.getFieldName(), book.get(BookCollectionFields.AUTHOR_USERNAME.getFieldName()).toString());
    
                booksToReturn.add(bookFields);
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
        System.out.println(book.getNumberOfChapters());
        int numberOfChapers = book.getNumberOfChapters();
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

    public void addNewBook(String bookTitle, String authorUsername, String description, String bookGenre) {
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

    public void uploadBookCoverToStorage(ImageView image) {

    }
}
