package booksapp.root.services;

import booksapp.root.models.GlobalConstants;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.gson.Gson;
import com.google.cloud.firestore.Query.Direction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.origin.SystemEnvironmentOrigin;
import org.springframework.stereotype.Service;

import java.io.Console;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    public HashMap<String, List<String>> getAllPopularBooks() throws ExecutionException, InterruptedException {
        // get all documents from the book collection
        Query collectionDocumentsQuery = booksCollectionDB.get().get().getQuery();

        // order documents descending by popularity; get the first 10 popular
        collectionDocumentsQuery = collectionDocumentsQuery
                .orderBy(GlobalConstants.BOOK_COLLECTION_FIELDS[4], Direction.DESCENDING)
                .limit(GlobalConstants.DISPLAYED_BOOKS_IN_HOME_SCREEN);

        // get the list of documents resulted form the query
        List<QueryDocumentSnapshot> documentsList = collectionDocumentsQuery.get().get().getDocuments();

        // get a map with the id, cover, name, author name from the documents list
        HashMap<String, List<String>> resultedBooks = new HashMap<String, List<String>>();
        for (int i = 0; i < GlobalConstants.DISPLAYED_BOOKS_IN_HOME_SCREEN && i < documentsList.size(); i++) {
            if (documentsList.get(i) != null) {
                String bookID = documentsList.get(i).getId();
                ArrayList<String> bookFields = new ArrayList<String>();
                bookFields.add(documentsList.get(i).get(GlobalConstants.BOOK_COLLECTION_FIELDS[GlobalConstants.BOOK_TITLE_INDEX]).toString());
                bookFields.add(documentsList.get(i).get(GlobalConstants.BOOK_COLLECTION_FIELDS[GlobalConstants.BOOK_AUTHOR_INDEX]).toString());
                resultedBooks.put(bookID, bookFields);
            }
        }

        System.out.println(resultedBooks);
        return resultedBooks;
    }

    public HashMap<String, List<String>> getRecommendationsForUsedWithID(String userID)
            throws InterruptedException, ExecutionException {
        // get users interests
        ArrayList<String> usersInterests = userReadingService.getUsersGeneresInterests(userID);

        HashMap<String, List<String>> booksToReturn = new HashMap<String, List<String>>(
                GlobalConstants.DISPLAYED_BOOKS_IN_HOME_SCREEN);
        Integer numberOfBooksOfEachGender = Math.floorDiv(GlobalConstants.DISPLAYED_BOOKS_IN_HOME_SCREEN,
                usersInterests.size());
        // for GlobalConstants.DISPLAYED_BOOKS_IN_HOME_SCREEN number / user interests ->
        // choose a random book with that genre
        for (String genre : usersInterests) {
            HashMap<String, List<String>> booksWithGenre = getXBooksWithGenre(genre, numberOfBooksOfEachGender);
            booksToReturn.putAll(booksWithGenre);
        }

        return booksToReturn;
    }

    public HashMap<String, List<String>> getXBooksWithGenre(String genre, Integer X)
            throws ExecutionException, InterruptedException {
        // get all documents from the book collection
        Query collectionDocumentsQuery = booksCollectionDB.get().get().getQuery();

        // the genre shall have the first letter capital
        genre = genre.substring(0, 1).toUpperCase() + genre.substring(1);

        // get documents which contain the specified book genre
        collectionDocumentsQuery = collectionDocumentsQuery
                .whereEqualTo(GlobalConstants.BOOK_COLLECTION_FIELDS[5], genre);

        // get a random book from the resulted books
        List<QueryDocumentSnapshot> resultedBooks = collectionDocumentsQuery.get().get().getDocuments();

        HashMap<String, List<String>> booksToReturn = new HashMap<String, List<String>>(X);

        for (int i = 0; (i < X) && (i < resultedBooks.size()); i++) {
            int randomIndex = (int) (Math.random() * resultedBooks.size());

            QueryDocumentSnapshot book = resultedBooks.get(randomIndex);

            ArrayList<String> bookFields = new ArrayList<String>();
            // book name
            bookFields.add(book.get(GlobalConstants.BOOK_COLLECTION_FIELDS[0]).toString());
            // book author
            bookFields.add(book.get(GlobalConstants.BOOK_COLLECTION_FIELDS[1]).toString());

            booksToReturn.put(book.getId(), bookFields);
        }
        return booksToReturn;
    }

    public void addBooks() {
        HashMap<String, Object> book = new HashMap<String, Object>();

        book.put(GlobalConstants.BOOK_COLLECTION_FIELDS[0], "Complicity");
        book.put(GlobalConstants.BOOK_COLLECTION_FIELDS[1], "annatodd2");
        book.put(GlobalConstants.BOOK_COLLECTION_FIELDS[2], "101");
        book.put(GlobalConstants.BOOK_COLLECTION_FIELDS[3],
                "gs://reading-app-d23dc.appspot.com/book_covers/Complicity_annatodd2.png");
        book.put(GlobalConstants.BOOK_COLLECTION_FIELDS[4], "245");
        book.put(GlobalConstants.BOOK_COLLECTION_FIELDS[5], "Action");
        booksCollectionDB.add(book);

    }

    public Map<String, Object> getBookByID(String bookID) throws InterruptedException, ExecutionException {
        List<QueryDocumentSnapshot> allBooks = booksCollectionDB.get().get().getDocuments();
        for (QueryDocumentSnapshot queryDocumentSnapshot : allBooks) {
            if (queryDocumentSnapshot.getId().equals(bookID)) {
                return queryDocumentSnapshot.getData();
            }
        }
        return null;
    }

    public String makeCompleteRefferenceToBook(String bookName, String authorUsername, String refference) {
        return refference + GlobalConstants.FIREBASE_STORAGE_COVERS_FOLDER + "/" + bookName.toLowerCase() + "_"
                + authorUsername.toLowerCase() + ".png";
    }

    public int getBookChapters(String bookID) throws InterruptedException, ExecutionException {
        Map<String, Object> bookData = getBookByID(bookID);
        System.out.println(bookData.get(GlobalConstants.BOOK_COLLECTION_FIELDS[GlobalConstants.NUMBER_OF_CHAPTERS_INDEX]));
        int numberOfChapers = Integer.parseInt(bookData.get(GlobalConstants.BOOK_COLLECTION_FIELDS[GlobalConstants.NUMBER_OF_CHAPTERS_INDEX]).toString());
        return numberOfChapers;
    }

    public String getBookChapterTitle(String bookID, int chapterNumber) throws InterruptedException, ExecutionException {
        Map<String, Object> bookData = getBookByID(bookID);
        Object chapterTitles = bookData.get(GlobalConstants.BOOK_COLLECTION_FIELDS[GlobalConstants.CHAPTER_TITLE_INDEX]);
        
        String chapterTitlesString = chapterTitles.toString();
        String[] chapterTitlesArray = chapterTitlesString.substring(1, chapterTitlesString.length() - 1).split(", ");
        return chapterTitlesArray[chapterNumber];
    }

    public ArrayList<HashMap<String, Object>> getBookChapterContent(String bookID, int chapterNumber) throws InterruptedException, ExecutionException {
        Map<String, Object> bookData = getBookByID(bookID);
        Object chapterContents = bookData.get(GlobalConstants.BOOK_COLLECTION_FIELDS[GlobalConstants.CHAPTER_CONTENT_INDEX]);
        List<Object> chapterContentsList = (List<Object>) chapterContents;
    
        // Ensure that the chapterNumber is within valid range
        if (chapterNumber < 0 || chapterNumber >= chapterContentsList.size()) {
            throw new IllegalArgumentException("Invalid chapterNumber");
        }
    
        Map<String, Object> chapterData = (Map<String, Object>) chapterContentsList.get(0);
        List<Object> paragraphsList = (List<Object>) chapterData.get("paragraphs");
        System.out.println("paragraphs list ");
        System.out.println(paragraphsList);
        // Ensure that the chapterNumber is within valid range

        if (chapterNumber < 0 || chapterNumber >= paragraphsList.size()) {
            throw new IllegalArgumentException("Invalid chapterNumber");
        }
        
        ArrayList<HashMap<String, Object>> chapterContentMap = new ArrayList<HashMap<String, Object>>();
        
        String chapterContent = "";
        int idParagraph = 0;
        for (Object paragraph : paragraphsList) {
            Map<String, Object> paragraphData =  (Map<String, Object>) paragraph;
            String paragraphContent = (String) paragraphData.get("content");
            HashMap<String, Object> paragraphMap = new HashMap<String, Object>();
            paragraphMap.put("id", idParagraph);
            paragraphMap.put("content", paragraphContent);
            chapterContentMap.add(paragraphMap);
            idParagraph++;
        }

        return chapterContentMap;
    }

    public String getBookDescription(String bookID) throws InterruptedException, ExecutionException {
        Map<String, Object> bookData = getBookByID(bookID);
        Object description = bookData.get(GlobalConstants.BOOK_COLLECTION_FIELDS[GlobalConstants.BOOK_DESCRIPTION_INDEX]);
        String bookDescription = description.toString();
        return bookDescription;
    }

     public ArrayList<HashMap<String, Object>> getBookParagraphComments(String bookID, int chapterNumber, int paragraphNumber) throws InterruptedException, ExecutionException {
        Map<String, Object> bookData = getBookByID(bookID);
        Object chapterContents = bookData.get(GlobalConstants.BOOK_COLLECTION_FIELDS[GlobalConstants.CHAPTER_CONTENT_INDEX]);
        List<Object> chapterContentsList = (List<Object>) chapterContents;
    
        // Ensure that the chapterNumber is within valid range
        if (chapterNumber < 0 || chapterNumber >= chapterContentsList.size()) {
            throw new IllegalArgumentException("Invalid chapterNumber");
        }
    
        Map<String, Object> chapterData = (Map<String, Object>) chapterContentsList.get(0);
        List<Object> paragraphsList = (List<Object>) chapterData.get("paragraphs");
        System.out.println("paragraphs list ");
        System.out.println(paragraphsList);
        // Ensure that the chapterNumber is within valid range

        if (chapterNumber < 0 || chapterNumber >= paragraphsList.size()) {
            throw new IllegalArgumentException("Invalid chapterNumber");
        }
        
        ArrayList<HashMap<String, Object>> paragraphCommentsMap = new ArrayList<HashMap<String, Object>>();
        
        for (Object paragraph : paragraphsList) {
            Map<String, Object> paragraphData =  (Map<String, Object>) paragraph;
            paragraphCommentsMap = (ArrayList<HashMap<String, Object>>) paragraphData.get("comments");
        }

        return paragraphCommentsMap;
    }

}
