package booksapp.root.services;

import booksapp.root.models.Book;
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

    public ArrayList<HashMap<String, String>> getAllPopularBooks() throws ExecutionException, InterruptedException {
        // get all documents from the book collection
        Query collectionDocumentsQuery = booksCollectionDB.get().get().getQuery();
    
        // order documents descending by popularity; get the first 10 popular
        collectionDocumentsQuery = collectionDocumentsQuery
                .orderBy(GlobalConstants.BOOK_COLLECTION_FIELDS[4], Direction.DESCENDING)
                .limit(GlobalConstants.DISPLAYED_BOOKS_IN_HOME_SCREEN);
    
        // get the list of documents resulted from the query
        List<QueryDocumentSnapshot> documentsList = collectionDocumentsQuery.get().get().getDocuments();
    
        // get a list of maps with the id, cover, name, author name from the documents list
        ArrayList<HashMap<String, String>> resultedBooks = new ArrayList<HashMap<String, String>>();
        for (int i = 0; i < GlobalConstants.DISPLAYED_BOOKS_IN_HOME_SCREEN && i < documentsList.size(); i++) {
            if (documentsList.get(i) != null) {
                String bookID = documentsList.get(i).getId();
                HashMap<String, String> book = new HashMap<String, String>();
                book.put(GlobalConstants.BOOK_COLLECTION_FIELDS[0], bookID);
                book.put(GlobalConstants.BOOK_COLLECTION_FIELDS[1], documentsList.get(i).get(GlobalConstants.BOOK_COLLECTION_FIELDS[GlobalConstants.BOOK_TITLE_INDEX]).toString());
                book.put(GlobalConstants.BOOK_COLLECTION_FIELDS[2], documentsList.get(i).get(GlobalConstants.BOOK_COLLECTION_FIELDS[GlobalConstants.BOOK_AUTHOR_INDEX]).toString());
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
                .whereEqualTo(GlobalConstants.BOOK_COLLECTION_FIELDS[8], genre);

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
                bookFields.put(GlobalConstants.BOOK_COLLECTION_FIELDS[GlobalConstants.BOOK_ID_INDEX], book.getId().toString());
                // book name
                bookFields.put(GlobalConstants.BOOK_COLLECTION_FIELDS[1], book.get(GlobalConstants.BOOK_COLLECTION_FIELDS[1]).toString());
                // book author
                bookFields.put(GlobalConstants.BOOK_COLLECTION_FIELDS[2], book.get(GlobalConstants.BOOK_COLLECTION_FIELDS[2]).toString());

                booksToReturn.add(bookFields);
            }
            else {
                i--;
            }
        }
        return booksToReturn;
    }


    public void addBooks(Book book) {


        Map<String, Object> bookMap = new HashMap<>();
        bookMap.put("authorUsername", book.getAuthorUsername());
        bookMap.put("chaptersContents", book.getChaptersContents());
        bookMap.put("chaptersTitles", book.getChaptersTitles());
        bookMap.put("description", book.getDescription());
        bookMap.put("genre", book.getGenre());
        bookMap.put("name", book.getName());
        bookMap.put("numberOfChapters", book.getNumberOfChapters());
        bookMap.put("readers", book.getReaders());
          
        booksCollectionDB.add(bookMap);

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
        System.out.println("aici" + chapterNumber);
        // Ensure that the chapterNumber is within valid range
        if (chapterNumber < 0 || chapterNumber >= chapterContentsList.size()) {
            throw new IllegalArgumentException("Invalid chapterNumber");
        }
    
        Map<String, Object> chapterData = (Map<String, Object>) chapterContentsList.get(chapterNumber);
        List<Object> paragraphsList = (List<Object>) chapterData.get("paragraphs");
        System.out.println("paragraphs list ");
        System.out.println(paragraphsList);
        
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
    
        Map<String, Object> chapterData = (Map<String, Object>) chapterContentsList.get(chapterNumber);
        System.out.println("bsscfsfsdics");
        System.out.println(chapterData);
        HashMap<String, Object> selectedParagraph = ((List<HashMap<String, Object>>) chapterData.get("paragraphs")).get(paragraphNumber);
        System.out.println("bsdics");
        System.out.println(selectedParagraph);
        ArrayList<HashMap<String, Object>> paragraphComments = (ArrayList<HashMap<String, Object>>)selectedParagraph.get(GlobalConstants.PARAGRAPH_FIELDS[GlobalConstants.PARAGRAPH_COMMENTS_INDEX]);
        System.out.println("paragraphs data ");
        System.out.println(paragraphComments);
     
        return paragraphComments;
    }

}
